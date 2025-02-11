import { OffData, NutritionalInfo } from "./utils.js";
import FormData from "form-data";
import { Request, Response } from "express";

import("node-fetch").then(res => {
  if(!globalThis.fetch){
    // @ts-expect-error
    globalThis.fetch = res.default;
    // @ts-expect-error
    globalThis.Headers = res.Headers;
    // @ts-expect-error
    globalThis.Request = res.Request
    // @ts-expect-error
    globalThis.Response = res.Response;
    globalThis.Blob = res.Blob;
  }
})

const GET_URI = process.env.GET_OFF_URI || "";

async function getProfuctOffInternal(req: Request, res: Response, FullData = false){
  console.log("OpenFoodFacts product query");

  try{
    const { ref } = req.params;

    const url = `${GET_URI}/${ref}`
    console.log("URL: ", url)
    const OffRes = await fetch(url);

    if (!OffRes.ok) {
      if (OffRes.status === 404) {
        console.log("404 not found");
        res.status(404).send({ product: null, infoProducto: undefined });
        return;
      }
      console.error("error: ", OffRes.ok, ", ", OffRes.statusText)
    }

    const data = await OffRes.json();

    if (!data.product) {
      console.log("Product not found");
      res.status(404).send({ product: null, infoProducto: undefined });
      return;
    }

    console.log("product fetched");

    const product = {
      referencia: data.product.id,
      nombre: data.product.product_name_es ?? data.product.product_name,
      foto: data.product.image_url,
      categorias: data.product.categories.split(",").map((s:string) => s.trim()),
      nutriscore: data.product.nutriscore_grade
    };

    const productInfo = OffData(data);


    console.log("succesfull: ", product);
    if(FullData){
      res.send({producto: product, infoProducto: productInfo, data})
    }else{
      res.send({producto: product, infoProducto: productInfo});
    }
  }
  catch(error) {
    console.error("error", error);
    res.status(500).send({message:"error retrieving product", error})
  }
}

type ProductBaseInfo = {
  referencia: string;
  nombre: string;
  categorias: string[];
}

async function createProductOFFInternal(req: Request, res: Response){

  try {
  const {producto, infoProducto}: {producto: ProductBaseInfo, infoProducto: NutritionalInfo} = req.body;

  const OffFormData = new FormData();
  OffFormData.append("user_id", "jurodriguezch");
  OffFormData.append("password", "OpenFoodFactsNutriScan");
  OffFormData.append("code", producto.referencia);
  OffFormData.append("product_name", producto.nombre);
  OffFormData.append("categories", producto.categorias.join(", "))
  OffFormData.append("lang", "es");
  OffFormData.append("quantity", `${infoProducto.cantidad.toString()} ${infoProducto.unidadCantidad}`);
  OffFormData.append("nutrition_data_per", "100g");
  OffFormData.append("nutriment_energy", infoProducto.energia.toString());
  OffFormData.append("nutriment_energy_unit", infoProducto.unidadEnergia)

  OffFormData.append("nutriment_fiber", infoProducto.fibra.toString());
  OffFormData.append("nutriment_fiber_unit", infoProducto.unidadFibra);
  OffFormData.append("nutriment_fat", infoProducto.grasas.toString());
  OffFormData.append("nutriment_fat_unit", infoProducto.unidadGrasas);
  OffFormData.append("nutriment_saturated-fat", infoProducto.grasaSaturada.toString());
  OffFormData.append("nutriment_saturated-fat_unit", infoProducto.unidadGrasaSaturada);
  OffFormData.append("nutriment_carbohydrates", infoProducto.carbohidratos.toString());
  OffFormData.append("nutriment_carbohydrates_unit", infoProducto.unidadCarbohidratos);
  OffFormData.append("nutriment_sugars", infoProducto.azucar.toString());
  OffFormData.append("nutriment_sugars_unit", infoProducto.unidadAzucar);
  OffFormData.append("nutriment_sodium", infoProducto.sodio.toString());
  OffFormData.append("nutriment_sodium_unit", infoProducto.unidadSodio);
  OffFormData.append("nutriment_proteins", infoProducto.proteina.toString());
  OffFormData.append("nutriment_proteins_unit", infoProducto.unidadProteina);
  
  const requestOptions = {
    method: "POST",
    body: OffFormData
  };
  
// @ts-expect-error
  const OffRes = await fetch("https://co.openfoodfacts.net/cgi/product_jqm2.pl", requestOptions);
  const info = await OffRes.json();

  console.log(info);
  res.status(OffRes.status).send(info);

  } catch(error) {
    console.error("error creating product: ", error);
    res.status(500).send({message: "error creating product", error})
  }
}


export default {
  async getProfuctOffFullData(req: Request, res: Response){
    return getProfuctOffInternal(req, res, true);
  },

  async getProfuctOff(req: Request, res: Response) {
    return getProfuctOffInternal(req, res);
  },
  
  async createProductOFF(req: Request, res: Response) {
    return createProductOFFInternal(req, res);
  },

  async uploadOffImg(req: Request, res: Response){
    try {
      const { referencia } = req.body;
      const file = req.file;
  
      console.log("uploadOffImage", {code: referencia, inageField:"front_es", file});
  
      if(file){
  
        const formdata = new FormData();
        formdata.append("user_id", "jurodriguezch");
        formdata.append("password", "OpenFoodFactsNutriScan");
        formdata.append("code", referencia);
        formdata.append("imagefield", "front_es");
        formdata.append(`imgupload_${"front_es"}`, file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype,
          knownLength: file.size
        });
  
        const requestOptions = {
          method: "POST",
          body: formdata
        };
  
      // @ts-expect-error
        const response = await fetch("https://world.openfoodfacts.net/cgi/product_image_upload.pl", requestOptions);
        const result = await response.json();
  
        console.log("success");
        res.status(200).json(result);
      }else{
        throw new Error("field offimg return undefined")
      }
  
    } catch(error){
      console.error("error on uploadOffImg: ", error);
      if (error instanceof Error) {
        res.status(500).json({"message":error.message});
      }else{
        res.status(500).json(error);
      }
    }
  }
};
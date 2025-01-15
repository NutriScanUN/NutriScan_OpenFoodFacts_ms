const fetch = require("node-fetch");
const { OffData } = require("./utils");

async function getProfuctOffInternal(req, res, FullData = false){
  console.log("OpenFoodFacts product query");

  try{
    const { ref } = req.params;

    const url = `https://world.openfoodfacts.net/api/v2/product/${ref}`
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
      categorias: data.product.categories.split(",").map(s => s.trim()),
      nutriscore: data.product.nutriscore_grade
    };

    const infoProducto = OffData(data);


    console.log("succesfull");
    if(FullData){
      res.send({product, infoProducto, data})
    }else{
      res.send({product, infoProducto});
    }
  }
  catch(error) {
    console.error("error", error);
    res.status(500).send({message:"error retrieving product", error})
  }
}


module.exports =  {

  async getProfuctOffFullData(req, res){
    return getProfuctOffInternal(req, res, true);
  },

  async getProfuctOff(req, res) {
    return getProfuctOffInternal(req, res);
  },
  
};

export type NutritionalInfo = {
  carbohidratos: number;
  unidadCarbohidratos: string;
  grasas: number;
  unidadGrasas: string;
  grasaSaturada: number;
  unidadGrasaSaturada: string;
  azucar: number;
  unidadAzucar: string;
  proteina: number;
  unidadProteina: string;
  sodio: number;
  unidadSodio: string;
  fibra: number;
  unidadFibra: string;
  energia: number;
  unidadEnergia: string;
  cantidad: string;
  unidadCantidad: string;
  imagenFrontalUrl: string;
  nivelesAltos: string[];
};

const translations: any = {
  "fat": "Grasas",
  "salt": "Sal",
  "saturated-fat": "Grasas saturadas",
  "sugars": "Azúcares"
};

function getQuantityUnit(quantity: string){
  if(!quantity) return "";
  let list = quantity.split(" ");
  if(list[1]) return list[1];

  if(quantity.endsWith("ml")) return "ml";
  if(quantity.endsWith("mg")) return "mg";
  return quantity.slice(quantity.length-1);
}

export function OffData(data: any){
    const {nutriments, quantity, product_quantity, product_quantity_unit, image_url, nutrient_levels} = data.product;

    const offData : NutritionalInfo = {
      carbohidratos: nutriments.carbohydrates_value,
      unidadCarbohidratos: nutriments.carbohydrates_unit,
      grasas: nutriments.fat_value,
      unidadGrasas: nutriments.fat_unit,
      grasaSaturada: nutriments["saturated-fat_value"],
      unidadGrasaSaturada: nutriments["saturated-fat_unit"],
      azucar: nutriments.sugars_value,
      unidadAzucar: nutriments.sugars_unit,
      proteina: nutriments.proteins_value,
      unidadProteina: nutriments.proteins_unit,
      sodio: nutriments.sodium_value,
      unidadSodio: nutriments.sodium_unit,
      fibra: nutriments.fiber_value,
      unidadFibra: nutriments.fiber_unit,
      energia: nutriments.energy_value,
      unidadEnergia: nutriments.energy_unit,
      cantidad: product_quantity,
      unidadCantidad: product_quantity_unit ?? getQuantityUnit(quantity),
      imagenFrontalUrl: image_url,
      nivelesAltos: Object.keys(nutrient_levels ?? {})
      .filter(key => nutrient_levels[key] === "high")
      .map(key => translations[key]),
    }

    return offData;
}

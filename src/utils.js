    /**
 * @typedef {Object} NutritionalInfo
 * @property {number} carbohidratos - Value for carbohydrates.
 * @property {string} unidadCarbohidratos - Unit for carbohydrates.
 * @property {number} grasas - Value for fats.
 * @property {string} unidadGrasas - Unit for fats.
 * @property {number} grasaSaturada - Value for saturated fats.
 * @property {string} unidadGrasaSaturada - Unit for saturated fats.
 * @property {number} azucar - Value for sugars.
 * @property {string} unidadAzucar - Unit for sugars.
 * @property {number} proteina - Value for proteins.
 * @property {string} unidadProteina - Unit for proteins.
 * @property {number} sodio - Value for sodium.
 * @property {string} unidadSodio - Unit for sodium.
 * @property {number} fibra - Value for fiber.
 * @property {string} unidadFibra - Unit for fiber.
 * @property {number} energia - Value for energy.
 * @property {string} unidadEnergia - Unit for energy.
 * @property {number} cantidad - Product quantity.
 * @property {string} unidadCantidad - Unit for product quantity.
 * @property {string} imagenFrontalUrl - URL for the front image.
 * @property {string[]} nivelesAltos - List of high nutrient levels, translated.
 */

const translations = {
  "fat": "Grasas",
  "salt": "Sal",
  "saturated-fat": "Grasas saturadas",
  "sugars": "Azúcares"
};

function getQuantityUnit(quantity){
  if(!quantity) return "";
  let list = quantity.split(" ");
  if(list[1]) return list[1];

  if(quantity.endsWith("ml")) return "ml";
  if(quantity.endsWith("mg")) return "mg";
  return quantity.slice(quantity.length-1);
}

function OffData(data){
    const {nutriments, quantity, product_quantity, product_quantity_unit, image_url, nutrient_levels} = data.product;


/** @type {NutritionalInfo} */
    const offData = {
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

module.exports = { OffData }
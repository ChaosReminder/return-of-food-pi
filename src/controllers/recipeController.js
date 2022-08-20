require("dotenv").config();
const axios = require("axios");
const { Recipe, Diet } = require("../db");

const {
  API_KEY,
  API_KEY1,
  API_KEY2,
  API_KEY3,
  API_KEY4,
  API_KEY5,
  API_KEY6,
  API_KEY7,
  API_KEY8,
  API_KEY9,
} = process.env;

const API_KEYX = [
  API_KEY,
  API_KEY1,
  API_KEY2,
  API_KEY3,
  API_KEY4,
  API_KEY5,
  API_KEY6,
  API_KEY7,
  API_KEY8,
  API_KEY9,
];

const getApiInfo = async (req, res) => {
  try {
    let i = 0;
    const apiUrl = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${
        API_KEYX[5] || API_KEY
      }&addRecipeInformation=true&number=100`
    );
    const bunchRecipes = await apiUrl.data.results.map((food) => ({
      id: `${food.id}`,
      image: food.image,
      title: food.title,
      summary: food.summary,
      hScore: food.healthScore,
      steps: food.analyzedInstructions[0]?.steps.map((el) => `${el.step}`),
      diets: food.diets,
      price: food.pricePerServing,
    }));
    return bunchRecipes;
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const getDbInfo = async () => {
  const service = await Recipe.findAll({
    include: {
      model: Diet,
      attributes: ["name"],
    },
  });
  return service;
};

const getAllRecipes = async () => {
  const apiInfo = await getApiInfo();
  // eslint-disable-next-line no-unused-vars
  const dbInfo = await getDbInfo();
  const allInfo = apiInfo.concat(dbInfo);
  // eslint-disable-next-line no-unused-vars
  return allInfo.filter(Boolean);
};

module.exports = { getAllRecipes, getApiInfo };
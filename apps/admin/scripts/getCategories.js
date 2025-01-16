const { default: axios } = require('axios');
const { saveFile } = require('./saveFile');

require('dotenv').config();
const API_HOST = `${process.env.NEXT_PUBLIC_API}/v1`;

const getCategoriesJson = async () => {
  try {
    const { data } = await axios.get(`${API_HOST}/category`);
    const { saved, error } = await saveFile(
      __dirname + '/../data/categories.json',
      data.data.categories
    );
    if (saved) {
      console.log('Categories Written successfully');
      return { success: true };
    } else throw new Error(error);
  } catch (error) {
    console.error('Error writing categories: ', error.error);
    return { success: false, error };
  }
};

module.exports = { getCategoriesJson };

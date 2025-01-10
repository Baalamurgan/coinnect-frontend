const { getCategoriesJson } = require('./scripts/getCategories');

require('dotenv').config();
// const environment = process.env.NODE_ENV;

const preBuild = async () => {
  const results = await Promise.all([
    // environment === 'production' ? getIntlRates() : { success: true },
    getCategoriesJson()
  ]);
  const errors = results.filter((result) => !result.success);
  if (errors.length) {
    console.log(results);
    process.exit(1);
  } else process.exit(0);
};

preBuild();

const { writeFile } = require('fs');

const saveFile = (filename, data, stringify = true) =>
  new Promise(async (resolve, reject) => {
    try {
      writeFile(
        filename,
        stringify ? JSON.stringify(data, null, 2) : data,
        (err) => {
          if (err) {
            reject({ saved: false, error: err });
            return console.error(err);
          }
          resolve({ saved: true });
        }
      );
    } catch (error) {
      console.error(error);
      reject({ saved: false, error });
    }
  });

module.exports = { saveFile };

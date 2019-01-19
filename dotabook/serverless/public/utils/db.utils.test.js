const dbUtils = require('./db.utils');

const test = async () => {
  try {
    const test = await dbUtils.getUser('76561197993242090');
    console.log(test);
  } catch (error) {
    console.log(error);
  }
};

test();

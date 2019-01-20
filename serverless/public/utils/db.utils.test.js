const dbUtils = require('./db.utils');

const testGetUser = async () => {
  try {
    const test = await dbUtils.getUser('76561197993242090');
    console.log(test);
  } catch (error) {
    console.log(error);
  }
};

const testFindUser = async () => {
  try {
    const test = await dbUtils.searchUser('GrimstrokeOnly');
    console.log('test', test);
  } catch (error) {
    console.log(error);
  }
};

testFindUser();

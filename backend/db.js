const mongodb = require("mongodb");

let _db;
const initDb = async callback => {
  try {
    if (_db) {
      console.log("database already initialised");
      return callback(null, _db);
    }
    const client = await mongodb.MongoClient.connect(process.env.MONGO_CLIENT, {
      useUnifiedTopology: true
    });
    _db = client;
    callback(null, _db);
  } catch (error) {
    callback(error);
  }
};
const getDb = () => {
  if (!_db) {
    throw new Error("Database not initialised");
  }
  return _db;
};

module.exports = { initDb, getDb };

const { MongoClient } = require('mongodb');

const uri = process.env.CONNECTION_URI;
module.exports = MongoClient.connect(uri, { useNewUrlParser: true });

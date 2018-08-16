require('dotenv').config();
const express = require('express');
const engines = require('consolidate');
const compression = require('compression');
const bodyParser = require('body-parser');
const debug = require('debug')('app:main');
const mongoDBConnection = require('./connection');

const main = async () => {
  try {
    const mongoDB = await mongoDBConnection;
    debug('Connected to database!');

    const app = express();

    app.use('/images', express.static('images'));
    app.use(compression());
    app.use(bodyParser.json()); // handle json data
    app.use(bodyParser.urlencoded({ extended: true })); // handle URL-encoded data

    app.engine('html', engines.nunjucks);
    app.set('view engine', 'html');
    app.set('views', `${__dirname}/views`);

    app.get('/', async (req, res) => {
      const db = mongoDB.db('video');
      const docs = await db.collection('movieDetails').aggregate([{ $sample: { size:12 } }]).toArray();
      debug('Results: %d', docs.length);
      res.render('movies', { movies: docs });
    });

    app.use((req, res) => {
      res.status(404).send('Not Found');
    });

    const server = app.listen(8000, () => {
      debug(`Server running on port: ${server.address().port}`);
    });
  } catch (err) {
    debug(err);
  }
};

main();

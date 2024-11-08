const mongoose = require('mongoose');
const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { handleCallAPI } = require('./src/server/api/api');
const { MONGO_DB_URL, PORT } = require('./src/Config/config');

mongoose.connect(MONGO_DB_URL);

const app = express();
app.use(cors({ origin: '*' }));
app.use(function (req, res, next) {
   res.header("Access-Control-Allow-Origin", '*');
   res.header("Access-Control-Allow-Credentials", true);
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
   res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,multipart/form-data');
   next();
});

const server = http.createServer(app);
app.use(express.static(path.resolve('./public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

server.listen(PORT, () => {
   console.log(`Server is running and listening on port ${PORT}`);
   const host = server.address().address === '::' ? 'localhost' : server.address().address;
   const domain = `${host}:${PORT}`;
   console.log(`App domain: ${domain}`);
});

app.post('/eco-dolphin/api/requestHandle', cors(), async function (req, res) {
   handleCallAPI(req, res)
})

app.get('/eco-dolphin/api/ping', cors(), function (req, res) {
   res.send('pong');
});

async function connectToMongoDB() {
   require('mongoose-long')(mongoose);
   try {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(MONGO_DB_URL, {
         serverSelectionTimeoutMS: 30000, // Adjust timeout as needed
         socketTimeoutMS: 45000, // Adjust socket timeout as needed
      });
      console.log('Connected to MongoDB successfully');
   } catch (err) {
      console.error('Failed to connect to MongoDB after retries', err);
   }
}

async function startServer() {
   await connectToMongoDB();
}

startServer(); 
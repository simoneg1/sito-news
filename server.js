const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();
app.use(cors());
const APIkey = process.env.APIkey;

 

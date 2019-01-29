// [START functionsimport]
const functions = require('firebase-functions');
const express = require('express'); // eslint-disable-line

const matchMock = require('./matchMock');

const app = express();

app.use(matchMock);
exports.api = functions.https.onRequest(app);

const express = require('express');
const quoteManager = require('../core/quoteManager');

const api = express();

api.get('/quotes/random', (req, res) => {
    quoteManager.getRandom()
                .then( quote => {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(quote));
                })
                .catch( error => {
                    res.send(JSON.stringify({ error }));
                });
});

api.get('/quotes/:uuid', (req, res) => {
    quoteManager.get(req.params.uuid)
                .then( quote => {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(quote));
                })
                .catch( error => {
                    res.send(JSON.stringify({ error }));
                });
});

module.exports = api;

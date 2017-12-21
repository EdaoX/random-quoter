const express = require('express');
const quoteManager = require('../core/quoteManager');
const quotes = express();
const os = require('os');
const config = require('../config/config');

const viewQuote = ( quote, res, autoUpdate = false ) => {
    if(quote)
        res.render('quote', { quote, autoUpdate } );
    else
        res.send('Quote not found');
};

quotes.get('/create', (req, res) => {
    res.render('create');
});

quotes.post('/create', async (req, res) => {

    const body = req.body['quote-body'];
    const author = req.body['quote-author'];

    const quote = await quoteManager.add({ author, body });

    if(quote)
        res.redirect(res.locals.url(`/quotes/${quote.uuid}`));
    else
        res.redirect('/quotes/create');

});

quotes.get('/download', async (req, res) => {
    res.set({
        'Content-Disposition' : 'attachment; filename=\"quotes.txt\"',
        'Content-type' : 'text/csv'
    });
    res.send(await quoteManager.dumpToTxt());

});

quotes.get('/random', async (req, res) => {

    const quote = await quoteManager.getRandom();

    viewQuote( quote, res );

});

quotes.get('/dash', async (req, res) => {

    const quote = await quoteManager.getRandom();

    viewQuote( quote, res, true );

});

quotes.get('/:uuid', async (req, res) => {

    const quote = await quoteManager.get(req.params.uuid)

    viewQuote( quote, res );

})

module.exports = quotes;

const oldQuotes = require('../data/quotes.js');
const quoteManager = require('../core/quoteManager');

oldQuotes.forEach( quote => {

    quote.id = undefined;

    quoteManager.add(quote, false);

});

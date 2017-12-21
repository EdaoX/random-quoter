const config = require('../config/config');
const path = require('path');
const Datastore = require('nedb');
const uniqid = require('uniqid');

const quotesDB = new Datastore({
    filename : path.resolve(config.DATA_FOLDER, './quotes.json'),
    autoload : true
});

const makeLine = ( quote ) => {
    return (
        `quote  : ${quote.body}\n`       +
        `author : ${quote.author}\n`     +
        `date   : ${quote.created_on}\n` +
        `____________________________\n`
    );
};

const createQuoteManager = () => {

    let quoteManager = {};

    quoteManager.getRandom = () => {

        return new Promise((resolve, reject) => {

            quotesDB.count({}, (err, count) => {

                if(count > 0) {
                    const skipCount = Math.floor(Math.random() * count);

                    quotesDB.find({}).skip(skipCount).limit(1).exec(( err, quotes ) => {

                        if( err )
                            reject( err );
                        else
                            resolve( quotes.length ? quotes[0] : null );

                    });
                }
                else
                    resolve([]);

            });

        });

    }

    quoteManager.get = ( uuid ) => {

        // Return Promise
        return new Promise( (resolve, reject) => {
            quotesDB.find({ uuid }).limit(1).exec( (err, quotes) => {
                if(err)
                    reject( err );
                else
                    resolve( quotes.length ? quotes[0] : null );
            } );
        } );

    }

    quoteManager.add = ( quote, forceTime = true ) => {
        // TODO - Implement createQuote( data );
        quote.uuid = quote.uuid || uniqid();
        if(forceTime)
            quote.created_on = new Date().toISOString()
                                     .replace('T', ' ')
                                     .split('.')[0];
        // Returns Promise
        return new Promise( (resolve, reject) => {
            quotesDB.insert(quote, (err, quote) => {
                if(err)
                    reject( err );
                else
                    resolve( quote );
            });
        });
    }

    quoteManager.dumpToTxt = () => {

        return new Promise( (resolve, reject ) => {

            quotesDB.find({}).sort({ created_on : 1 }).exec( ( err, quotes ) => {

                if(!err)
                    resolve( quotes.reduce( (txt,  quote) => txt + makeLine( quote ), '' ) )
                else
                    reject( err );

            } );

        });

    }

    return quoteManager;

};

module.exports = createQuoteManager();

'use strict';

var config = require( './config.json' );

var util = require('util');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// Mongo URL

var argv = require('minimist')(process.argv);
var dbhost = argv.dbhost ? argv.dbhost : config.db_host;
const mongourl = config.db_prot+"://"+dbhost+":"
        +config.db_port+"/"+config.db_name

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */

module.exports = { troubleTicketHome };

  // troubleTicket home document: GET /v2/hal/troubleTicketHome/

  function troubleTicketHome(req, res) {

  // Use connect method to connect to the server
  MongoClient.connect(mongourl, function(err, db) {
    assert.equal(null, err);

    // Get the documents collection
 
    var collection = db.collection('troubleTicket');

    // Find some documents
    collection.find().toArray(function(err, docs) {
        assert.equal(err, null);

        const totalsize = docs.length

        // create HAL response

        var halresp = {};

        halresp.createTroubleTicket = {
          href: config.tt_url_hal + 'troubleTicket',
          method: "POST"
        }
        if (totalsize > 0) {
          halresp.allTroubleTickets = {
            href: config.tt_url_hal + 'troubleTicket',
            method: "GET"
          }
          halresp.getTroubleTicket = {
            href: config.tt_url_hal + 'troubleTicket/{id}',
            method: "GET"
          }
          halresp.replaceTroubleTicket = {
            href: config.tt_url_hal + 'troubleTicket/{id}',
            method: "PUT"
          }
          halresp.updateTroubleTicket = {
            href: config.tt_url_hal + 'troubleTicket/{id}',
            method: "PATCH"
          }
          halresp.deleteTroubleTicket = {
            href: config.tt_url_hal + 'troubleTicket/{id}',
            method: "DELETE"
          }
        }

        halresp.numberOfTroubleTickets = totalsize

        res.json( halresp );
        });
    })
  }

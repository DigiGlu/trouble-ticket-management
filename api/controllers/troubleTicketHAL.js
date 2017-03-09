'use strict';

var config = require( './config.json' );

var util = require('util');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var troubleTicketStates = require('../utilities/troubleTicketStates')

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */

module.exports = { 
  troubleTicketFindHAL, 
  troubleTicketGetHAL, 
  troubleTicketPatchHAL };

  // Update troubleTicket by Id: PATCH /v2/troubleTicket/{id}

  function troubleTicketPatchHAL(req, res) {

  var troubleTicket = req.swagger.params.troubleTicket.value;
  var troubleTicketId = parseInt(req.swagger.params.troubleTicketId.value);

  // Use connect method to connect to the server
  MongoClient.connect(config.db_url, function(err, db) {
    assert.equal(null, err);

    // Get the documents collection
 
    var collection = db.collection('troubleTicket');

    const query = { id: troubleTicketId.toString() }

    // Update the document
    // db.troubleTicket.update( {id: "123"}, { $set: { status: "Rejected"} })

    var patchDoc = { $set: troubleTicket }

    // console.log( "Update: ", JSON.stringify( query), ", ", JSON.stringify(patchDoc) )

    collection.update( query, patchDoc, function(err, doc) {
        assert.equal(err, null);

        // Find one document
        collection.findOne( query, function(err, doc) {
            doc = generateTroubleTicketDoc( doc );
         })

        res.json( doc );
        });
    })
  }

  // Find a troubleTicket: GET /v2/hal/troubleTicket/

  function troubleTicketFindHAL(req, res) {

  // Use connect method to connect to the server
  MongoClient.connect(config.db_url, function(err, db) {
    assert.equal(null, err);

    var pageno = req.swagger.params.page.value ? parseInt(req.swagger.params.page.value) : 1;

    // Fixed page size for now

    const pagesize = 5

    const firstitem = (pageno-1)*pagesize
    const lastitem = firstitem + pagesize

    const baseURL = req.url.slice( 0, req.url.indexOf("?") )

    // Get the documents collection
 
    var collection = db.collection('troubleTicket');
  
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);

        const totalsize = docs.length

        // slice page
        docs = docs.slice( firstitem, lastitem )

        // Generate Trouble Ticket
        docs.forEach( function( item ) {
          item = generateTroubleTicketDoc( item, baseURL.concat( "/" ).concat( item.id ) )
        }) 

        // create HAL response

        var halresp = { 
          _links: { 
            self: { href: req.url },
            item: []
          }
        }  

        // add embedded resources if requested

       if ( req.swagger.params.embed.value == true ) {
          halresp._embed = {item: []}
          halresp._embed.item = docs 
          }

        // Add array of links
        docs.forEach( function( item ) {
            halresp._links.item.push( {
                  href: baseURL.concat( "/" ).concat( item.id )
                } ) 
        }) 

        // Pagination attributes

        halresp.page = pageno
        halresp.totalrecords = totalsize
        halresp.pagesize = pagesize
        halresp.totalpages = Math.ceil(totalsize/pagesize)

        // Create pagination links

        if ( totalsize > (pageno * pagesize) ) {
          halresp._links.next = { href: baseURL.concat("?page=").concat(pageno+1)}
        }

        halresp._links.first = { href: baseURL.concat("?page=1")}

        if ( pageno > 1 ) {
          halresp._links.previous = { href: baseURL.concat("?page=").concat(pageno-1)}          
        } 

        halresp._links.last = { href: baseURL.concat("?page=").concat(Math.ceil(totalsize/pagesize)) }

        res.json( halresp );
        });
    })
  }

  // Get one troubleTicket by Id: GET /v2/hal/troubleTicket/{id}

  function troubleTicketGetHAL(req, res) {

  var troubleTicketId = parseInt(req.swagger.params.troubleTicketId.value);

  // Use connect method to connect to the server
  MongoClient.connect(config.db_url, function(err, db) {
    assert.equal(null, err);

    // Get the documents collection
 
    var collection = db.collection('troubleTicket');

    const query = { id: troubleTicketId.toString() }

    // Find one document
    collection.findOne( query, function(err, doc) {
      doc= generateTroubleTicketDoc( doc, req.url );
  
      assert.equal(err, null);

      res.json( doc );
      })
    });
  }

function generateTroubleTicketDoc( doc, url ) {
  // delete the mongodb _id attribute from the JSON document
  delete doc["_id"]

  // create _links

  doc._links= {
            self: {
                href: url
                }
            }

  // create _actions

  doc._actions = [];

  var targetStates = troubleTicketStates.nextStates( doc.status );

  targetStates.forEach( function( state ) {
    doc._actions.push( {
      name: state,
      title: state,
      method: "PATCH",
      href: url,
      fields: [ 
        {
          name: "status",
          value: state
        },
        {
          name: "statusChangeReason",
          type: "string"
        }
      ]
    })
  })

  return doc;
}
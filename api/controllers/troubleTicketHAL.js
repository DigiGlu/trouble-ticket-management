'use strict';

var config = require( './config.json' );

var util = require('util');
var Promise = require('promise');

var mongoUtils = require('../utilities/mongoUtils')

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var axios = require('axios');

var troubleTicketStates = require('../utilities/troubleTicketStates')

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

module.exports = { 
  troubleTicketFindHAL, 
  troubleTicketFindHeader,
  troubleTicketGetHAL, 
  troubleTicketPatchHAL,
  troubleTicketCreateHAL };

  // Update troubleTicket by Id: PATCH /v2/troubleTicket/{id}

  function troubleTicketPatchHAL(req, res) {

  var troubleTicket = req.swagger.params.troubleTicket.value;
  var troubleTicketId = parseInt(req.swagger.params.troubleTicketId.value);

  // Use connect method to connect to the server
  MongoClient.connect(mongourl, function(err, db) {
    assert.equal(null, err);

    // Get the documents collection
 
    var collection = db.collection('troubleTicket');

    const query = { id: troubleTicketId }

    var patchDoc = { $set: troubleTicket }

    collection.update( query, patchDoc, function(err, doc) {
        assert.equal(err, null);

        // Find one document
        collection.findOne( query, function(err, doc) {
            doc = generateTroubleTicketDoc( doc );

            res.json( doc );
         })

        });
    })
  }

  // Find a troubleTicket: GET /v2/hal/troubleTicket/

  function troubleTicketFindHAL(req, res) {

  // Use connect method to connect to the server
  MongoClient.connect(mongourl, function(err, db) {
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
    collection.find({}, 
        mongoUtils.fieldFilter(req.swagger.params.fields.value)).toArray(function(err, docs) {
        assert.equal(err, null);

        const totalsize = docs.length

        // slice page
        docs = docs.slice( firstitem, lastitem )

        // Generate Trouble Ticket
        docs.forEach( function( item ) {
          item = generateTroubleTicketDoc( item, baseURL.concat( "/" ).concat( item.id ) )
        }) 

        // create HAL response

        var halresp = {};

        // support v2 backward compatiblity if requested

        if ( req.swagger.params.embed.value == "v2" ) {
          halresp.troubleTicket = docs 
          }

        halresp._links = { 
            self: { href: req.url },
            item: []
        }
        
        // add embedded resources if requested

       if ( req.swagger.params.embed.value == "true" ) {
          halresp._embedded = {item: []}
          halresp._embedded.item = docs 
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

  function troubleTicketFindHeader(req, res) {

  // Use connect method to connect to the server
  MongoClient.connect(mongourl, function(err, db) {
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
    collection.find({}, 
        mongoUtils.fieldFilter(req.swagger.params.fields.value)).toArray(function(err, docs) {
        assert.equal(err, null);

        const totalsize = docs.length

        // slice page
        docs = docs.slice( firstitem, lastitem )

        // Generate Trouble Ticket
        docs.forEach( function( item ) {
          item = generateTroubleTicketDoc( item, baseURL.concat( "/" ).concat( item.id ) )
        }) 

        var links = { 
            self: { href: req.url }
        }
 
        // Pagination attributes

        //halresp.page = pageno
        //halresp.totalrecords = totalsize
        //halresp.pagesize = pagesize
        //halresp.totalpages = Math.ceil(totalsize/pagesize)

        // Create pagination links

        if ( totalsize > (pageno * pagesize) ) {
          links.next = { href: baseURL.concat("?page=").concat(pageno+1)}
        }

        links.first = { href: baseURL.concat("?page=1")}

        if ( pageno > 1 ) {
          links.previous = { href: baseURL.concat("?page=").concat(pageno-1)}          
        } 

        links.last = { href: baseURL.concat("?page=").concat(Math.ceil(totalsize/pagesize)) }

        res.header( "x-links", JSON.stringify(links))

        res.json( docs );
        });
    })
  }

  // Get one troubleTicket by Id: GET /v2/hal/troubleTicket/{id}

  function troubleTicketGetHAL(req, res) {

    var troubleTicketId = String( req.swagger.params.troubleTicketId.value );

    // Use connect method to connect to the server
    MongoClient.connect(mongourl, function(err, db) {
      assert.equal(null, err);

      // Get the documents collection
      var collection = db.collection('troubleTicket');
      const query = { id: troubleTicketId.toString() }

      // Find one document
      collection.findOne( query, 
        mongoUtils.fieldFilter(req.swagger.params.fields.value), function(err, doc) {

        assert.equal(err, null);

        if ( doc != undefined  ) {
          const halDoc = generateTroubleTicketDoc( doc, req.url );
      
          if ( req.swagger.params.embed.value == "party" && doc.relatedParty != undefined ) {
            // embed party instance in _embedded element

            halDoc._embedded = []

            var partyPromises = []

            // Create array of promises to get party instances
            doc.relatedParty.forEach( function(party){
              partyPromises.push( generatePartyDoc(config.tt_host + party.href, halDoc._embedded));
            })

            // Request instances
            Promise.all( partyPromises ).then( function(){ res.json( halDoc )} )
          }
          else {
            res.json( halDoc )
          }
        } else {
          res.json( "{}")
        }
      })
    });
  }

function generatePartyDoc( partyUrl, embeddedDoc ) {
  return new Promise( function( resolve) {
          axios.get( partyUrl, {
            dataType: 'json',
            headers: {
              'Accept': 'application/hal+json'
            },
            mode: 'no-cors' 
          }).then(function (response) {
              embeddedDoc.push( response.data )
              resolve();
          }).catch(function (error) {
              console.log(error)
              reject();
          })
    });
}

  // Create a new troubleTicket: POST /v2/troubleTicket

  function troubleTicketCreateHAL(req, res) {
  var troubleTicket = req.swagger.params.troubleTicket.value;

  if (troubleTicket.id == undefined) {
    troubleTicket.id = guid();
  }

  var self = req.url.slice( 0, req.url.indexOf("?") ) + "/" + troubleTicket.id

  // Use connect method to connect to the server
  MongoClient.connect(mongourl, function(err, db) {
    assert.equal(null, err);

    // Get the documents collection
    var collection = db.collection('troubleTicket');
    // Insert some documents
    collection.insert( troubleTicket, function(err, result) {
      assert.equal(err, null)
      });
    db.close();
    });
    res.json( generateTroubleTicketDoc( troubleTicket, self ));
   }

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4();
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
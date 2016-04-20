'use strict';

const express        = require('express');
const app            = express();
const path           = require('path');
const got            = require('got');
const url            = require('url');

app.use('/client', express.static(path.join(__dirname, '/client')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/opensearch', function(req, res){
  let query = url.parse(req.url, true).query.query;
  let wikiUrl = `http://de.wikipedia.org/w/api.php?action=opensearch&search=${query}&format=json`;
  got(wikiUrl, { json: true })
  	.then(response => {
      let suggestion = response.body[1].map(function(word){
        return { word: word };
      });
  		res.json(suggestion);
  	})
  	.catch(error => {
  		console.log(error.response.body);
      res.status(404).json({});
  	});
});

const server = require('http').Server(app);

server.listen(3000, function(){
  console.log('listening on *:3000');
});

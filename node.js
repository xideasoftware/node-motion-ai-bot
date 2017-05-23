
// The contents of this file should be pasted into a Node.js Module in Motion AI on https://dashboard.motion.ai
var http = require("http");
var resultJSON = "";
var q = require('q');
var express = require('express');

function getTriviabot() {

    var request = require('request'); // require the request library so that we can make an API call below

    var deferred = q.defer();
    var options = {
      url: 'https://widgets.redmantech.com/gus-api@2.1.7/idx-edm-v5/q?property_types=house',
      headers: {
        'User-Agent': 'request',
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.IntcImZpbmdlcnByaW50XCI6XCIzMDkxNjEzNTU4fjVhNDI0OTE4MDZmMTliMzJjMGVhMjY3YjdkNjNiMDE0fmNpdzhnNmJ6MWxyZmowaG1teXNpaHh6M3NcIixcImFwcFwiOlwiZW5naW5lXCIsXCJzcGFjZVwiOlwicndwLTE4NjZcIixcInNldHRpbmdzX2lkXCI6XCJyd3AtMTg2Ni1ndXNcIn0i.XUAQZ90B_23yUgmGfnsg0YQ0linHC6tkP3XqwRx72YY'
      }
    };
  // API call to Open Trivia DB
    request(options, function(error, response, body) {
      console.log(JSON.stringify(response));
      resultJSON = JSON.parse(body);
      deferred.resolve(resultJSON);
    });
    return deferred.promise;
};

var app = express();

app.use(express.static('public'));
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/get', function (req, res) {
   // Prepare output in JSON format
   responseJSON = {
      price:req.query.price,
      bedrooms:req.query.bedrooms,
      bathrooms:req.query.bathrooms,
      address:req.query.address
   };
   console.log(JSON.stringify(responseJSON));
   getTriviabot().then(function(response) {
      var html = "";
      for (var i = 0 ; i < resultJSON.hits.hits.length ; i ++){
        if(resultJSON.hits.hits[i]._source.bedrooms >= responseJSON.bedrooms && 
          resultJSON.hits.hits[i]._source.bathrooms >= responseJSON.bathrooms && 
          resultJSON.hits.hits[i]._source.price <= responseJSON.price && 
          resultJSON.hits.hits[i]._source.address.indexOf(responseJSON.address) >= 0)
        {
          html += "-----HOUSE" + i + "-----\nPictures : " + JSON.stringify(resultJSON.hits.hits[i]._source.images) + "\n";
          html += "Address : " + resultJSON.hits.hits[i]._source.address + "\n";
          html += "Price : " + resultJSON.hits.hits[i]._source.price + "\n";
          html += "Bedrooms : " + resultJSON.hits.hits[i]._source.bedrooms + "\n";
          html += "Bathrooms : " + resultJSON.hits.hits[i]._source.bathrooms + "\n\n\n";
        }
      }
      res.end(html);
   });
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)

})
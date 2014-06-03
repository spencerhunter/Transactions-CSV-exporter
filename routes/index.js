var express = require('express');
var router = express.Router();
var util = require('util');
var request = require('request');
var dwolla = require('dwolla');
var json2csv = require('json2csv');
var _ = require('underscore');
var fs = require('fs');
var c = require('../config')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res) {
	var scope = 'Transactions';
	var client_id = c.client_id;
	var redirect_uri = 'http://127.0.0.1:3000/return';
	var url = util.format("https://www.dwolla.com/oauth/v2/authenticate?client_id=%s&response_type=code&redirect_uri=%s&scope=%s",
	 encodeURIComponent(client_id),
	 encodeURIComponent(redirect_uri),
	 encodeURIComponent(scope));
	res.redirect(url);
});

router.get('/return', function(req, res) {
	var client_id = c.client_id;
	var redirect_uri = 'http://127.0.0.1:3000/return';
	var client_secret = c.client_secret;
	var code = req.query.code;
	var url = util.format("https://www.dwolla.com/oauth/v2/token?client_id=%s&client_secret=%s&grant_type=authorization_code&redirect_uri=%s&code=%s",
	 encodeURIComponent(client_id),
	 encodeURIComponent(client_secret),
	 encodeURIComponent(redirect_uri), 
	 encodeURIComponent(code));
	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  var data = JSON.parse(body);
	  console.log(data.access_token);
	  res.redirect('/trans?token=' + encodeURIComponent(data.access_token));
	  }
	});
});

router.get('/trans', function(req, res) {
  res.render('trans', { title: 'Express' });
});

router.get('/Transactions', function(req, res) {
	var transactions = [];

	function getAllTransactions(token, skip, fn) {
	 //console.log('Getting some transactions');
	 params = {
	 	limit: 200,
	 	skip: skip
	 };

	 dwolla.transactions(req.query.token, params, function(err, data) {
	 	if (data.length > 0) {
	 	 // append response to transactions
	 	 //console.log("getting some transactions")
	 	 transactions = transactions.concat(data);

	 	 //console.log(data);

	 	 // get more transactions
	 	 return getAllTransactions(token, params.skip + params.limit, fn);
	 	}
	 	else {
	 	 // base case: there are no transactions in this chunk
	 	 // stop by calling the callback
	 	 return fn(transactions);
	 	}
	 });

	};

	getAllTransactions(req.query.token, 0, function(data) {
		data.forEach(function(transaction) {
			var sum = 0;
			if (transaction.Fees != null) {
				transaction.Fees.forEach(function(fee) {
					sum += fee.Amount;
				});
			}
			transaction.Fees = sum;
		});
		var keys = [];
		for(var k in data[0]) keys.push(k);
		//console.log("total " + keys.length + " keys: " + keys);	
		json2csv({data: data, fields: keys}, function(err, csv) {
	  	if (err) console.log(err);
	  		res.set('Content-Disposition', 'attachment; filename="allTransactions.csv"');
        	res.set('Content-Type', 'text/csv');
        	res.send(csv);
		  	/*fs.writeFile('file.csv', csv, function(err) {
		    if (err) throw err;
		    res.send('file saved');
		  	});*/
		});
	});

});


module.exports = router;

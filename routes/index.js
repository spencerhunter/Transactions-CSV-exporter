var express = require('express');
var router = express.Router();
var util = require('util');
var request = require('request');
var dwolla = require('dwolla');
var json2csv = require('json2csv');
var c = require('../config');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
//step 1
router.get('/login', function(req, res) {
	var scope = 'Transactions';
	var client_id = c.client_id;
	var redirect_uri = c.host + '/return';
	var url = util.format("https://www.dwolla.com/oauth/v2/authenticate?client_id=%s&response_type=code&redirect_uri=%s&scope=%s",
	 encodeURIComponent(client_id),
	 encodeURIComponent(redirect_uri),
	 encodeURIComponent(scope));
	res.redirect(url);
});
//step 2 & 3
router.get('/return', function(req, res) {
	var client_id = c.client_id;
	var redirect_uri = c.host + '/return';
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
	  req.session.access_token = data.access_token;
	  res.redirect('/trans');
	  }
	});
});

router.get('/trans', function(req, res) {
  res.render('trans', { title: 'Transactions CSV exporter' });
});

router.post('/Transactions', function(req, res) {
	var transactions = [];

	getAllTransactions(req.session.access_token, 0, req.body['from_date'], req.body['to_date'], req.body['allTypes'], [], function(data) {
		data.forEach(function(transaction) {
			var sum = 0;
			if (transaction.Fees != null) {
				transaction.Fees.forEach(function(fee) {
					sum += fee.Amount;
				});
			}
			transaction.Fees = sum;
			delete transaction.Destination;
			delete transaction.Source;
		});
		var keys = [];
		for(var k in data[0]) {
			keys.push(k);
		}
	
		json2csv({data: data, fields: keys}, function(err, csv) {
	  	if (err) console.log(err);
	  		res.set('Content-Disposition', 'attachment; filename="dwollaTransactions.csv"');
        	res.set('Content-Type', 'text/csv');
        	res.send(csv);
		});
	});

});

function getAllTransactions(token, skip, sinceDate, endDate, types, transactions, fn) {
	 //console.log('Getting some transactions');

	 params = {
	 	limit: 200,
	 	skip: skip,
	 	sinceDate: sinceDate,
	 	endDate: endDate,
	 	types: types
	 };
	 if (sinceDate.length == 0) {
	 	delete params.sinceDate;
	 }
	 if (endDate.length == 0) {
	 	delete params.endDate;
	 }
	 if (types.length == 0) {
	 	delete params.types;
	 }

	 dwolla.transactions(token, params, function(err, data) {
	 	if (data.length > 0) {
	 	 // append response to transactions
	 	 //console.log("getting some transactions")
	 	 transactions = transactions.concat(data);

	 	 // get more transactions
	 	 return getAllTransactions(token, params.skip + params.limit, sinceDate, endDate, types, transactions, fn);
	 	}
	 	else {
	 	 // base case: there are no transactions in this chunk
	 	 // stop by calling the callback
	 	 return fn(transactions);
	 	}
	 });

	};

module.exports = router;

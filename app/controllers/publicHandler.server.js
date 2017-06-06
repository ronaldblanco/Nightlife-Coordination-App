'use strict';

var Users = require('../models/users.js');
const yelp = require('yelp-fusion');
var request = require('request');
//var yelpToken;

function PublicHandler () {
	
	this.search = function (req, res) {
		
		var forSearch = req.originalUrl.toString().split("/api/:id/search/")[1].split("_");
		
		if(req.session.yelpToken === undefined){
		request(process.env.APP_URL + 'api/:id/gettoken', function (error, response, body) {
			if(error == null){
				var mybody = JSON.parse(body);
				req.session.yelpToken = mybody.jsonBody;
				console.log('New Token');
				//console.log(req.session.yelpToken);
				//req.session.yelpToken = JSON.parse(body.jsonBody).access_token;
			
				
				const client = yelp.client(req.session.yelpToken.access_token);
				var search = client.search({
					term: forSearch[1],
					location: forSearch[0]
				}).then(response => {
					//console.log(response.jsonBody.businesses[0].name);
					req.session.mySearch = response.jsonBody;
					res.send(response.jsonBody);
				}).catch(e => {
					console.log(e);
				});
				
			
			} 
			else console.log(error);
		});
		}else{
			
			console.log('Save Token');
			const client = yelp.client(req.session.yelpToken.access_token);
			var search = client.search({
				term: forSearch[1],
				location: forSearch[0]
			}).then(response => {
				//console.log(response.jsonBody.businesses[0].name);
				req.session.mySearch = response.jsonBody;
				res.send(response.jsonBody);
			}).catch(e => {
				console.log(e);
			});
			
		}
		
	
		
	};

	this.getToken = function (req, res) {
		const token = yelp.accessToken(process.env.YELP_KEY, process.env.YELP_SECRET).then(response => {
			//console.log(response.jsonBody.access_token);
			//token = JSON.parse(response.jsonBody);
			res.send(response);
		}).catch(e => {
			console.log(e);
		});
		//console.log(token);
		
	};

	this.getSearch = function (req, res) {
		if(req.session.mySearch != undefined){
			res.send(req.session.mySearch);
		}else res.send({'businesses':[]});
	};
	
	this.setIamgoing = function (req, res) {
		//console.log(req.originalUrl.toString().split("/add/")[1]);
		var idPhone = req.originalUrl.toString().split("/api/:id/searchiamgoing/")[1].split('_');
		
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { 'iamgoing.id':idPhone[0],'iamgoing.phone':idPhone[1] })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.iamgoing);
				}
			);
			
	};
	
	this.getIamgoing = function (req, res) {
		Users
			.findOne({ 'github.id': req.user.github.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }
				//console.log(result.iamgoing.phone);
				//result.polls.push("hola");
				//res.json(result.iamgoing);//Array
				
				const client = yelp.client(req.session.yelpToken.access_token);
 
				client.phoneSearch({
					phone:result.iamgoing.phone
				}).then(response => {
					console.log(response.jsonBody.businesses[0].name);
					res.send(response.jsonBody);
				}).catch(e => {
					console.log(e);
				});
				
			});
	};

}

module.exports = PublicHandler;

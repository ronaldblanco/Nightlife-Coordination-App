'use strict';

var Users = require('../models/users.js');
var Yelp = require('../models/yelps.js');
const yelp = require('yelp-fusion');
var request = require('request');

function addSeconds(seconds){
    var date = new Date();
    date.setSeconds(date.getSeconds() + seconds);
    return date;
}

function PublicHandler () {
	
	this.search = function (req, res) {
		
		var forSearch = req.originalUrl.toString().split("/api/:id/search/")[1].split("_");
		
		//console.log(req.session.yelpToken);
		if(req.session.yelpToken === undefined){
		request(process.env.APP_URL + 'api/:id/gettoken', function (error, response, body) {
			if(error == null){
				var mybody = JSON.parse(body);
				req.session.yelpToken = mybody.jsonBody;
				
				var newYelp = new Yelp();

					newYelp.token.access_token = mybody.jsonBody.access_token;
					newYelp.token.token_type = mybody.jsonBody.token_type;
					newYelp.token.expires_in = mybody.jsonBody.expires_in;
					
					newYelp.expire_date = addSeconds(mybody.jsonBody.expires_in);
					newYelp.add_date = new Date;

					newYelp.save(function (err) {
						if (err) {
							throw err;
						}
					});
						
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
			
			console.log('Saved in Session Token');
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
		
		//var isSave = false;
		//if(isSave === false){
		const token = yelp.accessToken(process.env.YELP_KEY, process.env.YELP_SECRET).then(response => {
			//console.log(response.jsonBody.access_token);
			//token = JSON.parse(response.jsonBody);
			console.log('New Get Token!');
			res.send(response);
		}).catch(e => {
			console.log(e);
		});
		//console.log(token);
	//	}
		
	};
	
	this.getSaveToken = function (req, res) {
		Yelp
			.findOne({ 'token.token_type': 'Bearer' }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }
				if (result){
					var date = new Date;
					if(result.expire_date > date){
						req.session.yelpToken = result.token;
						console.log('Saved in DB Token!');
						res.send({"statusCode": 200,"headers":{},"body":{},'jsonBody':{'access_token':result.token.access_token,'token_type':result.token.token_type,'expires_in':result.token.expires_in}})
					}else res.send({});
					
				}else{
					res.send({});
				}
				
			});
	};
	
	this.getSearch = function (req, res) {
		if(req.session.mySearch != undefined){
			res.send(req.session.mySearch);
		}else{
			
			/*Yelp
			.findOne({ 'token.token_type': 'Bearer' }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }
				if (result){
					var date = new Date;
					if(result.expire_date > date){
						req.session.yelpToken = result.token;
						//req.session.mySearch = {'businesses':[]};
						console.log(req.session);
						console.log('Saved in DB Token NO SEARCH!');
						//res.send({"statusCode": 200,"headers":{},"body":{},'jsonBody':{'access_token':result.token.access_token,'token_type':result.token.token_type,'expires_in':result.token.expires_in}})
					}
					
				}
				
			});*/
			
			
			res.send({'businesses':[]});
		} 
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
	
	this.rmIamgoing = function (req, res) {
		//console.log(req.originalUrl.toString().split("/add/")[1]);
		//var idPhone = req.originalUrl.toString().split("/api/:id/searchiamgoing/")[1].split('_');
		
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { 'iamgoing.id':'','iamgoing.phone':'' })
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
				//console.log(req.session);
				if(result && result.iamgoing.phone != ''){
				const client = yelp.client(req.session.yelpToken.access_token);
 
				client.phoneSearch({
					phone:result.iamgoing.phone
				}).then(response => {
					console.log(response.jsonBody.businesses[0].name);
					res.send(response.jsonBody);
				}).catch(e => {
					console.log(e);
				});
				
				}else res.send({businesses:[]});
				
			});
	};

}

module.exports = PublicHandler;

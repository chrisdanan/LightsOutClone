/*************
 * Author: Christopher Dancarlo Danan
 * Created: July 14, 2015
 * Modified: July 14, 2015
 * Purpose: Server for Lights Out clone project.
*************/

"use strict";

var express = require("express"),
	app = express(),
	http = require("http"),
	server = http.createServer(app),
	path = require("path"),
	bodyParser = require("body-parser"),
	port = 3000;

server.listen(port);
console.log("Listening on port " + port);

//Set up views folder.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//Set up static folder path.
app.use(express.static(__dirname + "/public"));

app.use(bodyParser());

//Routes.
app.get("/", function(req, res){
	res.render("index", {title: "Homepage"});
});


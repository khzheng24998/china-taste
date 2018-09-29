//To use Express.js
const express = require("express");
const app = express();

//For parsing cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//For parsing JSON
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Additional modules
const postHandler = require("./postValidation.js");
const Database = require("./database.js");

if (process.argv.length < 3)
{
	console.log("Missing argument!");
	return;
}

//////////////////////////////////////////////////////////////////

let resetRequests = [];
let verificationRequests = [];
let activeSessions = [];

let users = [];

const SendFile = require("./sendFile.js");
const Login = require("./login.js");
const Profile = require("./profile.js");
const Order = require("./order.js");

SendFile.sendFiles(app);
Login.loginEvents(app);
Profile.profileEvents(app, users, activeSessions, resetRequests, verificationRequests);
Order.orderEvents(app);

app.listen(3000, () => console.log('Example app listening on port 3000!'));
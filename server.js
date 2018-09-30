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

let port = process.env.PORT;
if (port == null || port == "")
	port = 3000;

app.listen(port, () => { console.log("App is listening on port " + port + "!") });
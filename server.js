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

SendFile.sendFiles(app);
Login.loginEvents(app);
Profile.profileEvents(app, users, activeSessions, resetRequests, verificationRequests);

/* Get menu and current order */

app.post('/get-combined', function(req, res)
{
	console.log("Received GET request from client! (get-combined)");

	let key = req.cookies.key;
	let combined = {};
	combined.menu = postHandler.getMenu(req.body);

	let index = Database.getRequestByKey(key, activeSessions);
	if (index === -1)
		combined.orderItems = [];
	else
	{
		let idx = Database.getAccountByEmail(activeSessions[index].userInfo.email, users);
		combined.orderItems = users[idx].currentOrder.items;
	}

	res.send(combined);
});

/* Update order */

app.post('/update-order', function(req, res)
{
	console.log("Received POST request from client! (update-order)");

	let key = req.cookies.key;
	let response = {};

	let index = Database.getRequestByKey(key, activeSessions);
	if (index !== -1)
	{
		let idx = Database.getAccountByEmail(activeSessions[index].userInfo.email, users);
		response.msg = "ok";
		postHandler.updateOrder(req.body, users[idx].currentOrder.items);
	}
	else
		response.msg = "signed-out";

	res.send(response);
});

/*//Update order info
app.post('/submit-order', function(req, res)
{
	console.log("Received POST request from client! (submit-order)");

	let orderId = req.cookies.orderId;
	if (typeof(currentOrders[orderId]) !== "undefined")
		postHandler.updateOrderInfo(req.body, currentOrders[orderId].info);

	emailModule.sendMail(process.argv[2], currentOrders[orderId]);
	placedOrders.push(currentOrders[orderId]);
	delete currentOrders[orderId];
	res.clearCookie("orderId");

	res.sendStatus(200);
});*/

//Send menu to client browser
app.post('/get-menu', function(req, res)
{
	console.log("Received POST request from client! (get-menu)");
	let menu = postHandler.getMenu(req.body);
	res.send(menu);
});

//Send order to client browser
/*app.get('/my-order', function(req, res)
{
	console.log("Received GET request from client! (my-order)");

	let empty = {};
	empty.info = {};
	empty.items = [];

	let key = req.cookies.key;
	let index = Database.getAccountByKey(key);
	if (key === -1)
		res.send(empty);
	else
	{
		let order = users[index].currentOrder;
	}

	if (typeof(currentOrders[orderId]) !== "undefined")
		res.send(currentOrders[orderId]);
	else
		res.send(empty);
});*/

app.listen(3000, () => console.log('Example app listening on port 3000!'));
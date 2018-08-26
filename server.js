//To use Express.js
const express = require("express");
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

//For parsing JSON
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const crypto = require('crypto');

//Additional modules
const postHandler = require("./postHandler.js");
const emailModule = require("./sendEmail.js");

if (process.argv.length < 3)
{
	console.log("Missing argument!");
	return;
}

/*---------------Send HTML files to client browser---------------*/

//Send base HTML to client browser
app.get('/', function(req, res) 
{
	res.sendFile(__dirname + '/Frontend/apps.html');
});

app.get('/soup', function(req, res) 
{
	res.sendFile(__dirname + '/Frontend/soup.html');
});

app.get('/checkout', function(req, res) 
{
	res.sendFile(__dirname + '/Frontend/checkout.html');
});

app.get('/confirmation', function(req, res)
{
	res.sendFile(__dirname + '/Frontend/confirmation.html');
});

app.get('/login', function(req, res)
{
	res.sendFile(__dirname + '/Frontend/login.html');
});

app.get('/create-account', function(req, res)
{
	res.sendFile(__dirname + '/Frontend/create-account.html');
});

/*---------------Send CSS files to client browser---------------*/

app.get('/Frontend/css/shop-homepage.css', function(req, res) 
{
  	res.sendFile(__dirname + "/Frontend/css/shop-homepage.css");
});

app.get('/Frontend/css/itemSelect.css', function(req, res) 
{
  	res.sendFile(__dirname + "/Frontend/css/itemSelect.css");
});

app.get('/Frontend/css/checkout.css', function(req, res) 
{
  	res.sendFile(__dirname + "/Frontend/css/checkout.css");
});

app.get('/Frontend/css/login.css', function(req, res) 
{
  	res.sendFile(__dirname + "/Frontend/css/login.css");
});

app.get('/Frontend/css/create-account.css', function(req, res) 
{
  	res.sendFile(__dirname + "/Frontend/css/create-account.css");
});

/*---------------Send JS files to client browser---------------*/

app.get('/Frontend/js/itemSelect.js', function(req, res)
{
  	res.sendFile(__dirname + "/Frontend/js/itemSelect.js");
});

app.get('/Frontend/js/checkout.js', function(req, res)
{
  	res.sendFile(__dirname + "/Frontend/js/checkout.js");
});

app.get('/Frontend/js/confirmation.js', function(req, res)
{
  	res.sendFile(__dirname + "/Frontend/js/confirmation.js");
});

app.get('/Frontend/js/login.js', function(req, res)
{
  	res.sendFile(__dirname + "/Frontend/js/login.js");
});

app.get('/Frontend/js/create-account.js', function(req, res)
{
  	res.sendFile(__dirname + "/Frontend/js/create-account.js");
});

//////////////////////////////////////////////////////////////////

let users = [];

/*function generateOrderId()
{
	let orderId = crypto.randomBytes(16).toString('hex');
	currentOrders[orderId] = {};
	currentOrders[orderId].info = {};
	currentOrders[orderId].items = [];

	return orderId;
}*/

/*//Update order
app.post('/update-order', function(req, res)
{
	console.log("Received POST request from client! (update-order)");

	let orderId = req.cookies.orderId;

	//No order entry exists for cookie
	if (typeof(currentOrders[orderId]) === "undefined")
	{
		orderId = generateOrderId();
		res.cookie("orderId", orderId);
	}

	postHandler.updateOrder(req.body, currentOrders[orderId].items);
	res.sendStatus(200);
});*/

function createAccount(req)
{
	let account = {};

	account.key = crypto.randomBytes(16).toString('hex');

	account.userInfo = {};
	account.userInfo.username = req.username;
	account.userInfo.email = req.email;
	account.userInfo.password = req.password;

	account.currentOrder = {};
	account.currentOrder.info = {};
	account.currentOrder.items = [];

	account.pastOrders = [];

	users.push(account);

	return account.key;
}

function getAccountByKey(key)
{
	for (let i = 0; i < users.length; i++)
	{
		if (users[i].key === key)
			return i;
	}

	return -1;
}

function getAccountByName(username)
{
	for (let i = 0; i < users.length; i++)
	{
		if (users[i].userInfo.username === username)
			return i;
	}

	return -1;
}

function validateCredentials(req, res)
{
	let index = getAccountByName(req.username);
	if (index === -1)
		res.msg = "not-found";
	else if (users[index].userInfo.password !== req.password)
		res.msg = "invalid-credentials";
	else
	{
		res.msg = "ok";
		return index;
	}

	return -1;
}

app.post('/create-account', function(req, res)
{
	console.log("Received POST request from client! (create-account)");

	let key = createAccount(req.body);
	res.cookie("key", key);
	res.sendStatus(200);
});

app.post('/log-in', function(req, res)
{
	console.log("Received POST request from client! (log-in)");

	let response = {};
	let index = validateCredentials(req.body, response);

	if (index !== -1)
		res.cookie("key", users[index].key);

	res.send(response);
});

app.get('/log-out', function(req, res)
{
	console.log("Received GET request from client! (log-out)");

	res.clearCookie("key");
	res.sendStatus(200);
});

//Update order
app.post('/update-order', function(req, res)
{
	console.log("Received POST request from client! (update-order)");

	let key = req.cookies.key;
	let response = {};

	let index = getAccountByKey(key);
	if (index === -1)
		response.msg = "signed-out";
	else
	{
		response.msg = "ok";
		postHandler.updateOrder(req.body, users[index].currentOrder.items);
	}

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
	let index = getAccountByKey(key);
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

app.post('/get-combined', function(req, res)
{
	console.log("Received GET request from client! (get-combined)");

	let key = req.cookies.key;
	let combined = {};
	combined.menu = postHandler.getMenu(req.body);

	let index = getAccountByKey(key);
	if (index === -1)
		combined.orderItems = [];
	else
		combined.orderItems = users[index].currentOrder.items;

	res.send(combined);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
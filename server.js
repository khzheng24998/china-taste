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


//////////////////////////////////////////////////////////////////

let placedOrders = [];
let currentOrders = {};

function generateOrderId()
{
	let orderId = crypto.randomBytes(16).toString('hex');
	currentOrders[orderId] = {};
	currentOrders[orderId].info = {};
	currentOrders[orderId].items = [];

	return orderId;
}

//Update order
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
});

//Update order info
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
});

//Send menu to client browser
app.post('/get-menu', function(req, res)
{
	console.log("Received POST request from client! (get-menu)");
	let menu = postHandler.getMenu(req.body);
	res.send(menu);
});

//Send order to client browser
app.get('/my-order', function(req, res)
{
	console.log("Received GET request from client! (my-order)");

	let empty = {};
	empty.info = {};
	empty.items = [];

	let orderId = req.cookies.orderId;
	if (typeof(currentOrders[orderId]) !== "undefined")
		res.send(currentOrders[orderId]);
	else
		res.send(empty);
});

app.post('/get-combined', function(req, res)
{
	console.log("Received GET request from client! (get-combined)");

	let orderId = req.cookies.orderId;
	let combined = {};
	combined.menu = postHandler.getMenu(req.body);
	if (typeof(currentOrders[orderId]) !== "undefined")
		combined.orderItems = currentOrders[orderId].items;
	else
		combined.orderItems = [];

	res.send(combined);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
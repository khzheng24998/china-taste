//To use Express.js
const express = require("express");
const app = express();

//For parsing JSON
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Additional modules
const postHandler = require("./postHandler.js");

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

app.get('/submit', function(req, res) 
{
	res.sendFile(__dirname + '/Frontend/submit.html');
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

app.get('/Frontend/css/submit.css', function(req, res) 
{
  	res.sendFile(__dirname + "/Frontend/css/submit.css");
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

app.get('/Frontend/js/submit.js', function(req, res)
{
  	res.sendFile(__dirname + "/Frontend/js/submit.js");
});

//////////////////////////////////////////////////////////////////

let order = {};
order.info = {};
order.items = [];

//Update order
app.post('/update-order', function(req, res)
{
	console.log("Received POST request from client! (update-order)");
	postHandler.updateOrder(req.body, order.items);
	res.sendStatus(200);
});

//Update order info
app.post('/update-order-info', function(req, res)
{
	console.log("Received POST request from client! (update-order-info)");
	postHandler.updateOrderInfo(req.body, order.info);
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
  	res.send(order);
});

app.post('/get-combined', function(req, res)
{
	console.log("Received GET request from client! (get-combined)");
	let combined = {};
	combined.menu = postHandler.getMenu(req.body);
	combined.order = order.items;

	res.send(combined);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
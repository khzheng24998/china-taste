//To use Express.js
const express = require("express");
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

//For parsing JSON
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Additional modules
const postHandler = require("./postHandler.js");

const Email = require("./email.js");
const Database = require("./database.js");
const Login = require("./login.js");

if (process.argv.length < 3)
{
	console.log("Missing argument!");
	return;
}

/*---------------Simple HTML files---------------*/

app.get('/account-created', function(req, res)
{
	res.sendFile(__dirname + '/Frontend/html/Login/Simple/account-created.html');
});

/*--------------General purpose JS files---------------*/

app.get('/Frontend/js/generic.js', function(req, res)
{
  	res.sendFile(__dirname + req.originalUrl);
});

app.get('/Frontend/js/functions.js', function(req, res)
{
  	res.sendFile(__dirname + req.originalUrl);
});

/*---------------Login---------------*/

app.get('/login', function(req, res)
{
	res.sendFile(__dirname + '/Frontend/html/Login/login.html');
});

app.get('/Frontend/css/Login/login-styles.css', function(req, res) 
{
  	res.sendFile(__dirname + req.originalUrl);
});

app.get('/Frontend/css/Login/login.css', function(req, res) 
{
  	res.sendFile(__dirname + req.originalUrl);
});

app.get('/Frontend/js/Login/login.js', function(req, res)
{
  	res.sendFile(__dirname + req.originalUrl);
});

/*---------------Create account---------------*/

app.get('/create-account', function(req, res)
{
	res.sendFile(__dirname + '/Frontend/html/Login/create-account.html');
});

app.get('/Frontend/css/Login/create-account.css', function(req, res) 
{
  	res.sendFile(__dirname + req.originalUrl);
});

app.get('/Frontend/js/Login/create-account.js', function(req, res)
{
  	res.sendFile(__dirname + req.originalUrl);
});

/*---------------Verification request sent---------------*/

app.get('/verification-request-sent', function(req, res)
{
	res.sendFile(__dirname + '/Frontend/html/Login/verification-request-sent.html');
});

app.get('/Frontend/js/Login/resend-email.js', function(req, res)
{
  	res.sendFile(__dirname + req.originalUrl);
});

/*---------------Forgot password---------------*/

app.get('/forgot-password', function(req, res)
{
	res.sendFile(__dirname + '/Frontend/html/Login/forgot-password.html');
});

app.get('/Frontend/js/Login/forgot-password.js', function(req, res)
{
  	res.sendFile(__dirname + req.originalUrl);
});

/*---------------Reset Request Sent---------------*/

app.get('/reset-request-sent', function(req, res)
{
	res.sendFile(__dirname + '/Frontend/html/Login/reset-request-sent.html');
});






/*---------------Send HTML files to client browser---------------*/

//Send base HTML to client browser
app.get('/', function(req, res) 
{
	res.sendFile(__dirname + '/Frontend/html/Menu/apps.html');
});

app.get('/soup', function(req, res) 
{
	res.sendFile(__dirname + '/Frontend/html/Menu/soup.html');
});

app.get('/checkout', function(req, res) 
{
	res.sendFile(__dirname + '/Frontend/html/checkout.html');
});

app.get('/confirmation', function(req, res)
{
	res.sendFile(__dirname + '/Frontend/html/confirmation.html');
});

app.get('/reset-success', function(req, res)
{
	res.sendFile(__dirname + '/Frontend/html/Login/Simple/reset-success.html');
});

app.get('/my-profile', function(req, res)
{
	res.sendFile(__dirname + '/Frontend/html/Profile/profile.html');
});

/*---------------Send CSS files to client browser---------------*/

app.get('/Frontend/css/shop-homepage.css', function(req, res)
{
  	res.sendFile(__dirname + req.originalUrl);
});

app.get('/Frontend/css/itemSelect.css', function(req, res) 
{
  	res.sendFile(__dirname + req.originalUrl);
});

app.get('/Frontend/css/checkout.css', function(req, res) 
{
  	res.sendFile(__dirname + req.originalUrl);
});

app.get('/Frontend/css/Login/verification-success.css', function(req, res) 
{
  	res.sendFile(__dirname + req.originalUrl);
});

app.get('/Frontend/css/profile.css', function(req, res) 
{
  	res.sendFile(__dirname + req.originalUrl);
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

app.get('/Frontend/js/password-reset.js', function(req, res)
{
  	res.sendFile(__dirname + "/Frontend/js/password-reset.js");
});

app.get('/Frontend/js/Profile/profile.js', function(req, res)
{
  	res.sendFile(__dirname + req.originalUrl);
});


//////////////////////////////////////////////////////////////////

let resetRequests = [];
let verificationRequests = [];

let activeSessions = [];

let users = [];

/* Login */

app.post('/log-in', function(req, res)
{
	console.log("Received POST request from client! (log-in)");

	let response = {};
	let index = Login.validateCredentials(req.body, response, users);

	if (index !== -1)
	{
		users[index].key = Login.generateKey(users);
		res.cookie("key", users[index].key);
	}

	res.send(response);
});

/* End of login */

/* Account creation */

app.post('/create-account', function(req, res)
{
	console.log("Received POST request from client! (create-account)");

	let response = {};

	if (Login.createAccount(req.body, response, users))
		res.cookie("key", users[users.length - 1].key);

	res.send(response);
});

/* End of account creation */

/* Send reset email */

app.post('/send-reset-email', function(req, res)
{
	console.log("Received POST request from client! (send-reset-email)");

	let response = {};
	Login.sendResetLink(req.body, response, users, resetRequests);
	res.send(response);
});

/* End of send reset email */

/* Send verification email */

app.get('/send-verification-email', function(req, res)
{
	console.log("Received GET request from client (send-verification-email)");

	let key = req.cookies.key;
	let response = {};
	Login.sendVerificationLink(key, response, users, verificationRequests);
	res.send(response);
});

/* End of send verification email */






app.get('/verify-email', function(req, res)
{
	console.log("Received GET request from client (verify-email)");

	let url = req.originalUrl.replace("/verify-email?", "");

	console.log(req.originalUrl);
	console.log(url);

	let index = Database.getAccountByKey(url, verificationRequests);
	if (index !== -1)
	{
		let idx = Database.getAccountByName(verificationRequests[index].username, users);
		users[idx].verified = true;

		//Delete verification request
		if (verificationRequests.length > 1)
			delete verificationRequests[index];
		else
			verificationRequests = [];

		res.sendFile(__dirname + '/Frontend/html/Login/Simple/verification-success.html');
	}
	else
	{
		res.sendFile(__dirname + '/Frontend/html/invalid-link.html');
	}
});

app.get('/password-reset', function(req, res)
{
	console.log("Received GET request from client! (password-reset)");

	let url = req.originalUrl.replace("/password-reset?", "");

	console.log(req.originalUrl);
	console.log(url);

	let index = Database.getAccountByKey(url, resetRequests);
	if (index !== -1)
	{
		res.cookie("resetKey", url);
		res.sendFile(__dirname + '/Frontend/html/Login/password-reset.html');
	}
	else
	{
		res.sendFile(__dirname + '/Frontend/html/invalid-link.html');
	}
});

app.post('/password-reset', function(req, res)
{
	console.log("Received POST request from client! (password-reset)");

	let resetKey = req.cookies.resetKey;
	let response = {};

	let index = Database.getAccountByKey(resetKey, resetRequests)
	if (index !== -1)
	{
		let idx = Database.getAccountByName(resetRequests[index].username, users);
		users[idx].userInfo.password = Login.hashPassword(req.body.newPassword);

		//Delete reset request
		if (resetRequests.length > 1)
			delete resetRequests[index];
		else
			resetRequests = [];

		response.msg = "ok";
	}
	else
		response.msg = "not-found";

	res.send(response);
});

app.get('/account-status', function(req, res)
{
	console.log("Received GET request from client! (account-status)");

	let response = {};
	let key = req.cookies.key;
	let index = Database.getAccountByKey(key, users);

	if (index !== -1)
		response.msg = "signed-in";
	else
		response.msg = "signed-out";

	console.log(response);

	res.send(response);
});

app.get('/log-out', function(req, res)
{
	console.log("Received GET request from client! (log-out)");

	let key = req.cookies.key;
	let index = Database.getAccountByKey(key, users);

	if (index !== -1)
	{
		delete users[index].key;
		res.clearCookie("key");	
	}
	
	res.sendStatus(200);
});

app.get('/get-profile-data', function(req, res)
{
	console.log("Received GET request from client! (get-profile-data)");

	let key = req.cookies.key;
	let index = Database.getAccountByKey(key, users);

	let response = {};

	if (index !== -1)
	{
		response = users[index].userInfo;
		response.msg = "ok";
		delete response.password;
	}
	else
		response.msg = "error";

	res.send(response);
});

//Update order
app.post('/update-order', function(req, res)
{
	console.log("Received POST request from client! (update-order)");

	let key = req.cookies.key;
	let response = {};

	let index = Database.getAccountByKey(key, users);
	if (index !== -1)
	{
		response.msg = "ok";
		postHandler.updateOrder(req.body, users[index].currentOrder.items);
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

app.post('/get-combined', function(req, res)
{
	console.log("Received GET request from client! (get-combined)");

	let key = req.cookies.key;
	let combined = {};
	combined.menu = postHandler.getMenu(req.body);

	let index = Database.getAccountByKey(key, users);
	if (index === -1)
		combined.orderItems = [];
	else
		combined.orderItems = users[index].currentOrder.items;

	res.send(combined);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
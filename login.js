const LoginHelper = require("./loginHelper.js");
const PostValidator = require("./postValidation.js");

function loginEvents(app, users, activeSessions, resetRequests, verificationRequests)
{
	/* POST events */

	app.post('/log-in', function(req, res)
	{
		console.log("Received POST request from client! (log-in)");
		let response = {};

		if (!PostValidator.validatePostData(req.body, "log-in"))
		{
			response.msg = "error";
			res.send(response);
			return;
		}

		let index = LoginHelper.logIn(req.body, response, users);
		if (index !== -1)
		{
			let info = users[index].userInfo;
			let key = LoginHelper.generateNewSession(info.firstName, info.lastName, info.email, activeSessions);
			res.cookie("key", key);
		}

		res.send(response);
	});

	app.post('/create-account', function(req, res)
	{
		console.log("Received POST request from client! (create-account)");
		let response = {};

		if (!PostValidator.validatePostData(req.body, "create-account"))
		{
			response.msg = "error";
			res.send(response);
			return;
		}

		if (LoginHelper.createAccount(req.body, response, users))
		{
			let key = LoginHelper.generateNewSession(req.body.firstName, req.body.lastName, req.body.email, activeSessions);
			res.cookie("key", key);
		}

		res.send(response);
	});

	app.post('/send-reset-email', function(req, res)
	{
		console.log("Received POST request from client! (send-reset-email)");
		let response = {};

		if (!PostValidator.validatePostData(req.body, "send-reset-email"))
		{
			response.msg = "error";
			res.send(response);
			return;
		}

		LoginHelper.sendResetLink(req.body, response, users, resetRequests);
		res.send(response);
	});

	app.post('/password-reset', function(req, res)
	{
		console.log("Received POST request from client! (password-reset)");
		let resetKey = req.cookies.resetKey;
		let response = {};

		if (!PostValidator.validatePostData(req.body, "password-reset"))
		{
			response.msg = "error";
			res.send(response);
			return;
		}

		LoginHelper.resetPassword(resetKey, req.body, response, users, resetRequests);
		res.clearCookie("resetKey");
		res.send(response);
	});

	/* GET events */

	app.get('/log-out', function(req, res)
	{
		console.log("Received GET request from client! (log-out)");
		let key = req.cookies.key;
		let response = {};

		if (LoginHelper.logOut(key, response, activeSessions))
			res.clearCookie("key");
		
		res.send(response);
	});

	app.get('/get-navbar-info', function(req, res)
	{
		console.log("Received GET request from client! (get-navbar-info)");
		let response = {};
		let key = req.cookies.key;

		LoginHelper.getNavBarInfo(key, response, activeSessions);
		res.send(response);
	});

	app.get('/password-reset', function(req, res)
	{
		console.log("Received GET request from client! (password-reset)");

		let url = req.originalUrl.replace("/password-reset?", "");
		if (LoginHelper.getResetPortal(url, resetRequests))
		{
			res.cookie("resetKey", url);
			res.sendFile(__dirname + '/Frontend/html/Login/password-reset.html');
		}
		else
			res.sendFile(__dirname + '/Frontend/html/invalid-link.html');
	});

	app.get('/send-verification-email', function(req, res)
	{
		console.log("Received GET request from client (send-verification-email)");

		let key = req.cookies.key;
		let response = {};
		LoginHelper.sendVerificationLink(key, response, activeSessions, verificationRequests);
		res.send(response);
	});

	app.get('/verify-email', function(req, res)
	{
		console.log("Received GET request from client (verify-email)");
		let url = req.originalUrl.replace("/verify-email?", "");

		if (LoginHelper.verifyEmail(url, users, verificationRequests))
			res.sendFile(__dirname + '/Frontend/html/Login/verification-success.html');
		else
			res.sendFile(__dirname + '/Frontend/html/invalid-link.html');
	});
}

module.exports.loginEvents = loginEvents;
const LoginHelper = require("./loginHelper.js");
const PostValidator = require("./postValidation.js");

function loginEvents(app)
{
	/* POST events */

	app.post('/log-in', function(req, res)
	{
		console.log("Received POST request from client! (log-in)");

		if (!PostValidator.validatePostData(req.body, "log-in"))
			res.send({ msg: "error" });
		else
			LoginHelper.asyncLogIn(req, res);
	});

	app.post('/create-account', function(req, res)
	{
		console.log("Received POST request from client! (create-account)");

		if (!PostValidator.validatePostData(req.body, "create-account"))
			res.send({ msg: "error" });
		else
			LoginHelper.asyncCreateAccount(req, res);
	});

	app.post('/send-reset-email', function(req, res)
	{
		console.log("Received POST request from client! (send-reset-email)");

		if (!PostValidator.validatePostData(req.body, "send-reset-email"))
			res.send({ msg: "error" });
		else
			LoginHelper.asyncSendResetLink(req, res);
	});

	app.post('/password-reset', function(req, res)
	{
		console.log("Received POST request from client! (password-reset)");
		if (!PostValidator.validatePostData(req.body, "password-reset"))
			res.send({ msg: "error" });
		else
			LoginHelper.asyncResetPassword(req, res);
	});

	/* GET events */

	app.get('/log-out', function(req, res)
	{
		console.log("Received GET request from client! (log-out)");
		LoginHelper.asyncLogOut(req, res);
	});

	app.get('/get-session-info', function(req, res)
	{
		console.log("Received GET request from client! (get-session-info)");
		LoginHelper.asyncGetSessionInfo(req, res);
	});

	app.get('/password-reset', function(req, res)
	{
		console.log("Received GET request from client! (password-reset)");
		LoginHelper.asyncGetResetPortal(req, res);
	});

	app.get('/send-verification-email', function(req, res)
	{
		console.log("Received GET request from client (send-verification-email)");
		LoginHelper.asyncSendVerificationLink(req, res);
	});

	app.get('/verify-email', function(req, res)
	{
		console.log("Received GET request from client (verify-email)");
		LoginHelper.asyncVerifyEmail(req, res);
	});
}

module.exports.loginEvents = loginEvents;
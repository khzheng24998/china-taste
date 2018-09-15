const ProfileHelper = require("./profileHelper.js");
const PostValidator = require("./postValidation.js");

function profileEvents(app, users, activeSessions, resetRequests, verificationRequests)
{
	/* GET events */

	app.get('/get-profile-info', function(req, res)
	{
		console.log("Received GET request from client! (get-profile-info)");

		let key = req.cookies.key;
		let response = {};
		ProfileHelper.getProfileInfo(key, response, users, activeSessions);
		res.send(response);
	});

	/* POST events */

	app.post('/update-profile-info', function(req, res)
	{
		console.log("Received POST request from client! (update-profile-info)");
		let key = req.cookies.key;
		let response = {};

		if (!PostValidator.validatePostData(req.body, "update-profile-info"))
		{
			response.msg = "error";
			res.send(response);
			return;
		}

		ProfileHelper.updateProfileInfo(key, req.body, response, users, activeSessions, resetRequests, verificationRequests);
		res.send(response);
	});

	app.post('/update-password', function(req, res)
	{
		console.log("Received POST request from client! (update-password)");
		let key = req.cookies.key;
		let response = {};

		if (!PostValidator.validatePostData(req.body, "update-password"))
		{
			response.msg = "error";
			res.send(response);
			return;
		}

		ProfileHelper.updatePassword(key, req.body, response, users, activeSessions);
		res.send(response);
	});
}

module.exports.profileEvents = profileEvents;
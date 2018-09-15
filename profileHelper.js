const Database = require("./database.js");
const Email = require("./email.js");
const Crypto = require("crypto");
const LoginHelper = require("./loginHelper.js");

/* Helper functions */

function updateEmailInStructures(prevEmail, newEmail, activeSessions, resetRequests, verificationRequests)
{
	let idx;
	idx = Database.getRequestByEmail(prevEmail, activeSessions);
	if (idx !== -1)
		activeSessions[idx].userInfo.email = newEmail;

	idx = Database.getRequestByEmail(prevEmail, verificationRequests);
	if (idx !== -1)
		verificationRequests[idx].userInfo.email = newEmail;

	idx = Database.getRequestByEmail(prevEmail, resetRequests);
	if (idx !== -1)
		resetRequests[idx].userInfo.email = newEmail;
}

/* Exported functions */

function getProfileInfo(key, res, users, activeSessions)
{
	let index = Database.getAccountByKey(key, users, activeSessions);
	if (index !== -1)
	{
		res.userInfo = {};
		res.userInfo.email = users[index].userInfo.email;
		res.userInfo.firstName = users[index].userInfo.firstName;
		res.userInfo.lastName = users[index].userInfo.lastName;
		res.userInfo.phoneNumber = users[index].userInfo.phoneNumber;
		res.msg = "ok";
	}
	else
		res.msg = "not-found";
}

function updateProfileInfo(key, req, res, users, activeSessions, resetRequests, verificationRequests)
{
	let index = Database.getAccountByKey(key, users, activeSessions);
	if (index !== -1)
	{
		if (users[index].userInfo.email !== req.email)
		{
			users[index].verified = false;
			updateEmailInStructures(users[index].userInfo.email, req.email, activeSessions, resetRequests, verificationRequests);
		}

		users[index].userInfo.email = req.email;
		users[index].userInfo.firstName = req.firstName;
		users[index].userInfo.lastName = req.lastName;
		users[index].userInfo.phoneNumber = req.phoneNumber;

		let idx = Database.getSessionByEmail(req.email, activeSessions);
		activeSessions[idx].userInfo.firstName = req.firstName;
		activeSessions[idx].userInfo.lastName = req.lastName;
		res.msg = "ok";
	}
	else
		res.msg = "not-found";
}

function updatePassword(key, req, res, users, activeSessions)
{
	let index = Database.getAccountByKey(key, users, activeSessions);
	if (index !== -1)
	{
		if (users[index].userInfo.password === LoginHelper.hashPassword(req.currentPassword))
		{
			users[index].userInfo.password = LoginHelper.hashPassword(req.newPassword);
			res.msg = "ok";
		}
		else
			res.msg = "invalid-credentials";
	}
	else
		res.msg = "not-found";
}

module.exports.getProfileInfo = getProfileInfo;
module.exports.updateProfileInfo = updateProfileInfo;
module.exports.updatePassword = updatePassword;
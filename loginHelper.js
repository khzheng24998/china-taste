//Custom modules
const Database = require("./database.js");
const Email = require("./email.js");
const Crypto = require("crypto");

//npm modules
const bcrypt = require("bcrypt");
const saltRounds = 12;

/* Helper functions */

async function asyncKeyGen(type)
{
	let attempts = 0;

	while (attempts < 50)
	{
		let key = Crypto.randomBytes(24).toString('hex');
		let entity = {};

		switch (type)
		{
			case "session":
				entity = await Database.findActiveSession("key", key);
				break;
			case "reset":
				entity = await Database.findResetRequest("key", key);
				break;
			case "verification":
				entity = await Database.findVerificationRequest("key", key);
				break;
			default:
				console.log("ERROR: asyncKeyGen() - Invalid type.");
				break;
		}

		if (entity === null)
			return key;

		attempts++;
	}
}

async function asyncActiveSessionGen(key, userId, userInfo)
{
	let active = {
		"key": key,
		"userId": userId,
		"firstName": userInfo.firstName,
		"lastName": userInfo.lastName,
		"email": userInfo.email
	};

	let session = await Database.findActiveSession("userId", userId);
	if (session !== null)
		Database.replaceActiveSession(session._id, active);
	else
		Database.insertActiveSession(active);
}

async function asyncResetRequestGen(key, userId)
{
	let date = new Date();
	let currentTime = date.getTime();
	let expirationDate = (+currentTime) + (+600000);		//Reset key expires in 10 minutes

	let reset = {
		"key": key,
		"expiration": expirationDate,
		"userId": userId
	};

	//NOTE: In future, perhaps should create unified update/add database functions

	let request = await Database.findResetRequest("userId", userId);
	if (request !== null) 
		Database.replaceResetRequest(request._id, reset);
	else 
		Database.insertResetRequest(reset);
}

async function asyncVerificationRequestGen(key, userId)
{
	let verification = { "key": key, "userId": userId };

	let request = await Database.findVerificationRequest("userId", userId);
	if (request !== null)
		Database.replaceVerificationRequest(request._id, verification);
	else
		Database.insertVerificationRequest(verification);
}

function asyncHashPassword(password)
{
	return new Promise(function(resolve, reject)
	{
		bcrypt.hash(password, saltRounds, function(err, hash) { resolve(hash) });
	});
}

function asyncComparePasswords(password, hash)
{
	return new Promise(function(resolve, reject)
	{
		bcrypt.compare(password, hash, function(err, res) { resolve(res) });
	});
}

function formatPhoneNumber(phoneNumber)
{
	let arr = phoneNumber.match(/[0-9]/g);
	if (arr === null)
		return "";

	let noSpecialChars = arr.toString();
	noSpecialChars = noSpecialChars.replace(/,/g, "");
	return noSpecialChars;
}

/* Exported functions */

async function asyncLogIn(req, res)
{
	let body = req.body;

	let user = await Database.findUser("email", body.email);
	if (user === null)
	{
		res.send({ msg: "not-found" });
		return;
	}

	let validCredentials = await asyncComparePasswords(body.password, user.userInfo.password);
	if (!validCredentials)
	{
		res.send({ msg: "invalid-credentials" });
		return;
	}

	let key = await asyncKeyGen("session");
	asyncActiveSessionGen(key, user._id, user.userInfo);

	res.cookie("loginKey", key);
	res.send({ msg: "ok" });
}

async function asyncCreateAccount(req, res)
{
	let body = req.body;
	let user = await Database.findUser("email", body.email);
	if (user !== null)
	{
		res.send({ msg: "account-exists" });
		return;
	}

	let phoneNumber = formatPhoneNumber(body.phoneNumber);
	let password = await asyncHashPassword(body.password);

	let userInfo = {
		"firstName": body.firstName,
		"lastName": body.lastName,
		"email": body.email,
		"phoneNumber": phoneNumber,
		"password": password
	};

	let order = await Database.insertOrder();
	let orderId = order.insertedId;

	user = await Database.insertUser(userInfo, orderId);
	let userId = user.insertedId;

	let key = await asyncKeyGen("session");
	asyncActiveSessionGen(key, userId, userInfo);

	res.cookie("loginKey", key);
	res.send({ msg: "ok" });
}

async function asyncSendResetLink(req, res)
{
	let body = req.body;
	let user = await Database.findUser("email", body.email);
	if (user === null)
	{
		res.send({ "msg": "not-found" });	
		return;
	}

	let randString = await asyncKeyGen("reset");
	asyncResetRequestGen(randString, user._id);
	Email.sendLink("174acr858onr", randString, user.userInfo.email, "reset");
	res.send({ "msg": "ok" });
}

async function asyncSendVerificationLink(req, res)
{
	let key = req.cookies.loginKey;

	let session = await Database.findActiveSession("key", key);
	if (session === null)
	{
		res.send({ "msg": "error" });
		return;
	}

	let randString = await asyncKeyGen("verification");
	asyncVerificationRequestGen(randString, session.userId);

	Email.sendLink("174acr858onr", randString, session.email, "verification");
	res.send({ "msg": "ok" });
}

async function asyncResetPassword(req, res)
{
	let key = req.cookies.resetKey;
	let body = req.body;

	let request = await Database.findResetRequest("key", key);
	if (request === null)
	{
		res.send({ "msg": "error" });
		return;		
	}

	let user = await Database.findUser("_id", request.userId);
	if (user === null)
	{
		res.send({ "msg": "error" });
		return;	
	}

	let userInfo = user.userInfo;
	userInfo.password = await asyncHashPassword(body.password);
	Database.updateUserInfo(user._id, userInfo);
	Database.deleteResetRequest(request._id);

	res.clearCookie("resetKey");
	res.send({ "msg": "ok" });
}

async function asyncLogOut(req, res)
{
	let key = req.cookies.loginKey;
	let session = await Database.findActiveSession("key", key);
	if (session !== null)
	{
		Database.deleteActiveSession(session._id);
		res.clearCookie("loginKey");
		res.send({ "msg": "ok" });
		return;
	}
		
	res.send({ "msg": "error" });
}

async function asyncGetSessionInfo(req, res)
{
	let key = req.cookies.loginKey;
	let session = await Database.findActiveSession("key", key);
	if (session !== null)
		res.send({ "msg": "signed-in", "firstName": session.firstName, "lastName": session.lastName });
	else
		res.send({ "msg": "signed-out" });
}

async function asyncGetResetPortal(req, res)
{
	let key = req.originalUrl.replace("/password-reset?", "");
	console.log(key);
	let request = await Database.findResetRequest("key", key);
	if (request !== null)
	{
		res.cookie("resetKey", key);
		res.sendFile(__dirname + '/Frontend/html/Login/password-reset.html');
	}
	else
		res.sendFile(__dirname + '/Frontend/html/invalid-link.html');
}

async function asyncVerifyEmail(req, res)
{
	let key = req.originalUrl.replace("/verify-email?", "");
	let request = await Database.findVerificationRequest("key", key);
	if (request === null)
	{
		res.sendFile(__dirname + '/Frontend/html/invalid-link.html');
		return;
	}

	let user = await Database.findUser("_id", request.userId);
	if (user === null)
	{
		res.sendFile(__dirname + '/Frontend/html/error.html');
		return;
	}

	Database.updateUserVerified(user._id, true);
	Database.deleteVerificationRequest(request._id);
	res.sendFile(__dirname + '/Frontend/html/Login/verification-success.html');
}

module.exports.asyncLogIn = asyncLogIn;
module.exports.asyncCreateAccount = asyncCreateAccount;
module.exports.asyncSendResetLink = asyncSendResetLink;
module.exports.asyncSendVerificationLink = asyncSendVerificationLink;
module.exports.asyncResetPassword = asyncResetPassword;
module.exports.asyncLogOut = asyncLogOut;
module.exports.asyncGetSessionInfo = asyncGetSessionInfo;
module.exports.asyncGetResetPortal = asyncGetResetPortal;
module.exports.asyncVerifyEmail = asyncVerifyEmail;
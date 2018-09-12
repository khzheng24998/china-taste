const Database = require("./database.js");
const Email = require("./email.js");
const Crypto = require("crypto");

/* Helper functions */

function hashPassword(password)
{
	let hash = Crypto.createHash("sha512");
	return hash.update(password).digest("hex");
}

function generateKey(array)
{
	let key;
	do { key = Crypto.randomBytes(16).toString('hex'); } while (Database.getRequestByKey(key, array) !== -1);
	return key;
}

function generateResetRequest(email, resetRequests)
{
	let randString = generateKey(resetRequests);
	let date = new Date();
	let currentTime = date.getTime();
	let expirationDate = (+currentTime) + (+900000);

	let index = Database.getRequestByEmail(email, resetRequests);		//Reset key expires in 15 minutes
	if (index !== -1)
	{
		//Generate new key and expiration date for pre-existing reset request
		resetRequests[index].key = randString;
		resetRequests[index].expirationDate = expirationDate;
	}
	else
	{
		let pendingReset = {};
		pendingReset.key = randString;
		pendingReset.expirationDate = expirationDate;
		pendingReset.userInfo = {
			email: email
		};

		resetRequests.push(pendingReset);
	}

	return randString;
}

function generateVerificationRequest(email, verificationRequests)
{
	let randString = "";

	let index = Database.getRequestByEmail(email, verificationRequests);
	if (index !== -1)
	{
		randString = verificationRequests[index].key;
	}
	else
	{
		randString = generateKey(verificationRequests);

		let pendingVerification = {};
		pendingVerification.key = randString;
		pendingVerification.userInfo = {
			email: email
		};

		verificationRequests.push(pendingVerification);
	}

	return randString;
}

/* Exported functions */

function logIn(req, res, users)
{
	let index = Database.getAccountByEmail(req.email, users);
	if (index === -1)
		res.msg = "not-found";
	else if (users[index].userInfo.password !== hashPassword(req.password))
		res.msg = "invalid-credentials";
	else
	{
		res.msg = "ok";
		return index;
	}
	
	return -1;
}

function createAccount(req, res, users)
{
	let userExists = (Database.getAccountByEmail(req.email, users) !== -1) ? true : false;
	if (userExists)
	{
		res.msg = "account-exists";
		return false;
	}

	let account = {};
	account.verified = false;

	account.userInfo = {};
	account.userInfo.firstName = req.firstName;
	account.userInfo.lastName = req.lastName;
	account.userInfo.email = req.email;
	account.userInfo.phoneNumber = req.phoneNumber;
	account.userInfo.password = hashPassword(req.password);

	account.currentOrder = {};
	account.currentOrder.info = {};
	account.currentOrder.items = [];

	account.pastOrders = [];

	users.push(account);

	res.msg = "ok";
	return true;
}

function sendResetLink(req, res, users, resetRequests)
{
	let index = Database.getAccountByEmail(req.email, users);
	if (index !== -1)
	{
		let randString = generateResetRequest(users[index].userInfo.email, resetRequests);
		Email.sendLink(process.argv[2], randString, users[index].userInfo.email, "reset");
		res.msg = "ok";
	}
	else
		res.msg = "not-found";
}

function sendVerificationLink(key, res, activeSessions, verificationRequests)
{
	let index = Database.getRequestByKey(key, activeSessions);
	if (index !== -1)
	{
		let randString = generateVerificationRequest(activeSessions[index].userInfo.email, verificationRequests);
		Email.sendLink(process.argv[2], randString, activeSessions[index].userInfo.email, "verification");
		res.msg = "ok";
	}
	else
		res.msg = "not-found";
}

function generateNewSession(firstName, lastName, email, activeSessions)
{
	let session = {};
	session.key = generateKey(activeSessions);
	session.userInfo = {
		firstName: firstName,
		lastName: lastName,
		email: email
	};

	activeSessions.push(session);
	return session.key;
}

function resetPassword(key, req, res, users, resetRequests)
{
	let index = Database.getRequestByKey(key, resetRequests)
	if (index !== -1)
	{
		let idx = Database.getAccountByEmail(resetRequests[index].userInfo.email, users);

		//Delete reset request
		resetRequests.splice(index, 1);
		res.msg = "ok";
	}
	else
		res.msg = "not-found";
}

function logOut(key, res, activeSessions)
{
	let index = Database.getRequestByKey(key, activeSessions);
	if (index !== -1)
	{
		activeSessions.splice(index, 1);
		res.msg = "ok";
		return true;
	}

	res.msg = "not-found";
	return false;
}

function getNavBarInfo(key, res, activeSessions)
{
	let index = Database.getRequestByKey(key, activeSessions);
	if (index !== -1)
	{
		res.msg = "signed-in";
		res.firstName = activeSessions[index].userInfo.firstName;
		res.lastName = activeSessions[index].userInfo.lastName;
	}
	else
		res.msg = "signed-out";
}

function getResetPortal(key, resetRequests)
{
	let index = Database.getRequestByKey(key, resetRequests);
	return (index !== -1);
}

function verifyEmail(key, users, verificationRequests)
{
	let index = Database.getRequestByKey(key, verificationRequests);
	if (index !== -1)
	{
		let idx = Database.getAccountByEmail(verificationRequests[index].userInfo.email, users);
		users[idx].verified = true;

		//Delete verification request
		verificationRequests.splice(index, 1);
		return true;
	}
	
	return false;
}

module.exports.logIn = logIn;
module.exports.createAccount = createAccount;
module.exports.sendResetLink = sendResetLink;
module.exports.sendVerificationLink = sendVerificationLink;
module.exports.generateNewSession = generateNewSession;
module.exports.resetPassword = resetPassword;
module.exports.logOut = logOut;
module.exports.getNavBarInfo = getNavBarInfo;
module.exports.getResetPortal = getResetPortal;
module.exports.verifyEmail = verifyEmail;

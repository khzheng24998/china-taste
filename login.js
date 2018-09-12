const inputLimit = 512;
const Database = require("./database.js");
const Email = require("./email.js");
const Crypto = require("crypto");

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

function validateRequiredInput(input)
{
	let retVal = (typeof(input) === "undefined" || input.length === 0 || input.length > inputLimit) ? false : true;
	return retVal;
}

function validatePhoneNumber(phoneNumber)
{
	if (!validateRequiredInput(phoneNumber))
		return false;

	//Immediately return false if input is too long
	if (phoneNumber.length > 25)
		return false;

	//Phone number contains letters
	let letters = phoneNumber.match(/[A-Za-z]/g);
	if (letters != null)
		return false;

	//Remove common optional characters found in phone numbers
	let numbers = phoneNumber.replace(/[-() +]/g, "");

	//Phone number has no digits
	let arr = phoneNumber.match(/[0-9]/g);
	if (arr == null)
		return false;

	//Phone number contains special characters
	let noSpecialChars = arr.toString();
	noSpecialChars = noSpecialChars.replace(/,/g, "");

	if (numbers != noSpecialChars)
		return false;

	//Phone number is too long/short
	if (numbers.length != 10 && numbers.length != 11)	//with country call code
		return false;

	return true;
}

function validatePassword(password)
{
	if (!validateRequiredInput(password))
		return false;

	let letters = password.match(/[A-Za-z]/g);
	let numbers = password.match(/[0-9]/g);

	if (password.length < 8 || letters === null || numbers === null)
		return false;

	return true;
}

function validateCreateAccount(req)
{
	let firstNameVal = validateRequiredInput(req.firstName);
	let lastNameVal = validateRequiredInput(req.lastName);
	let emailVal = validateRequiredInput(req.email);
	let phoneNumberVal = validatePhoneNumber(req.phoneNumber);
	let passwordVal = validatePassword(req.password);

	return (firstNameVal && lastNameVal && emailVal && phoneNumberVal && passwordVal);
}

function createAccount(req, res, users)
{
	if (!validateCreateAccount(req))
	{
		res.msg = "error";
		return false;
	}

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

function validateCredentials(req, res, users)
{
	let emailVal = validateRequiredInput(req.email);
	let passwordVal = validateRequiredInput(req.password);

	if (!emailVal || !passwordVal)
	{
		res.msg = "error";
		return -1;
	}

	let index = Database.getAccountByEmail(req.email, users);

	if (index === -1)
	{
		res.msg = "not-found";
		return -1;
	}
	else if (users[index].userInfo.password !== hashPassword(req.password))
	{
		res.msg = "invalid-credentials";
		return -1;
	}
	
	res.msg = "ok";
	return index;
}

function sendResetLink(req, res, users, resetRequests)
{
	let emailVal = validateRequiredInput(req.email);

	if (!emailVal)
		res.msg = "error";
	else
	{
		let index = Database.getAccountByEmail(req.email, users);
		if (index !== -1)
		{
			let randString = generateResetRequest(users[index].userInfo.email, resetRequests);
			Email.sendResetLink(process.argv[2], randString, users[index].userInfo.email);
			res.msg = "ok";
		}
		else
			res.msg = "not-found";
	}
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

function sendVerificationLink(key, res, activeSessions, verificationRequests)
{
	let index = Database.getRequestByKey(key, activeSessions);
	if (index !== -1)
	{
		let randString = generateVerificationRequest(activeSessions[index].userInfo.email, verificationRequests);
		Email.sendVerificationLink(process.argv[2], randString, activeSessions[index].userInfo.email);
		res.msg = "ok";
	}
	else
		res.msg = "error";
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

module.exports.hashPassword = hashPassword;

module.exports.createAccount = createAccount;
module.exports.validateCredentials = validateCredentials;

module.exports.sendResetLink = sendResetLink;
module.exports.sendVerificationLink = sendVerificationLink;

module.exports.generateNewSession = generateNewSession;
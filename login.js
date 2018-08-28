const Database = require("./database.js");
const Crypto = require("crypto");

function hashPassword(password)
{
	let hash = Crypto.createHash("sha512");
	return hash.update(password).digest("hex");
}

function generateKey(users)
{
	let key;

	do {
		key = Crypto.randomBytes(16).toString('hex');
	} while (Database.getAccountByKey(key, users) !== -1);

	return key;
}

function validatePassword(password)
{
	let letters = password.match(/[A-Za-z]/g);
	let numbers = password.match(/[0-9]/g);

	if (password.length < 8 || letters === null || numbers === null)
		return false;

	return true;
}

function validateCreateAccount(req)
{
	let usernameDef = (typeof(req.username) !== "undefined") ? 1 : 0;
	let emailDef = (typeof(req.email) !== "undefined") ? 1 : 0;
	let passwordDef = (typeof(req.email) !== "undefined") ? 1 : 0;

	if (passwordDef)
		passwordDef = validatePassword(req.password) ? 1 : 0;

	return (usernameDef && emailDef && passwordDef);
}

function createAccount(req, res, users)
{
	if (!validateCreateAccount(req))
	{
		res.msg = "invalid-request";
		return false;
	}

	let userExists = (Database.getAccountByName(req.username, users) !== -1) ? true : false;
	if (userExists)
	{
		res.msg = "user-exists";
		return false;
	}

	let account = {};

	account.key = generateKey(users);

	account.userInfo = {};
	account.userInfo.username = req.username;
	account.userInfo.email = req.email;
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
	let index = Database.getAccountByName(req.username, users);

	if (typeof(req.username) === "undefined" || typeof(req.password) === "undefined")
		res.msg = "invalid-request";
	else if (index === -1)
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

function verifyEmail()
{
	
}

module.exports.hashPassword = hashPassword;
module.exports.generateKey = generateKey;
module.exports.createAccount = createAccount;
module.exports.validateCredentials = validateCredentials;
const inputLimit = 512;
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
	do { key = Crypto.randomBytes(16).toString('hex'); } while (Database.getAccountByKey(key, users) !== -1);
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

function validateCreateAccount(req, users)
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

	account.key = generateKey(users);
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

module.exports.hashPassword = hashPassword;
module.exports.generateKey = generateKey;
module.exports.createAccount = createAccount;
module.exports.validateCredentials = validateCredentials;
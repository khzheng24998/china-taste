//Included module(s)
const EditOrder = require("./editOrder.js");
const GetMenu = require("./getMenu.js");

function updateOrder(req, order)
{
	EditOrder.updateOrder(req, order);
}

function updateOrderInfo(req, orderInfo)
{
	orderInfo.orderType = req.orderType;
	orderInfo.addressInfo = req.addressInfo;
	orderInfo.customerInfo = req.customerInfo;
	orderInfo.orderDetails = req.orderDetails;
}

function getMenu(req)
{
	let menu = GetMenu.getMenuGroup(req);
	return menu;
}

/*---------------------------------------------*/

const inputLimit = 512;

/* Helper functions */

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

function validateLogIn(req)
{
	let validEmail = validateRequiredInput(req.email);
	let validPassword = validateRequiredInput(req.password);

	return (validEmail && validPassword);
}

function validateCreateAccount(req)
{
	let validFirstName = validateRequiredInput(req.firstName);
	let validLastName = validateRequiredInput(req.lastName);
	let validEmail = validateRequiredInput(req.email);
	let validPhoneNumber = validatePhoneNumber(req.phoneNumber);
	let validPassword = validatePassword(req.password);

	return (validFirstName && validLastName && validEmail && validPhoneNumber && validPassword);
}

function validateSendResetEmail(req)
{
	return validateRequiredInput(req.email);
}

function validatePasswordReset(req)
{
	return validatePassword(req.password);
}

/* For export */

function validatePostData(req, type)
{
	let valid;

	switch(type)
	{
		case "log-in":
			valid = validateLogIn(req);
			break;
		case "create-account":
			valid = validateCreateAccount(req);
			break;
		case "send-reset-email":
			valid = validateSendResetEmail(req);
			break;
		case "password-reset":
			valid = validatePasswordReset(req);
			break;
		default:
			valid = false;
			break;
	}

	return valid;
}

module.exports.updateOrder = updateOrder;
module.exports.updateOrderInfo = updateOrderInfo;
module.exports.getMenu = getMenu;

module.exports.validatePostData = validatePostData;
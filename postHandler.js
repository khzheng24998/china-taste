//Included module(s)
const EditOrder = require("./editOrder.js");
const GetMenu = require("./getMenu.js");

function validateUpdateOrder(req)
{
	let actionDef = (typeof(req.action) !== "undefined");
	let nameDef = (typeof(req.name) !== "undefined");
	let sizeDef = (typeof(req.size) !== "undefined");
	let quantityDef = (typeof(req.quantity) !== "undefined");
	let lookupHandleDef = (typeof(req.lookupHandle) !== "undefined");

	if (actionDef && nameDef && sizeDef && quantityDef && lookupHandleDef)
		return true;
	else
		return false;
}

function validateRequest(req, url)
{
	switch (url)
	{
		case "/update-order":
			return validateUpdateOrder(req);
		case "/get-menu":
			return (typeof(req.category) !== "undefined");
		default:
			break;
	}
}

function updateOrder(req, order)
{
	if (!validateRequest(req, "/update-order"))
	{
		console.log("Invalid POST data received!");
		return;
	}

	EditOrder.updateOrder(req, order);
}

function updateOrderInfo(req, orderInfo)
{
	orderInfo.type = req.type;
}

function getMenu(req)
{
	if (!validateRequest(req, "/get-menu"))
	{
		console.log("Invalid POST data received!");
		return;
	}

	let menu = GetMenu.getMenuGroup(req);
	return menu;
}

module.exports.updateOrder = updateOrder;
module.exports.updateOrderInfo = updateOrderInfo;
module.exports.getMenu = getMenu;
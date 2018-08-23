//Included module(s)
const EditOrder = require("./editOrder.js");
const GetMenu = require("./getMenu.js");

function validateUpdateOrder(req)
{
}

function validateRequest(req, url)
{
}

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

module.exports.updateOrder = updateOrder;
module.exports.updateOrderInfo = updateOrderInfo;
module.exports.getMenu = getMenu;
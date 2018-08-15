//Included module(s)
const Menu = require("./menu.js");

//Return value: Returns true on success and false otherwise.
//Argument(s):
// - req: {action, name, size, quantity}
// - order: order list
function updateOrder(req, order)
{
	switch(req.action)
	{
		case "add":
			addToOrder(req, order);
			return true;
		case "remove":
			removeFromOrder(req, order);
			return true;
		case "change-quantity":
			changeQuantity(req, order);
			return true;
		case "change-size":
			changeSize(req, order);
			return true;
		default:
			console.log("updateOrder: Invalid action!");
			return false;
	}
}

function getCost(lookupHandle)
{
	console.log(lookupHandle);
	let category = lookupHandle.substring(0,4);
	let index = parseInt(lookupHandle[4]);

	let menuList = Menu.menu[category];
	let menuItem = menuList[index];
	return menuItem.cost;
}

function validateAdd(req, order)
{

}

//Return value: None.
//Argument(s):
// - req: {action, name, size, quantity}
// - order: order list
function addToOrder(req, order)
{
	let index = getOrderIndex(req.name, req.size, order);
	if (index != -1)
	{
		let sum = (+order[index].quantity) + (+req.quantity);
		order[index].quantity = sum;
		return true;
	}
	else
	{
		let temp = {};
		temp.name = req.name;
		temp.size = req.size;
		temp.quantity = req.quantity;
		temp.cost = getCost(req.lookupHandle);

		order.push(temp);
	}
}

//Return value: Returns true on success and false otherwise (note: a return value of false does not necessarily indicate program failure).
//Argument(s):
// - req: {action, name, size, quantity}
// - order: order list
function removeFromOrder(req, order)
{
	let index = getOrderIndex(req.name, req.size, order);
	if (index != -1)
	{
		order.splice(index, 1);
		return true;
	}

	return false;
}

//Return value: Returns true on success and false otherwise (note: a return value of false does not necessarily indicate program failure).
//Argument(s):
// - req: {action, name, size, quantity}
// - order: order list
function changeQuantity(req, order)
{
	if (req.quantity == 0)
		return removeFromOrder(req, order);

	let index = getOrderIndex(req.name, req.size, order);
	if (index != -1)
	{
		order[index].quantity = req.quantity;
		return true;
	}

	return false;
}

function changeSize(req, order)
{
	let index = getOrderIndex(req.name, req.size, order);
	if (index != -1)
	{
		let newSize = "null";
		if (req.size == "small" || req.size == "large")
			newSize = (req.size == "small") ? "large" : "small";

		if (newSize == "null")
			return false;

		for (let i = 0; i < order.length; i++)
			if (order[i].name == order[index].name && order[i].size == newSize)
			{
				let sum = (+order[i].quantity) + (+order[index].quantity);
				order[i].quantity = sum;

				removeFromOrder(req, order);
				return true;
			}

		order[index].size = newSize;
		return true;
	}

	return false;
}

//Return value: Returns index of the item identified by arguments name and size, if found in order. Returns -1 otherwise.
//Argument(s):
// - name: name of item
// - size: size of item
// - order: order list
function getOrderIndex(name, size, order)
{
	for (let i = 0; i < order.length; i++)
		if (name == order[i].name && size == order[i].size)
			return i;

	return -1;
}

module.exports.updateOrder = updateOrder;
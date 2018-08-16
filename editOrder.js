//Included module(s)
const Menu = require("./menu.js");

/*------Menu Entry---------/

struct MenuEntry
{
	name;
	category;
	cost = [];
	extra = [];
}

/-------Order Entry-------/

struct OrderEntry
{
	menuEntry = {};
	size;
	quantity;
	special;
}
*/

function menuEntryIsEqual(a, b)
{
	let sameName = (a.name === b.name) ? 1 : 0;
	let sameCategory = (a.category === b.category) ? 1 : 0;

	let sameCost = 0;
	if (a.cost.length === b.cost.length)
	{
		if (a.cost.length === 1)
			sameCost = (a.cost[0] === b.cost[0]) ? 1 : 0;
		else if (a.cost.length === 2)
			sameCost = ((a.cost[0] === b.cost[0]) && (a.cost[1] === b.cost[1])) ? 1 : 0;
	}

	return (sameName && sameCategory && sameCost);
}

function orderEntryIsEqual(a, b)
{
	/*let sameMenuEntry = menuEntryIsEqual(a.menuEntry, b.menuEntry);
	let sameSize = (a.size === b.size) ? 1 : 0;
	let sameQuantity = (a.quantity === b.quantity) ? 1 : 0;
	let sameSpecial = (a.special === b.special) ? 1 : 0;

	return (sameMenuEntry && sameSize && sameQuantity && sameSpecial);*/

	if (JSON.stringify(a) === JSON.stringify(b))
		return true;

	return false;
}

function orderLookup(orderEntry, order)
{
	for (let i = 0; i < order.length; i++)
		if (orderEntryIsEqual(orderEntry, order[i]))
			return i;

	return -1;
}

//Return value: Returns true on success and false otherwise.
//Argument(s):
// - req: {action, name, size, quantity}
// - order: order list
function updateOrder(req, order)
{
	switch(req.action)
	{
		case "add-item":
			addToOrder(req, order);
			return true;
		case "remove-item":
			removeFromOrder(req, order);
			return true;
		case "update-item":
			updateItem(req, order);
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
	/*let index = orderLookup(req.name, req.size, order);

	//Item is already in 
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
	}*/

	order.push(req.orderEntry);
}

//Return value: Returns true on success and false otherwise (note: a return value of false does not necessarily indicate program failure).
//Argument(s):
// - req: {action, name, size, quantity}
// - order: order list
function removeFromOrder(req, order)
{
	let index = orderLookup(req.orderEntry, order);
	if (index != -1)
	{
		order.splice(index, 1);
		return true;
	}

	return false;
}

function updateItem(req, order)
{
	let index = orderLookup(req.orderEntry, order)
	if (index != -1)
	{
		order[index] = req.newEntry;
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
	/*if (req.quantity == 0)
		return removeFromOrder(req, order);

	let index = getOrderIndex(req.name, req.size, order);
	if (index != -1)
	{
		order[index].quantity = req.quantity;
		return true;
	}

	return false;*/
}

function changeSize(req, order)
{
	/*let index = getOrderIndex(req.name, req.size, order);
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

	return false;*/
}

module.exports.updateOrder = updateOrder;
//Included module(s)
const Menu = require("./menu.js");

function objectsAreEqual(a, b)
{
	if (JSON.stringify(a) === JSON.stringify(b))
		return true;

	return false;
}

function orderLookup(orderEntry, order)
{
	for (let i = 0; i < order.length; i++)
		if (objectsAreEqual(orderEntry, order[i]))
			return i;

	return -1;
}

function menuLookup(menuEntry)
{

}

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

function orderItem(req, order)
{

}

function addToOrder(req, order)
{
	let index = orderLookup(req.orderEntry, order);
	if (index != -1)
		order[index].quantity = (+order[index].quantity) + (+req.orderEntry.quantity);
	else
		order.push(req.orderEntry);
}

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

module.exports.updateOrder = updateOrder;
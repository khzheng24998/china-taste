const Database = require("./database.js");

/* Helper functions */

function updateItems(request, items)
{
	switch(request.action)
	{
		case "add-item":
			addToOrder(request, items);
			break;
		case "remove-item":
			removeFromOrder(request, items);
			break;
		case "update-item":
			updateItem(request, items);
			break;
		default:
			console.log("ERROR: updateItems() - Invalid update action!");
			break;
	}
}

function addToOrder(request, items)
{
	items.push(request.orderEntry);
}

function removeFromOrder(request, items)
{
	let index = itemLookup(request.orderEntry, items);
	if (index != -1)
		items.splice(index, 1);
}

function updateItem(request, items)
{
	let index = itemLookup(request.orderEntry, items)
	if (index != -1)
		items[index] = request.newEntry;
}

function objectsAreEqual(a, b)
{
	if (JSON.stringify(a) === JSON.stringify(b))
		return true;

	return false;
}

function itemLookup(entry, items)
{
	for (let i = 0; i < items.length; i++)
		if (objectsAreEqual(entry, items[i]))
			return i;

	return -1;
}

/* Exported functions */

async function asyncGetMenuAndItems(req, res)
{
	let key = req.cookies.loginKey;
	let body = req.body;
	let menuAndItems = {};

	menuAndItems.menu = await Database.getMenu(body.category);

	let session = await Database.findActiveSession("key", key);
	if (session !== null)
	{
		let user = await Database.findUser("_id", session.userId);

		//NOTE: In the future, might want to add a check and error message for user...

		let orderId = user.currentOrder;
		let currentOrder = await Database.findOrder(orderId);
		menuAndItems.orderItems = currentOrder.items;	
	}
	else
		menuAndItems.orderItems = [];

	menuAndItems.msg = "ok";
	res.send(menuAndItems);
}

async function asyncUpdateOrder(req, res)
{
	let key = req.cookies.loginKey;
	let body = req.body;

	let session = await Database.findActiveSession("key", key);
	if (session !== null)
	{
		let user = await Database.findUser("_id", session.userId);

		//NOTE: In the future, might want to add a check and error message for user...

		let orderId = user.currentOrder;
		let currentOrder = await Database.findOrder(orderId);
		let items = currentOrder.items;

		updateItems(body, items);
		Database.updateOrder(orderId, items);
		res.send({ msg: "ok" });
	}
	else
		res.send({ msg: "signed-out" });
}

module.exports.asyncGetMenuAndItems= asyncGetMenuAndItems;
module.exports.asyncUpdateOrder = asyncUpdateOrder;
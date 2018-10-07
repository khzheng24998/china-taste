const Crypto = require("crypto");
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

function getOrderItem(id, items)
{
	for (let i = 0; i < items.length; i++)
	{
		if (items.id == id)
			return i;
	}

	return -1;
}

async function generateOrderEntry(request, items)
{
	let orderEntry = {};
	let menuEntry = await Database.getMenuItem(request.name, request.category);
	if (menuEntry == null)
		return false;

	let id;
	do { id = Crypto.randomBytes(16).toString('hex') } while (getOrderItem(id, items) != -1);

	orderEntry.id = id;
	orderEntry.name = menuEntry.name;
	orderEntry.category = request.category;
	orderEntry.quantity = request.quantity;

	if (menuEntry.cost.length == 1 && request.size != "N/A")
		return false;

	orderEntry.size = request.size;
}

function addToOrder(request, items)
{
	/* struct orderEntry {
		name,
		category,
		size, 
		quantity
	} */

	/*let menuEntry = await Database.getItem(request.orderEntry.name, request.orderEntry.category);

	let orderEntry = request.orderEntry;
	
	orderEntry.id = id;*/

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
const Crypto = require("crypto");
const Database = require("./database.js");

/* Helper functions */

function updateItems(request, items)
{
	return new Promise(async function(resolve, reject)
	{
		switch(request.action)
		{
			case "add-item":
				await addToOrder(request, items);
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

		resolve(true);
	});
}

function addToOrder(request, items)
{
	return new Promise(async function(resolve, reject)
	{
		let orderEntry = {};
		let menuEntry = await Database.getMenuItem(request.menuEntry.name, request.menuEntry.category);

		let id;
		do { id = Crypto.randomBytes(16).toString('hex') } while (itemLookup(id, items) != -1);

		orderEntry.menuEntry = menuEntry;
		orderEntry.id = id;

		//Need to add checks to quantity and size
		orderEntry.quantity = request.quantity;
		orderEntry.size = request.size;

		items.push(orderEntry);
		
		resolve(true);
	});
}

function removeFromOrder(request, items)
{
	let index = itemLookup(request.id, items);
	if (index !== -1)
		items.splice(index, 1);
}

function updateItem(request, items)
{
	let index = itemLookup(request.id, items);
	if (index !== -1)
	{
		//Need to add checks to quantity and size
		items[index].size = request.size;
		items[index].quantity = request.quantity;
	}
}

function itemLookup(id, items)
{
	for (let i = 0; i < items.length; i++)
		if (id == items[i].id)
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

		await updateItems(body, items);
		Database.updateOrder(orderId, items);
		res.send({ msg: "ok" });
	}
	else
		res.send({ msg: "signed-out" });
}

module.exports.asyncGetMenuAndItems= asyncGetMenuAndItems;
module.exports.asyncUpdateOrder = asyncUpdateOrder;
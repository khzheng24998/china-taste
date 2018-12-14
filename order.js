const OrderHelper = require("./orderHelper.js");
const PostValidator = require("./postValidation.js");

function orderEvents(app)
{
	app.post('/get-menu-and-items', function(req, res)
	{
		console.log("Received POST request from client! (get-menu-and-items)");
		OrderHelper.asyncGetMenuAndItems(req, res);
	});

	app.post('/update-order', function(req, res)
	{
		console.log("Received POST request from client! (update-order)");
		OrderHelper.asyncUpdateOrder(req, res);
	});

	app.get('/my-order', function(req, res)
	{
		console.log("Received GET request from client! (my-order)");
		OrderHelper.asyncGetMyOrder(req, res);
	});

	/*//Update order info
	app.post('/submit-order', function(req, res)
	{
		console.log("Received POST request from client! (submit-order)");

		let orderId = req.cookies.orderId;
		if (typeof(currentOrders[orderId]) !== "undefined")
			postHandler.updateOrderInfo(req.body, currentOrders[orderId].info);

		emailModule.sendMail(process.argv[2], currentOrders[orderId]);
		placedOrders.push(currentOrders[orderId]);
		delete currentOrders[orderId];
		res.clearCookie("orderId");

		res.sendStatus(200);
	});*/

	//Send order to client browser
	/*app.get('/my-order', function(req, res)
	{
		console.log("Received GET request from client! (my-order)");

		let empty = {};
		empty.info = {};
		empty.items = [];

		let key = req.cookies.key;
		let index = Database.getAccountByKey(key);
		if (key === -1)
			res.send(empty);
		else
		{
			let order = users[index].currentOrder;
		}

		if (typeof(currentOrders[orderId]) !== "undefined")
			res.send(currentOrders[orderId]);
		else
			res.send(empty);
	});*/
}

module.exports.orderEvents = orderEvents;
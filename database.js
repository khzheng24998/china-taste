const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://khzheng24998:174acr858onr@cluster0-m9ge7.gcp.mongodb.net/test?retryWrites=true';

let _db = null;

/* General purpose database functions */

function initializeDb()
{
	return new Promise(function(resolve, reject) 
	{
		if (_db)
			resolve(true);

		else
		{
			MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) 
			{
				_db = db;
				resolve(true);
			});
		}
	});
}

function getDb()
{
	if (!_db)
	{
		console.log("ERROR: Database is uninitialized.");
		return null;
	}

	return _db;
}

/* Add object to database */

function insertActiveSession(session)
{
	if (!verifyActiveSession(session))
		console.log("ERROR: insertActiveSession() - session argument missing fields!");

	else
		insertRequestOrSession("activeSessions", session);
}

function insertResetRequest(request)
{
	if (!verifyResetRequest(request))
		console.log("ERROR: insertResetRequest() - request argument missing fields!");

	else
		insertRequestOrSession("resetRequests", request);
}

function insertVerificationRequest(request)
{
	if (!verifyVerificationRequest(request))
		console.log("ERROR: insertVerificationRequest() - request argument missing fields!");

	else
		insertRequestOrSession("verificationRequests", request);
}

function insertRequestOrSession(group, arg)
{
	if (group !== "activeSessions" && group !== "resetRequests" && group !== "verificationRequests")
		return;

	let init = initializeDb();
	init.then(function()
	{
		let db = getDb();
		let chinaTaste = db.db("chinataste");
		chinaTaste.collection(group).insertOne(arg);
	});
}

/* Remove object from database */

function deleteActiveSession(id)
{
	deleteRequestOrSession("activeSessions", id);
}

function deleteResetRequest(id)
{
	deleteRequestOrSession("resetRequests", id);
}

function deleteVerificationRequest(id)
{
	deleteRequestOrSession("verificationRequests", id);
}

function deleteRequestOrSession(group, id)
{
	if (group !== "activeSessions" && group !== "resetRequests" && group !== "verificationRequests")
		return;

	let init = initializeDb();
	init.then(function()
	{
		let db = getDb();
		let chinaTaste = db.db("chinataste");
		chinaTaste.collection(group).deleteOne({ "_id": id });
	});
}

/* Replace object in database */

function replaceActiveSession(id, session)
{
	if (!verifyActiveSession(session))
		console.log("ERROR: replaceActiveSession() - session argument missing fields!");

	else
		replaceRequestOrSession("activeSessions", id, session);
}

function replaceResetRequest(id, request)
{
	if (!verifyResetRequest(request))
		console.log("ERROR: replaceResetRequest() - request argument missing fields!");

	else
		replaceRequestOrSession("resetRequests", id, request);
}

function replaceVerificationRequest(id, request)
{
	if (!verifyVerificationRequest(request))
		console.log("ERROR: replaceVerificationRequest() - request argument missing fields!");

	else
		replaceRequestOrSession("verificationRequests", id, request);
}

function replaceRequestOrSession(group, id, arg)
{
	if (group !== "activeSessions" && group !== "resetRequests" && group !== "verificationRequests")
		return;

	let init = initializeDb();
	init.then(function()
	{
		let db = getDb();
		let chinaTaste = db.db("chinataste");
		chinaTaste.collection(group).replaceOne({ "_id": id }, arg);
	});
}

/* Verify object to be inserted into database */

function verifyActiveSession(session)
{
	if ("key" in session === false || "userId" in session === false || "firstName" in session === false 
		|| "lastName" in session === false || "email" in session === false)
		return false;

	return true;
}

function verifyResetRequest(request)
{
	if ("key" in request === false || "expiration" in request === false || "userId" in request === false)
		return false;

	return true;
}

function verifyVerificationRequest(request)
{
	if ("key" in request === false || "userId" in request === false)
		return false;

	return true;
}

/* Find object in database */

function findActiveSession(field, query)
{
	return findRequestOrSession("activeSessions", field, query);
}

function findResetRequest(field, query)
{
	return findRequestOrSession("resetRequests", field, query);
}

function findVerificationRequest(field, query)
{
	return findRequestOrSession("verificationRequests", field, query);
}

function findRequestOrSession(group, field, query)
{
	return new Promise(function(resolve, reject) 
	{
		if (group !== "activeSessions" && group !== "resetRequests" && group !== "verificationRequests")
		{
			console.log("ERROR: findRequestOrSession() - Invalid collection to search in.");
			resolve(null);
			return;
		}

		let init = initializeDb();
		init.then(function()
		{
			let db = getDb();
			let chinaTaste = db.db("chinataste");

			let doc;
			switch (field)
			{
				case "_id": 
					doc = chinaTaste.collection(group).findOne({ "_id": query });
					break;
				case "key":
					doc = chinaTaste.collection(group).findOne({ "key": query });
					break;
				case "userId":
					doc = chinaTaste.collection(group).findOne({ "userId": query });
					break;
				default:
					console.log("ERROR: findRequestOrSession() - Invalid field for lookup.");
					resolve(null);
					return;
			}

			resolve(doc);
		});
	});
}

module.exports.initializeDb = initializeDb;
module.exports.getDb = getDb;

module.exports.insertActiveSession = insertActiveSession;
module.exports.insertResetRequest = insertResetRequest;
module.exports.insertVerificationRequest = insertVerificationRequest;

module.exports.deleteActiveSession = deleteActiveSession;
module.exports.deleteResetRequest = deleteResetRequest;
module.exports.deleteVerificationRequest = deleteVerificationRequest;

module.exports.replaceActiveSession = replaceActiveSession;
module.exports.replaceResetRequest = replaceResetRequest;
module.exports.replaceVerificationRequest = replaceVerificationRequest;

module.exports.findActiveSession = findActiveSession;
module.exports.findResetRequest = findResetRequest;
module.exports.findVerificationRequest = findVerificationRequest;

/* User database functions */

function insertUser(userInfo, orderId)
{
	return new Promise(function(resolve, reject)
	{
		if ("firstName" in userInfo === false || "lastName" in userInfo === false || "email" in userInfo === false 
			|| "phoneNumber" in userInfo === false || "password" in userInfo === false)
		{
			console.log("ERROR: insertUser() - userInfo argument missing fields!");
			resolve(null);
			return;
		}

		let init = initializeDb();
		init.then(function()
		{
			let db = getDb();
			let chinaTaste = db.db("chinataste");

			let doc = chinaTaste.collection("users").insertOne({
				verified: false,
				userInfo: userInfo,
				currentOrder: orderId,
				pastOrders: []
			});

			resolve(doc);
		});
	});
}

function findUser(field, query)
{
	return new Promise(function(resolve, reject) 
	{
		let init = initializeDb();
		init.then(function()
		{
			let db = getDb();
			let chinaTaste = db.db("chinataste");

			let doc;
			switch (field)
			{
				case "_id":
					doc = chinaTaste.collection("users").findOne({ "_id": query });
					break;
				case "email":
					doc = chinaTaste.collection("users").findOne({ "userInfo.email": query });
					break;
				default:
					console.log("ERROR: findUser() - Invalid lookup method.");
					resolve(null);
					return;
			}

			resolve(doc);
		});
	});
}

function updateUserVerified(id, bool)
{
	let init = initializeDb();
	init.then(function()
	{
		let db = getDb();
		let chinaTaste = db.db("chinataste");
		chinaTaste.collection("users").updateOne(
			{ "_id": id },
			{
				$set: { "verified": bool }
			}
		);
	});
}

function updateUserInfo(id, userInfo)
{
	if ("firstName" in userInfo === false || "lastName" in userInfo === false || "email" in userInfo === false 
		|| "phoneNumber" in userInfo === false || "password" in userInfo === false)
	{
		console.log("ERROR: updateUserInfo() - userInfo argument missing fields!");
		return;
	}

	let init = initializeDb();
	init.then(function()
	{
		let db = getDb();
		let chinaTaste = db.db("chinataste");
		chinaTaste.collection("users").updateOne(
			{ "_id": id },
			{
				$set: {
					"userInfo.firstName": userInfo.firstName,
					"userInfo.lastName": userInfo.lastName,
					"userInfo.email": userInfo.email,
					"userInfo.phoneNumber": userInfo.phoneNumber,
					"userInfo.password": userInfo.password
				}
			}
		);
	});
}

/* Order database functions */

function insertOrder()
{
	return new Promise(function(resolve, reject)
	{
		let init = initializeDb();
		init.then(function()
		{
			let db = getDb();
			let chinaTaste = db.db("chinataste");
			let doc = chinaTaste.collection("currentOrders").insertOne({
				info: {},
				items: []
			});

			resolve(doc);
		});
	});
}

function findOrder(id)
{
	return new Promise(function(resolve, reject)
	{
		let init = initializeDb();
		init.then(function()
		{
			let db = getDb();
			let chinaTaste = db.db("chinataste");
			let doc = chinaTaste.collection("currentOrders").findOne({ "_id" : id });
			resolve(doc);
		});
	});
}

function updateOrder(id, items)
{
	let init = initializeDb();
	init.then(function()
	{
		let db = getDb();
		let chinaTaste = db.db("chinataste");
		chinaTaste.collection("currentOrders").updateOne(
			{ "_id": id },
			{
				$set: { "items": items }
			}
		);
	});
}

module.exports.insertUser = insertUser;
module.exports.findUser = findUser;
module.exports.updateUserVerified = updateUserVerified;
module.exports.updateUserInfo = updateUserInfo;

module.exports.insertOrder = insertOrder;
module.exports.findOrder = findOrder;
module.exports.updateOrder = updateOrder;

/* Menu database functions */

function getMenu(category)
{
	return new Promise(function(resolve, reject)
	{
		let init = initializeDb();
		init.then(function()
		{
			let db = getDb();
			let chinaTaste = db.db("chinataste");
			let cursor = chinaTaste.collection("menu_" + category).find();
			resolve(cursor.toArray());
		});
	});
}

function getMenuItem(name, category)
{
	return new Promise(function(resolve, reject)
	{
		let init = initializeDb();
		init.then(function()
		{
			let db = getDb();
			let chinaTaste = db.db("chinataste");
			let doc = chinaTaste.collection("menu_" + category).findOne({ "name" : name });
			resolve(doc);
		});
	});
}

module.exports.getMenu = getMenu;
module.exports.getMenuItem = getMenuItem;

function getAPIKey(name)
{
	return new Promise(function(resolve, reject)
	{
		let init = initializeDb();
		init.then(function()
		{
			let db = getDb();
			let chinaTaste = db.db("chinataste");
			let doc = chinaTaste.collection("apiKeys").findOne({ name: name });
			resolve(doc);
		});
	});
}

module.exports.getAPIKey = getAPIKey;
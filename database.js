const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://khzheng24998:' + process.argv[2] + '@cluster0-m9ge7.gcp.mongodb.net/test?retryWrites=true';

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

function insertRequestOrSession(type, arg)
{
	if (type !== "activeSessions" && type !== "resetRequests" && type !== "verificationRequests")
		return;

	let init = initializeDb();
	init.then(function()
	{
		let db = getDb();
		let chinaTaste = db.db("chinataste");
		chinaTaste.collection(type).insertOne(arg);
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
	deleteResetRequest("verificationRequests", id);
}

function deleteRequestOrSession(type, id)
{
	if (type !== "activeSessions" && type !== "resetRequests" && type !== "verificationRequests")
		return;

	let init = initializeDb();
	init.then(function()
	{
		let db = getDb();
		let chinaTaste = db.db("chinataste");
		chinaTaste.collection(type).deleteOne({ "_id": id });
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
		replaceRequestOrSession("resetRequests", id, session);
}

function replaceVerificationRequest(id, request)
{
	if (!verifyVerificationRequest(request))
		console.log("ERROR: replaceVerificationRequest() - request argument missing fields!");

	else
		replaceRequestOrSession("verificationRequests", id, session);
}

function replaceRequestOrSession(type, id, arg)
{
	if (type !== "activeSessions" && type !== "resetRequests" && type !== "verificationRequests")
		return;

	let init = initializeDb();
	init.then(function()
	{
		let db = getDb();
		let chinaTaste = db.db("chinataste");
		chinaTaste.collection(type).replaceOne({ "_id": id }, arg);
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

function findRequestOrSession(type, field, query)
{
	return new Promise(function(resolve, reject) 
	{
		if (type !== "activeSessions" && type !== "resetRequests" && type !== "verificationRequests")
		{
			console.log("ERROR: findRequestOrSession() - Invalid find type.");
			resolve(null);
			return;
		}

		if (field !== "_id" && field !== "key" && field !== "userId")
		{
			console.log("ERROR: findRequestOrSession() - Invalid field for lookup.");
			resolve(null);
			return;
		}

		let init = initializeDb();
		init.then(function()
		{
			let db = getDb();
			let chinaTaste = db.db("chinataste");
			let doc = chinaTaste.collection(type).findOne({ field: query });
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
			console.log("ERROR: addUser() - userInfo argument missing fields!");
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

			resolve(doc.insertedId);
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
		console.log("ERROR: addUser() - userInfo argument missing fields!");
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

function findUser(field, query)
{
	return new Promise(function(resolve, reject) 
	{
		if (field !== "_id" && field !== "email")
		{
			console.log("ERROR: findUser() - Invalid lookup method.");
			resolve(null);
			return;
		}

		if (field === "email")
			field = "userInfo.email";

		let init = initializeDb();
		init.then(function()
		{
			let db = getDb();
			let chinaTaste = db.db("chinataste");
			let doc = chinaTaste.collection("users").findOne({ field: query });
			resolve(doc);
		});
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

			resolve(doc.insertedId);
		});
	});
}

module.exports.insertUser = insertUser;
module.exports.findUser = findUser;
module.exports.updateUserVerified = updateUserVerified;
module.exports.updateUserInfo = updateUserInfo;

module.exports.insertOrder = insertOrder;
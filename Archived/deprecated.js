function createAccount(req, res, users)
{
	let userExists = (Database.getAccountByEmail(req.email, users) !== -1) ? true : false;
	if (userExists)
	{
		res.msg = "account-exists";
		return false;
	}

	let account = {};
	account.verified = false;

	account.userInfo = {};
	account.userInfo.firstName = req.firstName;
	account.userInfo.lastName = req.lastName;
	account.userInfo.email = req.email;
	account.userInfo.phoneNumber = formatPhoneNumber(req.phoneNumber);
	account.userInfo.password = hashPassword(req.password);

	account.currentOrder = {};
	account.currentOrder.info = {};
	account.currentOrder.items = [];

	account.pastOrders = [];

	users.push(account);

	res.msg = "ok";
	return true;
}

function logIn(req, res, users)
{
	let index = Database.getAccountByEmail(req.email, users);
	if (index === -1)
		res.msg = "not-found";
	else if (users[index].userInfo.password !== hashPassword(req.password))
		res.msg = "invalid-credentials";
	else
	{
		res.msg = "ok";
		return index;
	}
	
	return -1;
}

function generateNewSession(firstName, lastName, email, activeSessions)
{
	let session = {};
	session.key = generateKey(activeSessions);
	session.userInfo = {
		firstName: firstName,
		lastName: lastName,
		email: email
	};

	activeSessions.push(session);
	return session.key;
}

function getNavBarInfo(key, res, activeSessions)
{
	let index = Database.getRequestByKey(key, activeSessions);
	if (index !== -1)
	{
		res.msg = "signed-in";
		res.firstName = activeSessions[index].userInfo.firstName;
		res.lastName = activeSessions[index].userInfo.lastName;
	}
	else
		res.msg = "signed-out";
}

function logOut(key, res, activeSessions)
{
	let index = Database.getRequestByKey(key, activeSessions);
	if (index !== -1)
	{
		activeSessions.splice(index, 1);
		res.msg = "ok";
		return true;
	}

	res.msg = "not-found";
	return false;
}

function generateKey(array)
{
	let key;
	do { key = Crypto.randomBytes(16).toString('hex'); } while (Database.getRequestByKey(key, array) !== -1);
	return key;
}

function getSessionByEmail(email, sessions)
{
	return getAccountByEmail(email, sessions);
}

function getRequestByEmail(email, requests)
{
	return getAccountByEmail(email, requests);
}

function getAccountByEmail(email, users)
{
	for (let i = 0; i < users.length; i++)
	{
		if (typeof(users[i].userInfo.email) !== "undefined" && users[i].userInfo.email === email)
			return i;
	}

	return -1;
}

function getSessionByKey(key, sessions)
{
	return getRequestByKey(key, sessions);
}

function getRequestByKey(key, requests)
{
	for (let i = 0; i < requests.length; i++)
	{
		if (typeof(requests[i].key) !== "undefined" && requests[i].key === key)
			return i;
	}

	return -1;
}

function getAccountByKey(key, users, activeSessions)
{
	let index = getRequestByKey(key, activeSessions);
	if (index !== -1)
	{
		return getAccountByEmail(activeSessions[index].userInfo.email, users);
	}

	return -1;
}

function generateResetRequest(email, resetRequests)
{
	let randString = generateKey(resetRequests);
	let date = new Date();
	let currentTime = date.getTime();
	let expirationDate = (+currentTime) + (+900000);

	let index = Database.getRequestByEmail(email, resetRequests);		//Reset key expires in 15 minutes
	if (index !== -1)
	{
		//Generate new key and expiration date for pre-existing reset request
		resetRequests[index].key = randString;
		resetRequests[index].expirationDate = expirationDate;
	}
	else
	{
		let pendingReset = {};
		pendingReset.key = randString;
		pendingReset.expirationDate = expirationDate;
		pendingReset.userInfo = {
			email: email
		};

		resetRequests.push(pendingReset);
	}

	return randString;
}

function sendResetLink(req, res, users, resetRequests)
{
	let index = Database.getAccountByEmail(req.email, users);
	if (index !== -1)
	{
		let randString = generateResetRequest(users[index].userInfo.email, resetRequests);
		Email.sendLink(process.argv[2], randString, users[index].userInfo.email, "reset");
		res.msg = "ok";
	}
	else
		res.msg = "not-found";
}

/* Active session database functions */

function addActiveSession(session)
{
	if (Object.keys(session).length !== 4)
	{
		console.log("ERROR: addActiveSession() - Too few/many fields in session.");
		return;
	}

	let init = initializeDb();
	init.then(function()
	{
		let db = getDb();
		let chinaTaste = db.db("chinataste");
		chinaTaste.collection("activeSessions").insertOne(session);
	});
}

function removeActiveSession(id)
{
	let init = initializeDb();
	init.then(function()
	{
		let db = getDb();
		let chinaTaste = db.db("chinataste");
		chinaTaste.collection("activeSessions").deleteOne({ "_id": id });
	});
}

function updateActiveSession(id, session)
{
	if (Object.keys(session).length !== 4)
	{
		console.log("ERROR: updateActiveSession() - Too few/many fields in session.");
		return;
	}

	let init = initializeDb();
	init.then(function()
	{
		let db = getDb();
		let chinaTaste = db.db("chinataste");
		chinaTaste.collection("activeSessions").updateOne(
			{ "_id": id },
			{
				$set: {
					"key": session.key,
					"userId": session.userId,
					"firstName": session.firstName,
					"lastName": session.lastName
				}
			}
		);
	});
}

function getActiveSession(method, query)
{
	return new Promise(function(resolve, reject) 
	{
		let init = initializeDb();
		init.then(function()
		{
			let db = getDb();
			let chinaTaste = db.db("chinataste");

			let field = "";
			switch (method)
			{
				case "userId": 
					field = "userId";
					break;
				case "key":
					field = "key";
					break;
				default:
					field = "error";
					console.log("ERROR: getActiveSession() - Invalid lookup method.");
					break;
			}

			let doc = chinaTaste.collection("activeSessions").findOne({ field: query });
			resolve(doc);
		});
	});
}

/* End of active session database functions */

/* Reset request database functions */

function addResetRequest()
{

}

function removeResetRequest(id)
{
	let init = initializeDb();
	init.then(function()
	{
		let db = getDb();
		let chinaTaste = db.db("chinataste");
		chinaTaste.collection("resetRequests").deleteOne({ "_id": id });
	});
}

function updateResetRequest(id, request)
{
	if (Object.keys(session).length !== 4)
	{
		console.log("ERROR: updateActiveSession() - Too few/many fields in session.");
		return;
	}

	let init = initializeDb();
	init.then(function()
	{
		let db = getDb();
		let chinaTaste = db.db("chinataste");
		chinaTaste.collection("activeSessions").updateOne(
			{ "_id": id },
			{
				$set: {
					"key": session.key,
					"userId": session.userId,
					"firstName": session.firstName,
					"lastName": session.lastName
				}
			}
		);
	});
}

function getResetRequest(method, query)
{
	return new Promise(function(resolve, reject) 
	{
		let init = initializeDb();
		init.then(function()
		{
			let db = getDb();
			let chinaTaste = db.db("chinataste");

			let field = "";
			switch (method)
			{
				case "userId": 
					field = "userId";
					break;
				case "key":
					field = "key";
					break;
				default:
					field = "error";
					console.log("ERROR: getResetRequest() - Invalid lookup method.");
					break;
			}

			let doc = chinaTaste.collection("resetRequests").findOne({ field: query });
			resolve(doc);
		});
	});
}

/* End of reset request database functions */

/* Verification request database functions */

function addVerificationRequest(request)
{
	if (Object.keys(request).length !== 2)
	{
		console.log("ERROR: addVerificationRequest() - Too few/many fields in session.");
		return;
	}

	let init = initializeDb();
	init.then(function()
	{
		let db = getDb();
		let chinaTaste = db.db("chinataste");
		chinaTaste.collection("activeSessions").insertOne(session);
	});
}

/* End of verification request database functions */

function verifyEmail(key, users, verificationRequests)
{
	let index = Database.getRequestByKey(key, verificationRequests);
	if (index !== -1)
	{
		let idx = Database.getAccountByEmail(verificationRequests[index].userInfo.email, users);
		users[idx].verified = true;

		//Delete verification request
		verificationRequests.splice(index, 1);
		return true;
	}
	
	return false;
}

function resetPassword(key, req, res, users, resetRequests)
{
	let index = Database.getRequestByKey(key, resetRequests)
	if (index !== -1)
	{
		let idx = Database.getAccountByEmail(resetRequests[index].userInfo.email, users);
		users[idx].userInfo.password = hashPassword(req.password);

		//Delete reset request
		resetRequests.splice(index, 1);
		res.msg = "ok";
	}
	else
		res.msg = "not-found";
}

function sendVerificationLink(key, res, activeSessions, verificationRequests)
{
	let index = Database.getRequestByKey(key, activeSessions);
	if (index !== -1)
	{
		let randString = generateVerificationRequest(activeSessions[index].userInfo.email, verificationRequests);
		Email.sendLink(process.argv[2], randString, activeSessions[index].userInfo.email, "verification");
		res.msg = "ok";
	}
	else
		res.msg = "not-found";
}

async function asyncSendVerificationLink(req, res)
{
	let key = req.cookies.loginKey;

	let session = await Database.findActiveSession("key", key);
	if (session === null)
	{
		res.send({ "msg": "error" });
		return;
	}

	//For future: store email in session object to avoid user lookup

	let user = await Database.findUser("_id", session.userId);
	if (user === null)
	{
		res.send({ "msg": "error" });
		return;
	}

	let randString = await asyncKeyGen("verification");
	asyncVerificationRequestGen(randString, session.userId);

	Email.sendLink(process.argv[2], randString, user.userInfo.email, "verification");
	res.send({ "msg": "ok" });
}
const MongoClient = require('mongodb').MongoClient;

function addActiveSession(key, firstName, lastName, email)
{
	let url = 'mongodb+srv://khzheng24998:174acr858onr@cluster0-m9ge7.gcp.mongodb.net/test?retryWrites=true';

	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) 
	{
		let mydb = db.db("chinataste");
		mydb.collection("activeSessions").insertOne({
			key: key, 
		   	firstName: firstName,
		   	lastName: lastName,
		   	email: email
		});

		console.log("Added active session!");
		db.close();
	});
}

function removeActiveSession(key)
{
	let url = 'mongodb+srv://khzheng24998:174acr858onr@cluster0-m9ge7.gcp.mongodb.net/test?retryWrites=true';

	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) 
	{
		let mydb = db.db("chinataste");
		mydb.collection("activeSessions").deleteOne({ "key": key });

		console.log("Removed active session!");
		db.close();
	});
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

module.exports.getSessionByKey = getSessionByKey;
module.exports.getRequestByKey = getRequestByKey;
module.exports.getAccountByKey = getAccountByKey;

module.exports.getSessionByEmail = getSessionByEmail;
module.exports.getRequestByEmail = getRequestByEmail;
module.exports.getAccountByEmail = getAccountByEmail;
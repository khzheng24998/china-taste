const MongoClient = require('mongodb').MongoClient;
const Crypto = require("crypto");
const url = 'mongodb+srv://khzheng24998:174acr858onr@cluster0-m9ge7.gcp.mongodb.net/test?retryWrites=true';

function addActiveSession(session)
{
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
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) 
	{
		let mydb = db.db("chinataste");
		mydb.collection("activeSessions").deleteOne({ "key": key });

		console.log("Removed active session!");
		db.close();
	});
}

function updateActiveSession(key, newFirstName, newLastName, newEmail)
{
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) 
	{
		let mydb = db.db("chinataste");
		mydb.collection("activeSessions").updateOne(
			{ "key": key },
			{
				$set: { firstName: newFirstName, lastName: newLastName, email: newEmail }
			}
		);

		console.log("Updated active session!");
		db.close();
	});
}

function findActiveSession(key)
{
	return new Promise(function(resolve, reject) 
	{
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) 
		{
			let myDb = db.db("chinataste");
			let myDoc = myDb.collection("activeSessions").findOne(
				{ "key": key }
			);

			db.close();
			resolve(myDoc);
		});
	});
}

async function asyncFindActiveSession(key)
{
	let data = await findActiveSession(key);
	console.log(data);

	let msg = (data === null) ? "signed-out" : "signed-in";
	console.log(msg);
}

function addUser(userInfo)
{
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db)
	{
		let myDb = db.db("chinataste");
		myDb.collection("users").insertOne({
			verified: false,
		   	userInfo: userInfo,
		   	currentOrder: {
		   		info: {},
		   		items: []
		   	},
			pastOrders: []
		});

		db.close();
	});
}

async function asyncFindUserByEmail(email)
{
	let data = await getUserByEmail(email);
	console.log(data);
}

let userInfo = {
	firstName: "Kenny",
	lastName: "Zheng",
	email: "kennyzheng24998@gmail.com",
	phoneNumber: "8603351427",
	password: "174acr858onr"
};

//Return value: A promise which resolves to the cursor returned by the find

function getAllActiveSessions()
{
	return new Promise(function(resolve, reject)
	{
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) 
		{
			let myDb = db.db("chinataste");
			let myCursor = myDb.collection("activeSessions").find();
			let keyArray = myCursor.map(function(doc) { return doc.key; }).toArray();

			resolve(keyArray);
			db.close();
		});
	});
}

//addUser(userInfo);
//asyncFindUserByEmail("choufoo@hotmail.com");

async function asyncFunc()
{
	let docArray = await getAllActiveSessions();
	//docArray.forEach(function(myDoc) {console.log(myDoc.key)});
	//let docArray = cursor.toArray();
	console.log(docArray);
	//console.log(cursor);
}

//asyncFunc();

//asyncFindActiveSession("AB754FZ");

async function asyncSessionKeyGen()
{
	let attempts = 0;

	while (attempts < 10)
	{
		let key = Crypto.randomBytes(16).toString('hex');
		let session = await findActiveSession(key);
		if (session === null)
			return key;

		attempts++;
	}
}

//Return value: A promise which resolves to the array of keys found in the documents returned by the find

function getAllSessionKeys()
{
	return new Promise(function(resolve, reject)
	{
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) 
		{
			let myDb = db.db("chinataste");
			let myCursor = myDb.collection("activeSessions").find();
			let keyArray = myCursor.map(function(doc) { return doc.key; }).toArray();

			resolve(keyArray);
			db.close();
		});
	});
}

function findActiveSession(key)
{
	return new Promise(function(resolve, reject) 
	{
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) 
		{
			let myDb = db.db("chinataste");
			let myDoc = myDb.collection("activeSessions").find({ "key": key }).limit(1);
			resolve(myDoc);
			db.close();
		});
	});
}






const Database = require("./database.js");

function getUserByEmail(db, email)
{
	return new Promise(function(resolve, reject) 
	{
		let myDb = db.db("chinataste");
		let myDoc = myDb.collection("users").findOne({ "userInfo.email": email });
		resolve(myDoc);
	});
}

function test(arg1, arg2, arg3)
{
	console.log(arguments.length);
}

async function main()
{
	/*let done = await Database.initializeDb();
	if (done)
	{
		let db = Database.getDb();
		let user = await getUserByEmail(db, "kennyzheng24998@gmail.com");
		console.log(user);
	}*/

	test("Hello");
}

main();
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://khzheng24998:174acr858onr@cluster0-m9ge7.gcp.mongodb.net/test?retryWrites=true';

function addActiveSession(key, firstName, lastName, email)
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

asyncFindActiveSession("AB754F");
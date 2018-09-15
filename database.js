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
function getRequestByEmail(email, requests)
{
	return getAccountByEmail(email, requests);
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

function getAccountByEmail(email, users)
{
	for (let i = 0; i < users.length; i++)
	{
		if (typeof(users[i].userInfo.email) !== "undefined" && users[i].userInfo.email === email)
			return i;
	}

	return -1;
}

module.exports.getRequestByKey = getRequestByKey;
module.exports.getRequestByEmail = getRequestByEmail;
module.exports.getAccountByEmail = getAccountByEmail;
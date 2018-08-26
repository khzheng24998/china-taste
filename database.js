function getAccountByKey(key, users)
{
	for (let i = 0; i < users.length; i++)
	{
		if (typeof(users[i].key) !== "undefined" && users[i].key === key)
			return i;
	}

	return -1;
}

function getAccountByName(username, users)
{
	for (let i = 0; i < users.length; i++)
	{
		if (users[i].userInfo.username === username)
			return i;
	}

	return -1;
}

module.exports.getAccountByKey = getAccountByKey;
module.exports.getAccountByName = getAccountByName;
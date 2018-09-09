function getAccountByKey(key, users)
{
	for (let i = 0; i < users.length; i++)
	{
		if (typeof(users[i].key) !== "undefined" && users[i].key === key)
			return i;
	}

	return -1;
}

function getAccountByEmail(email, users)
{
	for (let i = 0; i < users.length; i++)
	{
		if (users[i].userInfo.email === email)
			return i;
	}

	return -1;
}

module.exports.getAccountByKey = getAccountByKey;
module.exports.getAccountByEmail = getAccountByEmail;
//Included module(s)
const Menu = require("./menu.js");

//Return value: Returns array of menu items belonging to category on success. Returns empty array otherwise.
//Argument(s):
// - req: {category}
function getMenuGroup(req)
{
	let menu = Menu.menu;
	let menuGroup = [];
	let found = false;

	//Check if category is valid
	for(let i = 0; i < menu.categories.length; i++)
		if (req.category == menu.categories[i])
			found = true;

	if (found)
		menuGroup = menu[req.category];
	else
		console.log("getMenuGroup: Could not retreive menu group!");

	return menuGroup;
}

module.exports.getMenuGroup = getMenuGroup;
const nApps = 7;
const nSoups = 3;

var menu = {};
menu.categories = ["apps", "soup"];

menu.apps = [];
for (let i = 0; i < nApps; i++)
{
	menu.apps[i] = {};
	menu.apps[i].category = "apps";
}

menu.apps[0].name = "1. Fried Whole Chicken Wings (5)";
menu.apps[0].cost = [6.75];

menu.apps[1].name = "2. Shrimp Egg Roll (1)";
menu.apps[1].cost = [1.65];

menu.apps[2].name = "2. Pork Egg Roll (1)";
menu.apps[2].cost = [1.65];

menu.apps[3].name = "3. Spring Roll (1) (Only Veg.)";
menu.apps[3].cost = [1.75];

menu.apps[4].name = "3a. Spring Roll (1) (Shrimp \& Veg.)";
menu.apps[4].cost = [1.55];

menu.apps[5].name = "4. Bar-B-Q Spare Ribs (4)";
menu.apps[5].cost = [7.45];

menu.apps[6].name = "5. Boneless Spare Ribs";
menu.apps[6].cost = [7.95, 11.50];

menu.soup = [];
for(let i = 0; i < nSoups; i++)
{
	menu.soup[i] = {};
	menu.soup[i].categories = "soup";
}

menu.soup[0].name = "12. Wonton Soup";
menu.soup[0].cost = [2.85, 4.35];

menu.soup[1].name = "13. Egg Drop Soup";
menu.soup[1].cost = [1.90, 3.40];

menu.soup[2].name = "14. Mixed Wonton Egg Drop";
menu.soup[2].cost = [2.45, 4.10];

module.exports.menu = menu;
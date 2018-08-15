//Global list variable which holds menu items
var menu;

//Formats POST requests to the URL http://localhost:3000/get-menu
function formatGetMenuReq(category)
{
	let req = {};
	req.category = category;
	return req;
}

//Formats POST requests to the URL http://localhost:3000/update-order
function formatUpdateOrderReq(action, name, size, quantity, lookupHandle)
{
	let req = {};
	req.action = action;
	req.name = name;
	req.size = size;
	req.quantity = quantity;
	req.lookupHandle = lookupHandle;
	return req;
}

//Returns the selected size of the item identified by argument itemNum
function getSize(itemNum)
{
	let btnName = "size" + itemNum;
	let size = (menu[itemNum].cost.length == 1) ? "N/A" : $("input[name=" + btnName + "]:checked").val();
		
	return size;
}

//Takes a string representing an item name and returns the corresponding item number
function getItemNum(str)
{
	for(let i = 0; i < str.length; i++)
	{
		let char = str.charAt(i);
		if(!isNaN(char))
			return char;
	}
}

//Displays the cost of the item identified by argument itemNum
function displayCost(itemNum)
{
	let size = getSize(itemNum);
	let index = (size == "small" || size == "N/A") ? 0 : 1;
	$("#item" + itemNum).find(".item-cost").html('$' + (menu[itemNum].cost[index]).toFixed(2));
}

function updateOrder(itemNum, req)
{
	$.post("http://localhost:3000/update-order", req, function(data, status) 
	{
		if(status != "success")
			alert("An issue occurred while adding item to your order!\nIf this problem persists, please call us at (860) 871-9311.");
		else
		{
			let size = "";
			if (menu[itemNum].cost.length > 1)
				size = (req.size == "small") ? " (S)" : " (L)";

			alert("Added " + req.quantity + " x " + menu[itemNum].name + size + " to order!");
		}
	});
}

//Fills in fields of HTML file using JQuery
function displayPageContents()
{
	let itemSize;

	for(let i = 0; i < menu.length; i++)
	{
		//Retreive and display item name
		$("#item" + i).find(".item-name").html(menu[i].name);

		//Show radio button if item has multiple sizes
		if(menu[i].cost.length > 1)
		{
			let $btn = $("#item" + i).find(".right");			//Radio button to select size of item i
			$btn.show();
			$btn.find(".radio").attr("name", ("size" + i));		//Sets name of radio button based on parent div
		}

		//Retreive and display item cost
		displayCost(i);
	}
}

$(document).ready(function()
{
	let cat = $("head").attr("id");
	let req = formatGetMenuReq(cat);

	let getMenu = $.post("http://localhost:3000/get-menu", req);
	$.when(getMenu).done(function(data, status)
	{
		if(status != "success")
		{
    		alert("An issue occurred retreiving menu from server!\nIf this problem persists, please call us at (860) 871-9311.");
    		return;
		}

		menu = data;
		displayPageContents();

		$(".radio").on("change", function()
		{
			let itemName = $(this).closest(".h-100").attr("id");
			let itemNum = getItemNum(itemName);
			displayCost(itemNum);
		});


		$(".item-add").on("click", function()
		{
			let $inputField = $(this).prev().children();
			let quantity = $inputField.val();
			if(isNaN(quantity) || isNaN(parseInt(quantity)))
				alert("Must enter a valid quantity!");
			else
			{
				let itemName = $(this).closest(".h-100").attr("id");
				let itemNum = getItemNum(itemName);
				let lookupHandle = cat + itemNum;

				let req = formatUpdateOrderReq("add", menu[itemNum].name, getSize(itemNum), quantity, lookupHandle);
				updateOrder(itemNum, req);
			}

			$inputField.val("");
		});
	});
});
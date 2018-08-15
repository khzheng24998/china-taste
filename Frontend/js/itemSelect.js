function getOrderIndex(menuItem, order)
{
	for (let i = 0; i < order.length; i++)
	{
		if (menuItem.name === order[i].name)
			return i;
	}

	return -1;
}

function getItemNum(str)
{
	for(let i = 0; i < str.length; i++)
	{
		let char = str.charAt(i);
		if(!isNaN(char))
			return char;
	}
}

function getSize()
{

}

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

function displayPageContents(menu, order)
{
	let winHeight = window.innerHeight;
	winHeight = Math.floor(0.8 * winHeight);
	$("#page-body").css("min-height", winHeight);

	for(let i = 0; i < menu.length; i++)
	{
		//Retreive and display item name
		$("#item" + i).find(".name-text").html(menu[i].name);

		let costString = menu[i].cost[0];
		if (menu[i].cost.length > 1)
			costString += "+";

		$("#item" + i).find(".cost-text").html(costString);
	}
}

function displayModalBox(itemNum, menu, order)
{
	let menuItem = menu[itemNum];

	$("#modal").show();
	$("#modal-name-text").html(menuItem.name);

	if (menuItem.cost.length == 1)
	{	
		$("#size-opt1-text").html("$" + menuItem.cost[0].toFixed(2));
		$("#size-opt2").hide();
	}
	else if (menuItem.cost.length == 2)
	{
		$("#size-opt1-text").html("Sm ($" + menuItem.cost[0].toFixed(2) + ")");
		$("#size-opt2").show();
		$("#size-opt2-text").html("Lg ($" + menuItem.cost[1].toFixed(2) + ")");
	}

	let orderIndex = getOrderIndex(menuItem, order);
	if (orderIndex != -1)
		$("#modal-quantity-text").val(order[orderIndex].quantity);
	else
		$("#modal-quantity-text").val(1);
}

function addToOrder()
{
	let name = $("#modal-name-text").html();
	let quantity = $("#modal-quantity-text").val();
	let lookupHandle = "";
	let size = "N/A";

	let req = formatUpdateOrderReq("add", name, size, quantity, lookupHandle);

	$.post("http://localhost:3000/update-order", req, function(data, status) 
	{
		if(status != "success")
		{
			alert("An issue occurred while adding item to your order!\nIf this problem persists, please call us at (860) 871-9311.");
			location.reload();
		}
	});
}

$(document).ready(function()
{
	let cat = $("head").attr("id");
	let req = formatGetMenuReq(cat);

	let getMenu = $.post("http://localhost:3000/get-combined", req);
	$.when(getMenu).done(function(data, status)
	{
		if(status != "success")
		{
    		alert("An issue occurred retreiving menu from server!\nIf this problem persists, please call us at (860) 871-9311.");
    		return;
		}

		let menu = data.menu;
		let order = data.order;
		displayPageContents(menu);

		$(window).resize(function()
		{
    		displayPageContents(menu, order);
		});

		$(".item").on("click", function()
		{
			let itemName = $(this).attr("id");
			let itemNum = getItemNum(itemName);
			displayModalBox(itemNum, menu, order);
		});

		$("#add-item-btn").on("click", function()
		{
			addToOrder();
		});

		$("#cancel-btn").on("click", function()
		{
			$("#modal").hide();
		});

		$("#checkout-btn").on("click", function()
		{

		});
	});
});
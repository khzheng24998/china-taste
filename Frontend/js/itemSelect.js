function menuLookup(name, menu)
{
	let menuItem = {};

	for (let i = 0; i < menu.length; i++)
		if (name == menu[i].name)
			menuItem = menu[i];

	return menuItem;
}

function getNumFromId(str)
{
	for(let i = 0; i < str.length; i++)
	{
		let char = str.charAt(i);
		if(!isNaN(char))
			return char;
	}
}

function decodeHTML(str)
{
	let decoded = str.replace(/&amp;/g, '&');
	return decoded;
}

function formatGetMenuReq(category)
{
	let req = {};
	req.category = category;
	return req;
}

//Formats POST requests to the URL http://localhost:3000/update-order
function formatUpdateOrderReq(action, orderEntry)
{
	let req = {};
	req.action = action;
	req.orderEntry = orderEntry;
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

	displayCheckoutBox(order);
}

function displayCheckoutBox(order)
{
	let subtotal = 0;

	for (let i = 0; i < order.length; i++)
	{
		let $checkoutItem = $("#checkout-item" + i);
		$checkoutItem.show();

		if (i == order.length - 1)
			$checkoutItem.css("border-bottom-style", "none");

		let quantity = order[i].quantity;
		let size = order[i].size;
		let cost = order[i].menuEntry.cost;
		let unitCost = (size == "large") ? cost[1] : cost[0];
		let itemCost = (quantity * unitCost).toFixed(2);

		$checkoutItem.find(".checkout-name").html(order[i].menuEntry.name);
		$checkoutItem.find(".checkout-cost").html("$" + itemCost);

		if (quantity > 1)
			$checkoutItem.find(".checkout-quantity").html("(Qty: " + quantity + ")");

		subtotal = (+subtotal) + (+itemCost);
	}

	$("#subtotal-text").html("$" + subtotal.toFixed(2));
}

function displayModalBox1(menuItem)
{
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

	$('input[name=size][value="small"]').prop("checked", true);

	$("#modal-quantity-text").val("1");

	$("#add-item-btn").show();
	$("#save-item-btn").hide();
	$("#delete-btn-wrapper").hide();
}

function displayModalBox2(orderItem)
{
	$("#modal").show();
	$("#modal-name-text").html(orderItem.menuEntry.name);

	let menuItem = orderItem.menuEntry;

	if (menuItem.cost.length == 1)
	{	
		$("#size-opt1-text").html("$" + parseFloat(menuItem.cost[0]).toFixed(2));
		$("#size-opt2").hide();
	}
	else if (menuItem.cost.length == 2)
	{
		$("#size-opt1-text").html("Sm ($" + parseFloat(menuItem.cost[0]).toFixed(2) + ")");
		$("#size-opt2").show();
		$("#size-opt2-text").html("Lg ($" + parseFloat(menuItem.cost[1]).toFixed(2) + ")");
	}

	if (orderItem.size != "N/A")
		$('input[name=size][value="' + orderItem.size + '"]').prop("checked", true);
	else
		$('input[name=size][value="small"]').prop("checked", true);

	$("#modal-quantity-text").val(orderItem.quantity);

	$("#add-item-btn").hide();
	$("#save-item-btn").show();
	$("#delete-btn-wrapper").show();
}

function formatOrderEntry(menuIndex, menu)
{
	let orderEntry = {};

	//let name = decodeHTML($("#modal-name-text").html());
	let name = menu[menuIndex].name;

	let size = $('input[name=size]:checked').val();

	//let menuEntry = menuLookup(name, menu);
	let menuEntry = menu[menuIndex];

	let quantity = $("#modal-quantity-text").val();
	let special = "";

	orderEntry.menuEntry = menuEntry;
	orderEntry.quantity = quantity;
	orderEntry.special = special;

	if (menuEntry.cost.length != 2)
		orderEntry.size = "N/A";
	else
		orderEntry.size = size;

	return orderEntry;
}

function addToOrder(menuIndex, menu)
{
	let orderEntry = formatOrderEntry(menuIndex, menu);
	let req = formatUpdateOrderReq("add", orderEntry);

	$.post("http://localhost:3000/update-order", req, function(data, status) 
	{
		if(status != "success")
		{
			alert("An issue occurred while adding item to your order!\nIf this problem persists, please call us at (860) 871-9311.");
		}
	});
}

function deleteItem(order)
{

}

function updateItem(order)
{

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
		let order = data.order.items;
		displayPageContents(menu, order);

		$(window).resize(function()
		{
    		displayPageContents(menu, order);
		});

		let menuIndex, orderIndex;

		$(".item").on("click", function()
		{
			let id = $(this).attr("id");
			menuIndex = getNumFromId(id);
			let menuItem = menu[menuIndex];
			displayModalBox1(menuItem);
		});

		$("#add-item-btn").on("click", function()
		{
			addToOrder(menuIndex, menu);
		});

		$("#save-item-btn").on("click", function()
		{
			updateItem(orderIndex, order);
		});

		$("delete-btn").on("click", function()
		{
			deleteItem(orderIndex, order);
		})

		$("#cancel-btn").on("click", function()
		{
			$("#modal").hide();
		});

		$(".checkout-name").on("click", function()
		{
			let id = $(this).closest(".checkout-item").attr("id");
			orderIndex = getNumFromId(id);
			let orderItem = order[orderIndex];
			displayModalBox2(orderItem);
		});

		$(".checkout-name").hover(function()
		{
			$(this).css("text-decoration", "underline");
		},
		function()
		{
			$(this).css("text-decoration", "none");
		});

		$("#checkout-btn").on("click", function()
		{

		});
	});
});
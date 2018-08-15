let orderType = "takeout";

//Fills in fields of HTML file using JQuery
function displayPageContents(order)
{
	let winHeight = window.innerHeight;
	winHeight = Math.floor(0.8 * winHeight);
	$("#page-body").css("min-height", winHeight);

	if(order.length == 0)
	{
    	$("#subtotal").hide();
    	return;
	}
    else
    	$("#empty").hide();

    for(let i = 0; i < order.length; i++)
    {
    	let $item = $("#item" + i);
    	$item.show();
    	$item.find(".name-text").html(order[i].name);
    	$item.find(".quantity-text").val(order[i].quantity);
    	if(order[i].size == "N/A")
    	{
    		$item.find(".size-text").hide();
    	}
    	else
    	{
    		$item.find(".size-null").hide();
    		$item.find(".size-text").val(order[i].size);
    	}
    	displayCost(i, order);
    }

    displaySubTotal(order);
}

function calculateDeliveryCharge(subTotalWithTax, order)
{
	let charge = 1.00;
	let decimal = subTotalWithTax - Math.floor(subTotalWithTax);

	if (decimal > 0.00 && decimal < 0.50)
		charge += (0.50 - decimal);
	else if (decimal > 0.50)
		charge += (1.00 - decimal);
	
	if (order.length == 0)
		charge = 0;

	return charge.toFixed(2);
}

function displayCheckoutBox(orderType, order)
{
	$("#takeout-btn").css("background-color", "#dddddd");
	$("#delivery-btn").css("background-color", "#dddddd");
	$("#dine-in-btn").css("background-color", "#dddddd");

	let $activeBtn = $("#" + orderType + "-btn");
	$activeBtn.css("background-color", "#999999");

	let subtotal = calculateSubTotal(order);
	$("#subtotal-text-2").html("$" + subtotal);

	const taxRate = 0.0635;
	let tax = (subtotal * taxRate).toFixed(2);
	$("#tax-text").html("$" + tax);
	let dc = 0;

	if(orderType == "delivery")
	{
		dc = calculateDeliveryCharge(((+subtotal) + (+tax)), order);
		$("#del-charge-text").html("$" + dc);
	}

	else
		$("#del-charge-text").html("---");

	let total = (+subtotal) + (+tax) + (+dc);

	$("#total-text").html("$" + total.toFixed(2));
}

function calculateCost(itemNum, order)
{
	let quantity = order[itemNum].quantity;
	let size = order[itemNum].size;
	let cost = order[itemNum].cost;
	let unitCost = (size == "large") ? cost[1] : cost[0];
	return (quantity * unitCost).toFixed(2);
}

function displayCost(itemNum, order)
{
	let $item = $("#item" + itemNum);
	let cost = calculateCost(itemNum, order);
	$item.find(".cost-text").html("$" + cost);
}

function calculateSubTotal(order)
{
	let subtotal = 0;
	for (let i = 0; i < order.length; i++)
		subtotal = (+subtotal) + (+calculateCost(i, order));

	return subtotal.toFixed(2);
}

function displaySubTotal(order)
{
	$("#subtotal-text").html("$" + calculateSubTotal(order));
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

function deleteItem(itemNum, order)
{
	let req = formatUpdateOrderReq("remove", order[itemNum].name, order[itemNum].size, 0, "null")
	$.post("http://localhost:3000/update-order", req, function(data, status) 
	{
		location.reload();
	});
}

function changeQuantity(itemNum, order, quantity)
{
	let req = formatUpdateOrderReq("change-quantity", order[itemNum].name, order[itemNum].size, quantity, "null");
	$.post("http://localhost:3000/update-order", req, function(data, status) 
	{
		return;
	});	
	order[itemNum].quantity = quantity;
	displayCost(itemNum, order);
	displaySubTotal(order);
	displayCheckoutBox(orderType, order);
}

function changeSize(itemNum, order)
{
	let req = formatUpdateOrderReq("change-size", order[itemNum].name, order[itemNum].size, 0, "null");
	$.post("http://localhost:3000/update-order", req, function(data, status) 
	{
		return;
	});	

	let newSize = (order[itemNum].size == "small") ? "large" : "small";
	let match = false;
	for (let i = 0; i < order.length; i++)
		if (order[i].name == order[itemNum].name && order[i].size == newSize)
		{
			match = true;
			location.reload();
		}

	if (!match)
	{
		order[itemNum].size = newSize;
		displayCost(itemNum, order);
		displaySubTotal(order);
		displayCheckoutBox(orderType, order);
	}
}

function sendOrderType(type)
{
	let req = formatUpdateOrderInfoReq(type);
	$.post("http://localhost:3000/update-order-info", req, function(data, status) 
	{
		return;
	});	
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

function formatUpdateOrderInfoReq(type)
{
	let req = {};
	req.type = type;
	return req;
}

$(document).ready(function()
{
	let getOrder = $.get("http://localhost:3000/my-order");
	$.when(getOrder).done(function(data, status)
	{
		if(status != "success")
		{
    		alert("An issue occurred retreiving your order!\nIf this problem persists, please call us at (860) 871-9311.");
    		return;
		}

		if (typeof(data.info.type) === "undefined")
			orderType = "takeout";
		else
			orderType = data.info.type;

		let order = data.items;
		displayPageContents(order);
		displayCheckoutBox(orderType, order);

		$(window).resize(function()
		{
    		displayPageContents(order);
		});

		$(".del-button").on("click", function()
		{
			let itemName = $(this).closest(".item").attr("id");
			let itemNum = getItemNum(itemName);
			deleteItem(itemNum, order);
		});

		$(".q-sel-down").on("click", function()
		{
			let $item = $(this).closest(".item");

			let stringQuantity = $item.find(".quantity-text").val();
			let newQuantity = parseInt(stringQuantity) - 1;
			$item.find(".quantity-text").val(newQuantity);
			let itemName = $item.attr("id");
			let itemNum = getItemNum(itemName);
			newQuantity = $item.find(".quantity-text").val();
			changeQuantity(itemNum, order, newQuantity);
		});

		$(".q-sel-up").on("click", function()
		{
			let $item = $(this).closest(".item");

			let stringQuantity = $item.find(".quantity-text").val();
			let newQuantity = parseInt(stringQuantity) + 1;
			$item.find(".quantity-text").val(newQuantity);
			let itemName = $item.attr("id");
			let itemNum = getItemNum(itemName);
			newQuantity = $item.find(".quantity-text").val();
			changeQuantity(itemNum, order, newQuantity);
		});

		$(".quantity-text").on("change", function()
		{
			let itemName = $(this).closest(".item").attr("id");
			let itemNum = getItemNum(itemName);
			changeQuantity(itemNum, order, $(this).val());
		});

		$(".size-text").on("change", function()
		{
			let itemName = $(this).closest(".item").attr("id");
			let itemNum = getItemNum(itemName);
			changeSize(itemNum, order);
		});

		$("#takeout-btn").hover(function()
		{
			if (orderType != "takeout")
				$(this).css("background-color", "#cccccc");
		},
		function()
		{
			if (orderType != "takeout")
				$(this).css("background-color", "#dddddd");
		});

		$("#delivery-btn").hover(function()
		{
			if (orderType != "delivery")
				$(this).css("background-color", "#cccccc");
		},
		function()
		{
			if (orderType != "delivery")
				$(this).css("background-color", "#dddddd");
		});

		$("#dine-in-btn").hover(function()
		{
			if (orderType != "dine-in")
				$(this).css("background-color", "#cccccc");
		},
		function()
		{
			if (orderType != "dine-in")
				$(this).css("background-color", "#dddddd");
		});

		$("#takeout-btn").on("click", function()
		{
			orderType = "takeout";
			displayCheckoutBox(orderType, order);
			sendOrderType(orderType);
		});

		$("#delivery-btn").on("click", function()
		{
			orderType = "delivery";
			displayCheckoutBox(orderType, order);
			sendOrderType(orderType);
		});

		$("#dine-in-btn").on("click", function()
		{
			orderType = "dine-in"
			displayCheckoutBox(orderType, order);
			sendOrderType(orderType);
		});

		$("#checkout-btn").on("click", function()
		{
			
		});

	});

});
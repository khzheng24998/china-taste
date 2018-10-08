function getNumFromId(str)
{
	let myString = str.replace("checkout-item", "");
	myString = myString.replace("item", "");
	return parseInt(myString, 10);
}

function displayPageContents(menu, order)
{
	for(let i = 0; i < menu.length; i++)
	{
		//Retreive and display item name
		$("#item" + i).show();
		$("#item" + i).find(".name-text").html(menu[i].name);

		let costString = menu[i].cost[0].toFixed(2);
		if (menu[i].cost.length > 1)
			costString += "+";

		$("#item" + i).find(".cost-text").html(costString);
	}

	displayCategories();
	displayCheckoutBox(order);
}

function displayCategories()
{
	let cat = $("head").attr("id");
	$("#cat-" + cat).css("background-color", "#dddddd");
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
		let itemCost = (quantity * unitCost);

		$checkoutItem.find(".checkout-name").html(order[i].menuEntry.name);
		$checkoutItem.find(".checkout-cost").html("$" + itemCost.toFixed(2));

		if (quantity > 1)
			$checkoutItem.find(".checkout-quantity").html("(Qty: " + quantity + ")");

		subtotal = (+subtotal) + (+itemCost);
	}

	$("#subtotal-text").html("$" + subtotal.toFixed(2));

	if(order.length === 0)
		$("#empty").show();
	else
		$("#empty").hide();
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

	if (typeof(menuItem.special) !== "undefined")
	{
		let special = menuItem.special;

		$("#spicy-select").hide();
		$("#gluten-free-select").hide();

		for (let i = 0; i < special.length; i++)
		{
			if (special[i] === "spicy")
				$("#spicy-select").show();

			if (special[i] === "gluten-free")
				$("#gluten-free-select").show();
		}
	}
	else
	{
		$("#spicy-select").hide();
		$("#gluten-free-select").hide();
	}

	$('input[name=size][value="small"]').prop("checked", true);
	$("#modal-quantity-text").val("1");
	$("textarea").val("");

	let textLen = $("textarea").val().length;
	if (textLen > 128)
		$("#char-count").css("color", "red");
	else
		$("#char-count").css("color", "black");

	$("#char-count").html("Character count: " + textLen);

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

	$("textarea").val(orderItem.special);

	let textLen = $("textarea").val().length;
	if (textLen > 128)
		$("#char-count").css("color", "red");
	else
		$("#char-count").css("color", "black");

	$("#char-count").html("Character count: " + textLen);

	$("#add-item-btn").hide();
	$("#save-item-btn").show();
	$("#delete-btn-wrapper").show();
}

function addToOrder(menuEntry)
{
	let req = {
		action: "add-item",
		name: menuEntry.name,
		category: $("head").attr("id"),
		quantity: $("#modal-quantity-text").val(),
		size: (menuEntry.cost.length == 1) ? "N/A" : $('input[name=size]:checked').val()
	};

	sendUpdateOrderReq(req);
}

function updateItem(orderEntry)
{
	let req = {
		action: "update-item",
		id: orderEntry.id,
		quantity: $("#modal-quantity-text").val(),
		size: (orderEntry.menuEntry.cost.length == 1) ? "N/A" : $('input[name=size]:checked').val()
	};

	sendUpdateOrderReq(req);
}

function deleteItem(orderEntry)
{
	let req = {
		action: "remove-item",
		id: orderEntry.id
	};

	sendUpdateOrderReq(req);
}

function sendUpdateOrderReq(req)
{
	$.post("/update-order", req, function(data, status) 
	{
		if(status != "success")
			alert("An issue occurred while updating your order!\nIf this problem persists, please call us at (860) 871-9311.");
		else
		{
			if (data.msg === "signed-out")
				window.location.href = "/login";

			else if (data.msg === "ok")
				location.reload();
		}
	});
}

$(document).ready(function()
{
	let cat = $("head").attr("id");
	let req = {};
	req.category = cat;

	initialize();

	let getMenu = $.post("/get-menu-and-items", req, function(data, status)
	{
		if(status != "success")
		{
    		alert("An issue occurred retreiving menu from server!\nIf this problem persists, please call us at (860) 871-9311.");
    		return;
		}

		let menu = data.menu;
		let order = data.orderItems;				//Note: order contains only the order items!
		displayPageContents(menu, order);

		let menuIndex, orderIndex;

		$(".item").on("click", function()
		{
			let id = $(this).attr("id");
			menuIndex = getNumFromId(id);
			let menuItem = menu[menuIndex];
			displayModalBox1(menuItem);
		});

		$(".item").hover(function()
		{
			$(this).css("background-color", "#f1f1f1");
		},
		function()
		{
			$(this).css("background-color", "white");
		});

		$(".category").on("click", function()
		{
			let id = $(this).attr("id");
			let substr = id.substring(4, 8);
			if (substr === "apps")
				window.location.href = "/";
			else
				window.location.href = "/" + substr;
		});

		$(".category").hover(function()
		{
			let id = $(this).attr("id");
			let substr = id.substring(4, 8);
			if (substr !== cat)
				$(this).css("background-color", "#f1f1f1");
		},
		function()
		{
			let id = $(this).attr("id");
			let substr = id.substring(4, 8);
			if (substr !== cat)
				$(this).css("background-color", "white");
		});

		$("#q-sel-down").on("click", function()
		{
			let currVal = $("#modal-quantity-text").val();
			if (currVal > 1)
				$("#modal-quantity-text").val((+currVal) - 1);
		});

		$("#q-sel-up").on("click", function()
		{
			let currVal = $("#modal-quantity-text").val();
			$("#modal-quantity-text").val((+currVal) + 1);
		});

		$("#add-item-btn").on("click", function()
		{
			let menuItem = menu[menuIndex];
			addToOrder(menuItem);
		});

		$("#save-item-btn").on("click", function()
		{
			let orderItem = order[orderIndex];
			updateItem(orderItem);
		});

		$("#delete-btn").on("click", function()
		{
			let orderItem = order[orderIndex];
			deleteItem(orderItem);
		})

		$("#cancel-btn").on("click", function()
		{
			$("#modal").hide();
		});

		$("textarea").keyup(function()
		{
			let textLen = $(this).val().length;
			if (textLen > 128)
				$("#char-count").css("color", "red");
			else
				$("#char-count").css("color", "black");

			$("#char-count").html("Character count: " + textLen);		
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
			if (order.length === 0)
				alert("Add items to order before checking out!");
			else
				window.location.href = "/checkout";
		});
	});
});
function displayTabs(orderType)
{
	$("#takeout-btn").css("background-color", "#dddddd");
	$("#delivery-btn").css("background-color", "#dddddd");
	$("#dine-in-btn").css("background-color", "#dddddd");

	let $activeBtn = $("#" + orderType + "-btn");
	$activeBtn.css("background-color", "#999999");
}

function displayTextFields(orderType)
{
	if (orderType == "delivery")
	{
		$("#opt-cash").show();
		$("#opt-card").show();
		$("#opt-in-store").hide();
		$("#in-store").prop("checked", false);
		$("#address-info").show();
	}
	else
	{
		$("#opt-cash").hide();
		$("#opt-card").hide();
		$("#opt-in-store").show();
		$("#in-store").prop("checked", true);
		$("#address-info").hide();
	}

	if (orderType == "dine-in")
		$("#customer-count-div").show();
	else
		$("#customer-count-div").hide();

	if ($("#request-time").val() === "other")
		$("#time-prompt").show();
	else
		$("#time-prompt").hide();
}

function displayBox(orderType, order)
{
	let subtotal = 0;

	for (let i = 0; i < order.length; i++)
	{
		let $item = $("#item" + i);
		$item.show();

		if (i == order.length - 1)
			$item.css("border-bottom-style", "none");

		let quantity = order[i].quantity;
		let size = order[i].size;
		let cost = order[i].menuEntry.cost;
		let unitCost = (size == "large") ? cost[1] : cost[0];
		let itemCost = (quantity * unitCost);

		$item.find(".name-text").html(order[i].menuEntry.name);
		$item.find(".cost-text").html("$" + itemCost.toFixed(2));

		if (quantity > 1)
			$item.find(".quantity-text").html("(Qty: " + quantity + ")");

		if (size === "small")
			$item.find(".size-text").html("Size: S");
		else if (size === "large")
			$item.find(".size-text").html("Size: L");	

		subtotal = (+subtotal) + (+itemCost);
	}

	$("#subtotal-text").html("$" + subtotal.toFixed(2));

	const taxRate = 0.0635;
	let tax = (subtotal * taxRate);
	$("#tax-text").html("$" + tax.toFixed(2));
	let dc = 0;

	if(orderType == "delivery")
	{
		dc = calculateDeliveryCharge(((+subtotal) + (+tax)), order);
		$("#del-charge-text").html("$" + dc.toFixed(2));
	}

	else
		$("#del-charge-text").html("---");

	let total = (+subtotal) + (+tax) + (+dc);

	$("#total-text").html("$" + total.toFixed(2));
}

function displayPageContents(orderType, order)
{
	let winHeight = window.innerHeight;
	winHeight = Math.floor(0.8 * winHeight);
	$("#page-body").css("min-height", winHeight);

	displayTabs(orderType);
	displayTextFields(orderType);
	setDropDownOptions();
	displayBox(orderType, order);
}

function displayModal()
{
	$("#modal").show();
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

	return charge;
}

function intToStringDay(intDay)
{
	switch(intDay)
	{
		case 0:
			return "Sun";
		case 1:
			return "Mon";
		case 2:
			return "Tue";
		case 3:
			return "Wed";
		case 4:
			return "Thu";
		case 5:
			return "Fri";
		case 6:
			return "Sat";
		default:
			return "ERR";
	}
}

function setDropDownOptions()
{
	let date = new Date();
	let str = "";

	for (let i = 0; i < 5; i++)
	{
		let month = date.getMonth() + (+1);
		let today = date.getDate();

		if (i === 0)
		{
			str = "Today " + month + "/" + today;
		}
		else
		{
			let intDay = date.getDay();
			let strDay = intToStringDay(intDay);
			str = strDay + " " + month + "/" + today;
		}

		$("#request-date").append('<option value="' + month + "/" + today + '">' + str + '</option>');
		date.setDate(date.getDate()+1);
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

function formatAddressInfo(orderType)
{
	let req = {};
	if (orderType !== "delivery")
		return req;
	
	let address = $("#address").val();
	let city = $("#city").val();
	let state = $("#state").val();
	let zipCode = $("#zip-code").val();
	let companyName = $("#company-name").val();
	let crossStreet = $("#cross-street").val();
	let apt = $("#apt").val();

	req.address = address;
	req.city = city;
	req.state = state;
	req.zipCode = zipCode;
	req.companyName = companyName;
	req.crossStreet = crossStreet;
	req.apt = apt;
}

function formatUpdateOrderInfoReq(orderType)
{
	let req = {};
	req.ordertype = orderType;
	req.addressInfo = formatAddressInfo(orderType);
	return req;
}

function validatePhoneNumber(phoneNumber)
{
	//Immediately return false if input is too long
	if (phoneNumber.length > 25)
		return false;

	//Phone number contains letters
	let letters = phoneNumber.match(/[A-Za-z]/g);
	if (letters != null)
		return false;

	//Remove common optional characters found in phone numbers
	let numbers = phoneNumber.replace(/[-() +]/g, "");
	console.log(numbers);

	//Phone number has no digits
	let arr = phoneNumber.match(/[0-9]/g);
	if (arr == null)
		return false;

	//Phone number contains special characters
	let noSpecialChars = arr.toString();
	noSpecialChars = noSpecialChars.replace(/,/g, "");
	console.log(noSpecialChars);

	if (numbers != noSpecialChars)
		return false;

	//Phone number is too long/short
	if (numbers.length != 10 && numbers.length != 11)	//with country call code
		return false;

	return true;
}

function displayErrorMessage(bool, selector)
{
	if (bool)
		$(selector).show();
	else
		$(selector).hide();
}

function validateCustomerInfo(orderType)
{
	let firstName = $("#first-name").val();
	let lastName = $("#last-name").val();
	let phoneNumber = $("#phone-number").val();
	let customerCount = $("#customer-count").val();

	let firstNameErr = (firstName.length == 0) ? true : false;
	let lastNameErr = (lastName.length == 0) ? true : false;
	let phoneNumberErr = (phoneNumber.length == 0) ? true : false;
	let customerCountErr = (customerCount.length == 0) ? true : false;

	if (orderType !== "dine-in")
		customerCountErr = false;

	displayErrorMessage(firstNameErr, "#first-name-err");
	displayErrorMessage(lastNameErr, "#last-name-err");
	displayErrorMessage(phoneNumberErr, "#phone-number-err");
	displayErrorMessage(customerCountErr, "#customer-count-err");

	return !(firstNameErr || lastNameErr || phoneNumberErr || customerCountErr);
}

function validateDeliveryInfo(orderType)
{
	if (orderType !== "delivery")
		return true;

	let address = $("#address").val();
	let city = $("#city").val();
	let state = $("#state").val();
	let zipCode = $("#zip-code").val();

	let addressErr = (address.length == 0) ? true : false;
	let cityErr = (city.length == 0) ? true : false;
	let stateErr = (state.length == 0) ? true : false;
	let zipCodeErr = (zipCode.length == 0) ? true : false;

	displayErrorMessage(addressErr, "#address-err");
	displayErrorMessage(cityErr, "#city-err");
	displayErrorMessage(stateErr, "#state-err");
	displayErrorMessage(zipCodeErr, "#zip-code-err");

	return !(addressErr || cityErr || stateErr || zipCodeErr);
}

function validateOrderInfo(orderType)
{
	let validCustomerInfo = validateCustomerInfo(orderType);
	let validDeliveryInfo = validateDeliveryInfo(orderType);
}

function updateOrderInfo(orderType)
{
	if (validateOrderInfo(orderType))
	{

	}
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

		let orderType;
		if (typeof(data.info.type) === "undefined")
			orderType = "takeout";
		else
			orderType = data.info.type;

		let order = data.items;
		displayPageContents(orderType, order);

		$(window).resize(function()
		{
    		displayPageContents(orderType, order);
		});

		$(".order-type-sel").hover(function()
		{
			if (orderType !== $(this).html().toLowerCase())
				$(this).css("background-color", "#cccccc");
		},
		function()
		{
			if (orderType !== $(this).html().toLowerCase())
				$(this).css("background-color", "#dddddd");
		});

		$(".order-type-sel").on("click", function()
		{
			orderType = $(this).html().toLowerCase();
			console.log(orderType);
			displayTabs(orderType);
			displayTextFields(orderType);
			displayBox(orderType, order);
			sendOrderType(orderType);
		});

		$(".name-text").on("click", function()
		{
			displayModal();
		});

		$(".name-text").hover(function()
		{
			$(this).css("text-decoration", "underline");
		},
		function()
		{
			$(this).css("text-decoration", "none");
		});

		$(".required").on("change", function()
		{
			$(this).next(".err-msg").hide();
		});

		$("#request-time").on("change", function()
		{
			displayTextFields(orderType);
		});

		$("#order-btn").on("click", function()
		{
			updateOrderInfo(orderType);
		});

		$("#cancel-btn").on("click", function()
		{
			$("#modal").hide();
		});
	});
});
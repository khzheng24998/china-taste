/* Assorted helper functions */

function getNumFromId(str)
{
	for(let i = 0; i < str.length; i++)
	{
		let char = str.charAt(i);
		if(!isNaN(char))
			return char;
	}
}

function calculateDeliveryCharge(subTotalWithTax)
{
	let charge = 1.00;
	let decimal = subTotalWithTax - Math.floor(subTotalWithTax);

	if (decimal > 0.00 && decimal < 0.50)
		charge += (0.50 - decimal);
	else if (decimal > 0.50)
		charge += (1.00 - decimal);

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

/* Display page contents */

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
}

function displayBox(orderType, order)
{
	let subtotal = 0;

	for (let i = 0; i < order.length; i++)
	{
		let $item = $("#checkout-item" + i);
		$item.show();

		if (i == order.length - 1)
			$item.css("border-bottom-style", "none");

		let quantity = order[i].quantity;
		let size = order[i].size;
		let cost = order[i].menuEntry.cost;
		let unitCost = (size == "large") ? cost[1] : cost[0];
		let itemCost = (quantity * unitCost);

		$item.find(".checkout-name").html(order[i].menuEntry.name);
		$item.find(".checkout-cost").html("$" + itemCost.toFixed(2));

		if (quantity > 1)
			$item.find(".checkout-quantity").html("(Qty: " + quantity + ")");

		if (size === "small")
			$item.find(".checkout-size").html("Size: S");
		else if (size === "large")
			$item.find(".checkout-size").html("Size: L");	

		subtotal = (+subtotal) + (+itemCost);
	}

	$("#subtotal-text").html("$" + subtotal.toFixed(2));

	displayTotalCost(orderType, subtotal);

	if (order.length == 0)
	{
		$("#del-charge-text").html("$0.00");
		$("#divider").hide()
	}
	else
		$("#divider").show();
}

function displayTotalCost(orderType, subtotal)
{
	const taxRate = 0.0635;
	let tax = (subtotal * taxRate);
	$("#tax-text").html("$" + tax.toFixed(2));
	let dc = 0;

	if(orderType == "delivery")
	{
		dc = calculateDeliveryCharge(((+subtotal) + (+tax)));
		$("#del-charge-text").html("$" + dc.toFixed(2));
	}

	else
		$("#del-charge-text").html("---");

	let total = (+subtotal) + (+tax) + (+dc);

	$("#total-text").html("$" + total.toFixed(2));
}

function resizePage()
{
	let winHeight = window.innerHeight;
	winHeight = Math.floor(0.8 * winHeight);
	$("#page-body").css("min-height", winHeight);
}

function displayPageContents(orderType, order)
{
	resizePage();

	displayTabs(orderType);
	displayTextFields(orderType);
	setDateDropDownOptions();
	setTimeDropDownOptions(orderType);
	displayBox(orderType, order);
}

function displayModalBox(orderItem)
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

	$("#modal-textarea").val(orderItem.special);

	let textLen = $("#modal-textarea").val().length;
	if (textLen > 128)
		$("#modal-char-count").css("color", "red");
	else
		$("#modal-char-count").css("color", "black");

	$("#modal-char-count").html("Character count: " + textLen);

	$("#add-item-btn").hide();
	$("#save-item-btn").show();
	$("#delete-btn-wrapper").show();
}

function displayErrorMessage(bool, selector, msg)
{
	if (bool)
	{
		$(selector).show();
		$(selector).html(msg);
	}
	else
		$(selector).hide();
}

function setDateDropDownOptions()
{
	$(".sel-req-date").remove();

	let date = new Date();
	let str = "";

	for (let i = 0; i < 5; i++)
	{
		let month = date.getMonth() + (+1);
		let day = date.getDate();
		let intDow = date.getDay();
		let strDow = intToStringDay(intDow);

		if (i == 0)
			str = "Today " + month + "/" + day;
		else
			str = strDow + " " + month + "/" + day;

		$("#request-date").append('<option class="sel-req-date" value="' + strDow + "-" + month + "-" + day + '">' + str + '</option>');
		date.setDate(date.getDate()+1);
	}
}

function setTimeDropDownOptions(orderType)
{
	$(".sel-req-time").show();

	let date = new Date();
	let currDay = intToStringDay(date.getDay());
	let currHour = date.getHours();
	let currMin = date.getMinutes();

	let minutesSinceMidnight = currHour * 60 + currMin;
	let waitTime = (orderType === "delivery") ? 30 : 10;
	let eta = (+minutesSinceMidnight) + (+waitTime);

	let day = $("#request-date").val();
	day = day.substring(0, 3);

	let openTime = 660;			//11:00 AM
	let closeTime = 1320;		//10:00 PM

	if (day === "Sun")
		openTime = 690;			//11:30 AM

	if (day === "Fri" || day === "Sat")
		closeTime = 1380;					//11:00 PM

	for (let i = 660; i < openTime; i += 10)
		$("#" + i).hide();

	for (let i = 1380; i > closeTime; i -= 10)
		$("#" + i).hide();

	//Order is being placed before business hours OR on for a day which is not the current day
	if (eta < (openTime + waitTime) || day !== currDay)
		eta = openTime + waitTime;

	//Ordering is closed
	if (eta > closeTime)
	{
		$("#closed-msg").show();
		$("#closed-msg").html("No longer accepting " + orderType + " orders for today! Please choose another request date.");

		$(".sel-req-time").hide();
		$("#closed").show();
		$("#request-time").val("closed");
		return;
	}
	else
	{
		$("#closed-msg").hide();
		$("#closed").hide();
	}

	let i = openTime;
	while (i < eta && i < closeTime)
	{
		let $id = $("#" + i);
		$id.hide();
		i = (+i) + 10;
	}

	if (day !== currDay)
	{
		$("#asap").hide();
		let setVal = $("#" + eta).attr("value");
		$("#request-time").val(setVal);
	}
	else
	{
		$("#request-time").val("asap");
	}
}

/* Edit order items */

function deleteItem(orderEntry)
{
	let req = formatUpdateOrderReq("remove-item", orderEntry);

	$.post("http://localhost:3000/update-order", req, function(data, status) 
	{
		if(status != "success")
			alert("An issue occurred while adding item to your order!\nIf this problem persists, please call us at (860) 871-9311.");
		else
			location.reload();
	});
}

function updateItem(orderEntry)
{
	let newEntry = formatOrderEntry(orderEntry.menuEntry);
	let req = formatUpdateOrderReq("update-item", orderEntry, newEntry);

	$.post("http://localhost:3000/update-order", req, function(data, status) 
	{
		if(status != "success")
			alert("An issue occurred while adding item to your order!\nIf this problem persists, please call us at (860) 871-9311.");
		else
			location.reload();
	});
}

/* Format data */

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

	return req;
}

function formatCustomerInfo()
{
	let req = {};

	let email = $("#email").val();
	let firstName = $("#first-name").val();
	let lastName = $("#last-name").val();
	let phoneNumber = $("#phone-number").val();
	let customerCount = $("#customer-count").val();

	req.email = email;
	req.firstName = firstName;
	req.lastName = lastName;
	req.phoneNumber = phoneNumber;
	req.customerCount = customerCount;

	return req;
}

function formatOrderDetails()
{
	let req = {};

	let requestDate = $("#request-date").val();
	let requestTime = $("#request-time").val();
	let paymentMethod = $('input[name=payment-method]:checked').val();

	req.requestDate = requestDate;
	req.requestTime = requestTime;
	req.paymentMethod = paymentMethod;

	return req;
}

function formatOrderEntry(menuEntry)
{
	let orderEntry = {};

	//let name = decodeHTML($("#modal-name-text").html());
	let name = menuEntry.name;
	let size = $('input[name=size]:checked').val();
	let quantity = $("#modal-quantity-text").val();
	let special = $("#modal-textarea").val();
	if (special.length > 128)
		special = special.substring(0, 128);

	orderEntry.menuEntry = menuEntry;
	orderEntry.quantity = quantity;
	orderEntry.special = special;

	if (menuEntry.cost.length != 2)
		orderEntry.size = "N/A";
	else
		orderEntry.size = size;

	return orderEntry;
}

//Formats POST requests to the URL http://localhost:3000/update-order
function formatUpdateOrderReq(action, orderEntry, newEntry)
{
	let req = {};
	req.action = action;
	req.orderEntry = orderEntry;
	req.newEntry = newEntry;
	return req;
}

function formatSubmitOrderReq(orderType)
{
	let req = {};
	req.orderType = orderType;
	req.addressInfo = formatAddressInfo(orderType);
	req.customerInfo = formatCustomerInfo();
	req.orderDetails = formatOrderDetails();
	return req;
}

/* Validate order info fields */

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

function validateCity(city)
{
	let lowerCaseCity = city.toLowerCase();

	let validCities = ["vernon", "rockville", "vernon rockville", "vernon/rockville", "vernon-rockville", "tolland", "ellington", "coventry", "bolton", "south windsor"];
	for (let i = 0; i < validCities.length; i++)
	{
		if (lowerCaseCity === validCities[i])
			return true;
	}

	return false;
}

function validateState(state)
{
	let lowerCaseState = state.toLowerCase();
	if (lowerCaseState !== "connecticut" && lowerCaseState !== "ct")
		return false;

	return true;
}

function validateZipCode(zipCode)
{
	if (zipCode.substring(0, 3) !== "060")
		return false;

	return true;
}

function validateCustomerInfo(orderType)
{
	const generalErrorMsg = "Required field.";
	let phoneNumberErrMsg = generalErrorMsg;

	let email = $("#email").val();
	let firstName = $("#first-name").val();
	let lastName = $("#last-name").val();
	let phoneNumber = $("#phone-number").val();
	let customerCount = $("#customer-count").val();

	let emailErr = (email.length == 0) ? true : false;
	let firstNameErr = (firstName.length == 0) ? true : false;
	let lastNameErr = (lastName.length == 0) ? true : false;
	let phoneNumberErr = (phoneNumber.length == 0) ? true : false;

	//Validate phone number if non-empty
	if (!phoneNumberErr && !validatePhoneNumber(phoneNumber))
	{
		phoneNumberErrMsg = "Invalid phone number.";
		phoneNumberErr = true;
		alert("Our system detected that an invalid phone number was entered. Please enter a valid phone number in the format XXX-XXX-XXXX. If you believe this to be an error, please give us a call at 860-871-9311.");
	}

	let customerCountErr = (customerCount.length == 0) ? true : false;

	if (orderType !== "dine-in")
		customerCountErr = false;

	displayErrorMessage(emailErr, "#email-err", generalErrorMsg);
	displayErrorMessage(firstNameErr, "#first-name-err", generalErrorMsg);
	displayErrorMessage(lastNameErr, "#last-name-err", generalErrorMsg);
	displayErrorMessage(phoneNumberErr, "#phone-number-err", phoneNumberErrMsg);
	displayErrorMessage(customerCountErr, "#customer-count-err", generalErrorMsg);

	return !(emailErr || firstNameErr || lastNameErr || phoneNumberErr || customerCountErr);
}

function validateDeliveryInfo(orderType)
{
	const generalErrorMsg = "Required field.";
	let cityErrMsg = generalErrorMsg;
	let stateErrMsg = generalErrorMsg;
	let zipCodeErrMsg = generalErrorMsg;

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

	let triggerAlert1 = false;
	let triggerAlert2 = false;

	if (!cityErr && !validateCity(city))
	{
		cityErrMsg = "Invalid city.";
		cityErr = true;
		triggerAlert1 = true;
	}

	if (!stateErr && !validateState(state))
	{
		stateErrMsg = "Invalid state.";
		stateErr = true;
		triggerAlert2 = true;
	}

	if (!zipCodeErr && !validateZipCode(zipCode))
	{
		zipCodeErrMsg = "Invalid zip code.";
		zipCodeErr = true;
		triggerAlert2 = true;
	}

	if (triggerAlert2)
	{
		alert("Our system detected that an invalid delivery address was entered. We only deliver to locations within Connecticut. Are you sure that you're on the right website?");
	}
	else if (triggerAlert1)
	{
		alert("Our system detected that an invalid delivery address was entered. Towns which we deliver to include: Vernon/Rockville, Tolland, Ellington, and with some exceptions, Coventry, Bolton, and South Windsor.");
	}

	displayErrorMessage(addressErr, "#address-err", generalErrorMsg);
	displayErrorMessage(cityErr, "#city-err", cityErrMsg);
	displayErrorMessage(stateErr, "#state-err", stateErrMsg);
	displayErrorMessage(zipCodeErr, "#zip-code-err", zipCodeErrMsg);

	return !(addressErr || cityErr || stateErr || zipCodeErr);
}

function validateOrderDetails()
{
	let paymentMethod = $('input[name=payment-method]:checked').val();
	if (typeof(paymentMethod) === "undefined")
	{
		$("#payment-method-err").show();
		return false;
	}

	$("#payment-method-err").hide();
	return true;
}

function validateOrderInfo(orderType)
{
	let validCustomerInfo = validateCustomerInfo(orderType);
	let validDeliveryInfo = validateDeliveryInfo(orderType);
	let validOrderDetails = validateOrderDetails();

	return (validCustomerInfo && validDeliveryInfo && validOrderDetails);
}

function submitOrder(orderType)
{
	if (validateOrderInfo(orderType))
	{
		console.log("Order info updated!");
		let req = formatSubmitOrderReq(orderType);
		$.post("http://localhost:3000/submit-order", req, function(data, status) 
		{
			if(status != "success")
	    		alert("An issue occurred retreiving your order!\nIf this problem persists, please call us at (860) 871-9311.");
			else
				window.location.href = "/confirmation";
		});
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

		let orderType = "takeout";

		/*if (typeof(data.info.type) === "undefined")
			orderType = "takeout";
		else
			orderType = data.info.type;*/

		let order = data.items;
		displayPageContents(orderType, order);

		$(window).resize(function()
		{
    		resizePage();
		});

		if (order.length == 0)
		{
			alert("You have no items in your order! Returning to menu!");
			window.location.href = "/";
		}

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

			displayTabs(orderType);
			displayTextFields(orderType);
			setTimeDropDownOptions(orderType);

			let subtotal = $("#subtotal-text").html();
			subtotal = subtotal.replace("$", "");
			displayTotalCost(orderType, subtotal);
		});

		$("#request-date").on("change", function()
		{
			setTimeDropDownOptions(orderType);
		});

		$(".required").on("change", function()
		{
			$(this).next(".err-msg").hide();
		});

		/* Checkout box event listeners */

		$(".checkout-name").on("click", function()
		{
			let id = $(this).closest(".checkout-item").attr("id");
			orderIndex = getNumFromId(id);
			let orderItem = order[orderIndex];
			displayModalBox(orderItem);

			console.log(document.cookie);
		});

		$(".checkout-name").hover(function()
		{
			$(this).css("text-decoration", "underline");
		},
		function()
		{
			$(this).css("text-decoration", "none");
		});

		$("#order-btn").on("click", function()
		{
			submitOrder(orderType);
		});

		/* Modal box event listeners */

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

		$("#modal-textarea").keyup(function()
		{
			let textLen = $(this).val().length;
			if (textLen > 128)
				$("#modal-char-count").css("color", "red");
			else
				$("#modal-char-count").css("color", "black");

			$("#modal-char-count").html("Character count: " + textLen);		
		});
	});
});
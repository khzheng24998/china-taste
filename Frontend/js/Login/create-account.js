function createAccount()
{
	if (validateInputs())
	{
		let req = {};
		req.firstName = $("#first-name").val();
		req.lastName = $("#last-name").val();
		req.email = $("#email").val();
		req.phoneNumber = $("#phone-number").val();
		req.password = $("#password").val();

		$.post("/create-account", req, function(data, status)
		{
			if(status != "success" || data.msg === "error")
				alert("An issue occurred while creating your account!\nIf this problem persists, please call us at (860) 871-9311.");
			else if (data.msg === "account-exists")
				alert("An account under this email already exists!\nIf you believe this to be an error, please call us at (860) 871-9311.")
			else if (data.msg === "ok")
				$("#modal").show();
		});
	}
}

function validateInputs()
{
	let firstName = $("#first-name").val();
	let lastName = $("#last-name").val();
	let email = $("#email").val();
	let phoneNumber = $("#phone-number").val();
	let password = $("#password").val();
	let confirmation = $("#confirmation").val();

	let firstNameErrMsg = validateRequiredInput(firstName);
	let lastNameErrMsg = validateRequiredInput(lastName);
	let emailErrMsg = validateRequiredInput(email);

	let phoneNumberErrMsg = validatePhoneNumber(phoneNumber);
	let passwordErrMsg = validatePassword(password);
	let confirmationErrMsg = validateConfirmation(password, confirmation);

	let textFields = ["first-name", "last-name", "email", "phone-number", "password", "confirmation"];
	let errorMsgs = [firstNameErrMsg, lastNameErrMsg, emailErrMsg, phoneNumberErrMsg, passwordErrMsg, confirmationErrMsg];

	let success = true;

	for (let i = 0; i < textFields.length; i++)
	{
		let selector = "#" + textFields[i] + "-err";
		if (errorMsgs[i] !== "ok")
		{
			$(selector).show();
			$(selector).html(errorMsgs[i]);
			success = false;
		}
		else
			$(selector).hide();
	}

	return success;
}

function sendVerificationEmail()
{
	$.get("/send-verification-email", function(data, status)
	{
		if(status !== "success")
			alert("An issue occurred sending your verification email!\nIf this problem persists, please call us at (860) 871-9311.");
		else		
			window.location.href = "/verification-request-sent";
	});
}

$(document).ready(function()
{
	resizePage();
	displayNavBar();

	$(window).resize(function()
	{
    	resizePage();
	});

	$(".single").on("change", function()
	{
		$(this).next(".err-msg").hide();
	});

	$(".double").on("change", function()
	{
		$(this).next(".err-msg").hide();
	});

	$("#create-account-btn").on("click", function()
	{
		createAccount();
	});

	$("#verify-btn").on("click", function()
	{
		sendVerificationEmail();
	});

	$("#skip-btn").on("click", function()
	{
		window.location.href = "/account-created";
	});

	/* Nav-bar dropdown */

	$("#dynamic-nav-item").hover(function()
	{
		let navContents = $("#dynamic-nav-link").html();
		navContents = navContents.substring(0, 10);
		if (navContents === "My Account")
			$("#dropdown").show();
	},
	function()
	{
		let navContents = $("#dynamic-nav-link").html();
		navContents = navContents.substring(0, 10);
		if (navContents === "My Account")
			$("#dropdown").hide();
	});

	$(".dropdown-option").hover(function()
	{
		$(this).css("background-color", "#0366d6");
		$(this).css("color", "white");
	},
	function()
	{
		$(this).css("background-color", "white");
		$(this).css("color", "black");
	});

	$("#profile").on("click", function()
	{
		window.location.href = "/my-profile";
	});

	$("#addresses").on("click", function()
	{
		window.location.href = "/my-addresses";
	});

	$("#past-orders").on("click", function()
	{
		window.location.href = "/past-orders";
	});

	$("#sign-out").on("click", function()
	{
		$.get("/log-out", function(data, status)
		{
			if (status !== "success")
	    		alert("An issue occurred signing out from system!\nIf this problem persists, please call us at (860) 871-9311.");
			else
				window.location.href = "/signed-out";
		});
	});
});
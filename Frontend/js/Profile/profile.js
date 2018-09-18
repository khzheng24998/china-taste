function displayBasePage(userInfo)
{
	$("#base").show();
	$("#edit-profile").hide();
	$("#change-password").hide();

	let empty = {};
	if (JSON.stringify(userInfo) === JSON.stringify(empty))
		getProfileInfo(userInfo);	
	else
	{
		$("#email-data").html(userInfo.email);
		$("#first-name-data").html(userInfo.firstName);
		$("#last-name-data").html(userInfo.lastName);
		$("#phone-number-data").html(userInfo.phoneNumber);
	}
}

function displayEditProfilePage(userInfo)
{
	$("#edit-profile").show();
	$("#base").hide();

	$(".err-msg").hide();

	if (typeof(userInfo.email) !== "undefined")
		$("#email-field").val(userInfo.email);

	if (typeof(userInfo.firstName) !== "undefined")
		$("#first-name-field").val(userInfo.firstName);

	if (typeof(userInfo.lastName) !== "undefined")
		$("#last-name-field").val(userInfo.lastName);

	if (typeof(userInfo.phoneNumber) !== "undefined")
		$("#phone-number-field").val(userInfo.phoneNumber);
}

function displayChangePasswordPage()
{
	$("#change-password").show();
	$("#base").hide();

	$(".err-msg").hide();
}

function getProfileInfo(userInfo)
{
	$.get("/get-profile-info", function(data, status)
	{
		if (status !== "success")
	    	alert("An issue occurred retrieving your profile data!\nIf this problem persists, please call us at (860) 871-9311.");
		else
		{
			userInfo.email = data.userInfo.email;
			userInfo.firstName = data.userInfo.firstName;
			userInfo.lastName = data.userInfo.lastName;
			userInfo.phoneNumber = data.userInfo.phoneNumber;

			$("#email-data").html(userInfo.email);
			$("#first-name-data").html(userInfo.firstName);
			$("#last-name-data").html(userInfo.lastName);
			$("#phone-number-data").html(userInfo.phoneNumber);	
		}
	});
}

function validateProfileInfo()
{
	let email = $("#email-field").val();
	let firstName = $("#first-name-field").val();
	let lastName = $("#last-name-field").val();
	let phoneNumber = $("#phone-number-field").val();

	let emailErrMsg = validateRequiredInput(email);
	let firstNameErrMsg = validateRequiredInput(firstName);
	let lastNameErrMsg = validateRequiredInput(lastName);
	let phoneNumberErrMsg = validatePhoneNumber(phoneNumber);

	let textFields = ["first-name", "last-name", "email", "phone-number"];
	let errorMsgs = [firstNameErrMsg, lastNameErrMsg, emailErrMsg, phoneNumberErrMsg];

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

function updateProfileInfo(userInfo)
{
	if (!validateProfileInfo())
		return;

	let prevEmail = userInfo.email;

	userInfo.email = $("#email-field").val();
	userInfo.firstName = $("#first-name-field").val();
	userInfo.lastName = $("#last-name-field").val();
	userInfo.phoneNumber = $("#phone-number-field").val();

	$.post("/update-profile-info", userInfo, function(data, status)
	{
		if(status != "success" || data.msg === "error")
			alert("An issue occurred while updating your profile info!\nIf this problem persists, please call us at (860) 871-9311.");
		else if (data.msg === "ok")
		{
			displayBasePage(userInfo);
			if (prevEmail !== userInfo.email)
				$("#modal-1").show();

			$("#username").html(userInfo.firstName + " " + userInfo.lastName);
		}
	});
}

function validateUpdatePassword()
{
	let currentPassword = $("#current-password").val();
	let newPassword = $("#new-password").val();
	let confirmation = $("#confirmation").val();

	let currentPasswordErrMsg = validateRequiredInput(currentPassword);
	let newPasswordErrMsg = validatePassword(newPassword);
	let confirmationErrMsg = validateConfirmation(newPassword, confirmation);

	let textFields = ["current-password", "new-password", "confirmation"];
	let errorMsgs = [currentPasswordErrMsg, newPasswordErrMsg, confirmationErrMsg];

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

function updatePassword(userInfo)
{
	if (!validateUpdatePassword())
		return;

	let req = {};
	req.currentPassword = $("#current-password").val();
	req.newPassword = $("#new-password").val();

	$.post("/update-password", req, function(data, status)
	{
		console.log(data.msg);

		if(status != "success" || data.msg === "error")
			alert("An issue occurred while updating your password!\nIf this problem persists, please call us at (860) 871-9311.");
		else if (data.msg === "invalid-credentials")
		{
			$("#current-password-err").show();
			$("#current-password-err").html("Password is incorrect.");
		}
		else if (data.msg === "ok")
		{
			displayBasePage(userInfo);
			$("#modal-2").show();
		}
	});
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

function editProfileEvents(userInfo)
{
	$("#edit-profile-btn").on("click", function()
	{
		displayEditProfilePage(userInfo);
	});

	$(".edit-profile-field").on("change", function()
	{
		$(this).next(".err-msg").hide();
	});

	$("#save-btn-1").on("click", function()
	{
		updateProfileInfo(userInfo);
	});
}

function changePasswordEvents(userInfo)
{
	$("#change-password-text").hover(function()
	{
		$(this).css("text-decoration", "underline");
	},
	function()
	{
		$(this).css("text-decoration", "none");
	});

	$("#change-password-text").on("click", function()
	{
		displayChangePasswordPage();
	});

	$(".change-password-field").on("change", function()
	{
		$(this).next(".err-msg").hide();
	});

	$("#save-btn-2").on("click", function()
	{
		updatePassword(userInfo);
	});
}

function modalEvents()
{
	$("#verify-btn").on("click", function()
	{
		sendVerificationEmail();
	});

	$("#skip-btn").on("click", function()
	{
		$("#modal-1").hide();
	})

	$("#ok-btn").on("click", function()
	{
		$("#modal-2").hide();
	});
}

function attachEventHandlers(active, userInfo)
{
	$(".my-nav-item").hover(function()
	{
		let itemId = $(this).attr("id");
		itemId = itemId.replace("my-", "");

		if (itemId !== active)
			$(this).css("background-color", "#f1f1f1");
	},
	function()
	{
		let itemId = $(this).attr("id");
		itemId = itemId.replace("my-", "");

		if (itemId !== active)
			$(this).css("background-color", "white");
	});

	$(".my-nav-item").on("click", function()
	{
		let link = $(this).attr("id");
		window.location.href = "/" + link;
	});

	$(".cancel-btn").on("click", function()
	{
		displayBasePage(userInfo);
	});

	editProfileEvents(userInfo);
	changePasswordEvents(userInfo);
	modalEvents();
}

$(document).ready(function()
{
	let active = $("head").attr("id");
	active = active.replace("-head", "");

	let userInfo = {};

	initialize();
	displayBasePage(userInfo);
	attachEventHandlers(active, userInfo);
});
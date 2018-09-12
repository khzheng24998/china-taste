function sendNewPassword()
{
	let password = $("#password").val();
	let confirmation = $("#confirmation").val();

	let passwordErrMsg = validatePassword(password);
	let confirmationErrMsg = validateConfirmation(password, confirmation);

	let error = false;

	if (passwordErrMsg !== "ok")
	{
		$("#password-err").show();
		$("#password-err").html(passwordErrMsg);
		error = true;
	}
	else
		$("#password-err").hide();

	if (confirmationErrMsg !== "ok")
	{
		$("#confirmation-err").show();
		$("#confirmation-err").html(confirmationErrMsg);
		error = true;
	}
	else
		$("#confirmation-err").hide();

	if (error)
		return;

	let req = {};
	req.password = password;

	$.post("/password-reset", req, function(data, status)
	{
		if(status != "success")
			alert("An issue occurred while resetting your password!\nIf this problem persists, please call us at (860) 871-9311.");
		else if (data.msg === "not-found")
			alert("A password reset request for your account was not found (it may have expired). Please return to the login page and try again. If this problem persists, please call us at (860) 871-9311.");
		else if (data.msg === "invalid-password")
			alert("Your password could not be reset because it does not meet our requirements. Please enter a new password. If this problem persists, please call us at (860) 871-9311.");
		else if (data.msg === "ok")
			window.location.href = "/reset-success";
	});
}

function attachEventHandlers()
{
	$("#submit").on("click", function()
	{
		sendNewPassword();
	});

	$("input").on("change", function()
	{
		$(this).next(".err-msg").hide();
	});
}

$(document).ready(function()
{
	initialize();
	attachEventHandlers();
});
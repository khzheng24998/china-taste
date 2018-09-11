function sendResetEmail()
{
	let req = {};
	req.email = $("#email").val();

	let emailErrMsg = validateRequiredInput(req.email);

	if (emailErrMsg !== "ok")
	{
		$("#email-err").show();
		$("#email-err").html(emailErrMsg);
		return;
	}
	
	$("#email-err").hide();

	$.post("/send-reset-email", req, function(data, status)
	{
		if (status !== "success" || data.msg === "error")
			alert("An issue occurred communicating with our server!\nIf this problem persists, please call us at (860) 871-9311.");
		else if (data.msg === "not-found")
			alert("An account under the provided email was not found.\nIf you believe this to be an error, please call us at (860) 871-9311.");
		else if (data.msg === "ok")
		{
			let email = $("#email").val();
			setCookie("email", email, 300000);				//Cookie set to expire in 5 minutes
			window.location.href = "/reset-request-sent";
		}
	});
}

function attachEventHandlers()
{
	$("#submit").on("click", function()
	{
		sendResetEmail();
	});

	$("#email").on("change", function()
	{
		$("#email-err").hide();
	});
}

$(document).ready(function()
{
	initialize();
	attachEventHandlers();
});
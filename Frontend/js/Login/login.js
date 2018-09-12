function sendCredentials()
{
	let req = {};
	req.email = $("#email").val();
	req.password = $("#password").val();

	let emailErrMsg = validateRequiredInput(req.email);
	let passwordErrMsg = validateRequiredInput(req.password);

	let err = false;

	if (emailErrMsg !== "ok")
	{
		$("#email-err").show();
		$("#email-err").html(emailErrMsg);
		err = true;
	}
	else
		$("#email-err").hide();

	if (passwordErrMsg !== "ok")
	{
		$("#password-err").show();
		$("#password-err").html(passwordErrMsg);
		err = true;
	}
	else
		$("#password-err").hide();

	if (err)
		return;

	$.post("/log-in", req, function(data, status)
	{
		if(status != "success" || data.msg === "error")
			alert("An issue occurred while signing in!\nIf this problem persists, please call us at (860) 871-9311.");
		else if (data.msg === "not-found" || data.msg === "invalid-credentials")
			$("#login-err").show();
		else if (data.msg === "ok")
		{
			$("#login-err").hide();
			window.location.href = "/";
		}
	});
}

function attachEventHandlers()
{
	$("#sign-in").on("click", function()
	{
		let navLink = $("#dynamic-nav-link").attr("href");
		let signedIn = (navLink === "/my-profile") ? true : false;

		if (signedIn)
			alert("You are already signed in! To sign in with a different account, please sign out of this account first.");
		else
			sendCredentials();
	});

	$(".required").on("keyup", function()
	{
		$(this).next(".err-msg").hide();
		$("#login-err").hide();
	});
}

$(document).ready(function()
{
	initialize();
	attachEventHandlers();
});
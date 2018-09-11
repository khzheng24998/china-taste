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

$(document).ready(function()
{
	resizePage();
	displayNavBar();

	$(window).resize(function()
	{
    	resizePage();
	});

	$("#sign-in").on("click", function()
	{
		let navLink = $("#dynamic-nav-link").attr("href");
		let signedIn = (navLink === "/my-profile") ? true : false;

		if (signedIn)
			alert("You are already signed in!");
		else
			sendCredentials();
	});

	$(".required").on("keyup", function()
	{
		$(this).next(".err-msg").hide();
		$("#login-err").hide();
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
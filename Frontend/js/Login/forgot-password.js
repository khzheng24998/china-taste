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

$(document).ready(function()
{
	resizePage();
	displayNavBar();

	$(window).resize(function()
	{
    	resizePage();
	});

	$("#submit").on("click", function()
	{
		sendResetEmail();
	});

	$("#email").on("change", function()
	{
		$("#email-err").hide();
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
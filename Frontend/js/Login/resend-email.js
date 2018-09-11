function sendVerificationEmail()
{
	$.get('/send-verification-email', function(data, status)
	{
		if(status !== "success")
			alert("An issue occurred sending your verification email!\nIf this problem persists, please call us at (860) 871-9311.");
		else		
			location.reload();
	});
}

function sendResetEmail()
{
	let email = getCookie("email");
	if (email === "")
	{
		alert("No email detected (do you have cookies turned off?).\nPlease re-input your email address.");
		window.location.href = "/forgot-password";
	}
	else
	{
		let req = {};
		req.email = email;

		$.post("/send-reset-email", req, function(data, status)
		{
			if (status !== "success" || data.msg === "error")
				alert("An issue occurred communicating with our server!\nIf this problem persists, please call us at (860) 871-9311.");
			else if (data.msg === "not-found")
				alert("An account under the provided email was not found.\n If you believe this to be an error, please call us at (860) 871-9311.");
			else if (data.msg === "ok")
				location.reload();
		});
	}
}

function resendLink(type, timePrev)
{
	let date = new Date();
	let timeCurr = date.getTime();

	if (timeCurr - timePrev < 30000)
	{
		alert("Please wait at least 30 seconds before resending link!\nNote that reloading the page will restart the 30 second waiting period.");
		return;
	}

	if (type === "verification-request")
		sendVerificationEmail();

	else if (type === "reset-request")
		sendResetEmail();
}

$(document).ready(function()
{
	let type = $("head").attr("id");

	let date = new Date();
	let lastSentTime = date.getTime();

	resizePage();
	displayNavBar();

	$(window).resize(function()
	{
    	resizePage();
	});

	$("#resend").on("click", function()
	{
		resendLink(type, lastSentTime);
	});

	$("#resend").hover(function()
	{
		$(this).css("text-decoration", "underline");
	},
	function()
	{
		$(this).css("text-decoration", "none");
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
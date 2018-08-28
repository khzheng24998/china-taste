function resizePage()
{
	let winHeight = window.innerHeight;
	winHeight = Math.floor(0.8 * winHeight);
	$("#page-body").css("min-height", winHeight);
}

function sendAccountToken()
{
	let req = {};
	let email = $("#email").val();
	let username = $("#username").val();

	let success = false;

	if (email.length === 0 && username.length === 0)
	{
		$("#error").show();
		$("#error").html("Must enter a value for at least one of the follow fields!");
	}
	else
	{
		$("#error").hide();
		success = true;
	}

	if (email.length !== 0)
		req.email = email;

	if (username.length !== 0)
		req.username = username;

	if (!success)
		return;

	$.post("/forgot-password", req, function(data, status)
	{
		if(status != "success")
			alert("An issue occurred!\nIf this problem persists, please call us at (860) 871-9311.");
		else
		{
			if (data.msg === "not-found")
			{
				$("#error").show();
				$("#error").html("An account under the provided email/username was not found.");
			}
			else
			{
				$("#error").hide();
				window.location.href = "/instructions-sent";
			}
		}
	});
}

$(document).ready(function()
{
	resizePage();

	$(window).resize(function()
	{
    	resizePage();
	});

	$("#submit").on("click", function()
	{
		sendAccountToken();
	});

	$("input").on("change", function()
	{
		$(this).next(".err-msg").hide();
	});
});
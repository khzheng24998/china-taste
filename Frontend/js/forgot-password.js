function resizePage()
{
	let winHeight = window.innerHeight;
	winHeight = Math.floor(0.8 * winHeight);
	$("#page-body").css("min-height", winHeight);
}

function sendCredentials()
{
	let req = {};
	req.username = $("#username").val();
	req.password = $("#password").val();

	let err = false;

	if (req.username.length === 0)
	{
		$("#username-err").show();
		err = true;
	}
	else
		$("#username-err").hide();

	if (req.password.length === 0)
	{
		$("#password-err").show();
		err = true;
	}
	else
		$("#password-err").hide();

	if (err)
		return;

	$.post("/log-in", req, function(data, status)
	{
		if(status != "success")
			alert("An issue occurred while signing in!\nIf this problem persists, please call us at (860) 871-9311.");
		else
		{
			console.log(data.msg);

			switch(data.msg)
			{
				case "not-found":
				case "invalid-credentials":
					$("#login-err").show();
					break;
				case "ok":
					$("#login-err").hide();
					window.location.href = "/";
					break;
				default:
					break;
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
		let req = {};
		req.username = $("#username").val();

		$.post("/forgot-password", req, function(data, status)
		{
			if(status != "success")
				alert("An issue occurred while signing in!\nIf this problem persists, please call us at (860) 871-9311.");
		});

	});

	/*$(".required").on("change", function()
	{
		$(this).next(".err-msg").hide();
	});*/
});
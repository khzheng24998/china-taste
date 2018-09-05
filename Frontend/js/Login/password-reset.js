function resizePage()
{
	let winHeight = window.innerHeight;
	winHeight = Math.floor(0.8 * winHeight);
	$("#page-body").css("min-height", winHeight);
}

function validatePassword()
{
	let password = $("#new-password").val();
	let letters = password.match(/[A-Za-z]/g);
	let numbers = password.match(/[0-9]/g);

	if (password.length === 0)
	{
		$("#password-err").show();
		$("#password-err").html("Required field.");
	}
	else if (password.length < 8 || letters === null || numbers === null)
	{
		$("#password-err").show();
		$("#password-err").html("Does not meet requirements.");
	}
	else
	{
		$("#password-err").hide();
		return true;
	}

	return false;
}

function validateConfirmation()
{
	let password = $("#new-password").val();
	let confirmation = $("#confirmation").val();

	if (confirmation.length === 0)
	{
		$("#confirmation-err").show();
		$("#confirmation-err").html("Required field.");
	}
	else if (password !== confirmation)
	{
		$("#confirmation-err").show();
		$("#confirmation-err").html("Does not match password.");
	}
	else
	{
		$("#confirmation-err").hide();
		return true;
	}

	return false;
}

function sendNewPassword()
{
	let error = false;

	if (!validatePassword())
		error = true;

	if (!validateConfirmation())
		error = true;

	if (!error)
	{
		let req = {};
		req.newPassword = $("#new-password").val();

		$.post("/password-reset", req, function(data, status)
		{
			if(status != "success")
				alert("An issue occurred while resetting your password!\nIf this problem persists, please call us at (860) 871-9311.");
			else
				window.location.href = "/reset-success";
		});
	}
}

$(document).ready(function()
{
	console.log(document.cookie);

	resizePage();

	$(window).resize(function()
	{
    	resizePage();
	});

	$("#submit").on("click", function()
	{
		sendNewPassword();
	});

	$("input").on("change", function()
	{
		$(this).next(".err-msg").hide();
	});
});
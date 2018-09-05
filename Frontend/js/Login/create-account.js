function resizePage()
{
	let winHeight = window.innerHeight;
	winHeight = Math.floor(0.8 * winHeight);
	$("#page-body").css("min-height", winHeight);
}

function createAccount()
{
	let error = false;

	if (!validateEmail())
		error = true;

	if (!validatePassword())
		error = true;

	if (!validateConfirmation())
		error = true;

	if (!error)
	{
		let req = {};
		req.username = $("#username").val();
		req.email = $("#email").val();
		req.password = $("#password").val();

		$.post("/create-account", req, function(data, status)
		{
			if(status != "success")
				alert("An issue occurred while creating your account!\nIf this problem persists, please call us at (860) 871-9311.");
			else
				$("#modal").show();
		});
	}
}

function validateEmail()
{
	let email = $("#email").val();
	if (email.length === 0)
	{
		$("#email-err").show();
		return false;
	}
	else
	{
		$("#email-err").hide();
		return true;
	}
}

function validatePassword()
{
	let password = $("#password").val();
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
	let password = $("#password").val();
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

$(document).ready(function()
{
	resizePage();

	$(window).resize(function()
	{
    	resizePage();
	});

	$("#create-account-btn").on("click", function()
	{
		createAccount();
	});

	$("#verify-btn").on("click", function()
	{
		$.get("/get-verification-email", function(data, status)
		{
			if(status != "success")
				alert("An issue occurred while creating your account!\nIf this problem persists, please call us at (860) 871-9311.");
			else		
				window.location.href = "/verification-request-sent";
		});
	});

	$("#skip-btn").on("click", function()
	{
		window.location.href = "/";
	});
});
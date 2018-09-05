function userIsSignedIn()
{
	$.get("/account-status", function(data, status)
	{
		if (status !== "success")
		{
    		alert("An issue occurred signing out from system!\nIf this problem persists, please call us at (860) 871-9311.");
    		return false;
		}
		else
		{
			let retVal = (data.msg === "signed-in") ? true : false;
			return retVal;
		}
	});
}

function resizePage()
{
	let winHeight = window.innerHeight;
	winHeight = Math.floor(0.8 * winHeight);
	$("#page-body").css("min-height", winHeight);
}

$(document).ready(function()
{
	resizePage();

	let signedIn = userIsSignedIn();
	if (signedIn)
		$("#account-login-opt").html("My Account &nbsp;&#9660;");
	else
		$("#account-login-opt").html("Login");

	$(window).resize(function()
	{
    	resizePage();
	});
});
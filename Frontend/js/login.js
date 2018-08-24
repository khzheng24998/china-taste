function resizePage()
{
	let winHeight = window.innerHeight;
	winHeight = Math.floor(0.8 * winHeight);
	$("#page-body").css("min-height", winHeight);
}

function sendCredentials()
{
	let req = {};
	req.userName = $("#user-name").val();
	req.password = $("#password").val();

	$.post("/validate-credentials", req, function(data, status)
	{
		if(status != "success")
			alert("An issue occurred while signing in!\nIf this problem persists, please call us at (860) 871-9311.");
		else
		{
			if(data.msg === "error")
			{

			}
			else
				window.location.href = "/";
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

	$("#sign-in").on("click", function()
	{
		sendCredentials();
	});
});
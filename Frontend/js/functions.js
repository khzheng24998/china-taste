function resizePage()
{
	let winHeight = window.innerHeight;
	winHeight = Math.floor(0.8 * winHeight);
	$("#page-body").css("min-height", winHeight);
}

/*function isUserSignedIn()
{
	$.get("/account-status", function(data, status)
	{
		if (status !== "success")
    		alert("An issue occurred signing out from system!\nIf this problem persists, please call us at (860) 871-9311.");
		else
		{
			let label = (data.msg === "signed-in") ? "My Account &nbsp;&#9660;" : "Login";
			$("#account-login-opt").html(label);
		}
	});
}*/
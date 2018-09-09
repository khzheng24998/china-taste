function displayPage1()
{
	$.get("/get-profile-data", function(data, status)
	{
		if (status !== "success")
		{
			console.log(status);
    		alert("An issue occurred!\nIf this problem persists, please call us at (860) 871-9311.");
		}
		else
		{
			$("#username").html(data.username);
			$("#email").html(data.email);
			//$("#first-name").html(data.firstName);
			//$("#last-name").html(data.lastName);
			//$("#phone-number").html(data.phoneNumber);
		}
	});
}

$(document).ready(function()
{
	let active = $("head").attr("id");

	resizePage();
	displayPage1();

	$(window).resize(function()
	{
    	resizePage();
	});

	$(".my-nav-item").hover(function()
	{
		let itemId = $(this).attr("id");
		itemId = itemId.replace("my-", "");

		if (itemId !== active)
			$(this).css("background-color", "#f1f1f1");
	},
	function()
	{
		let itemId = $(this).attr("id");
		itemId = itemId.replace("my-", "");

		if (itemId !== active)
			$(this).css("background-color", "white");
	});

	$(".my-nav-item").on("click", function()
	{
		let link = $(this).attr("id");
		window.location.href = "/" + link;
	});
});
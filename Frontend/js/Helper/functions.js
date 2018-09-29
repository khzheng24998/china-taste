const inputLimit = 512;

function resizePage()
{
	let winHeight = window.innerHeight;
	winHeight = Math.floor(0.8 * winHeight);
	$("#page-body").css("min-height", winHeight);
}

function displayNavBar()
{
	$.get("/get-session-info", function(data, status)
	{
		if (status !== "success")
    		alert("An issue occurred communicating with our server!\nIf this problem persists, please call us at (860) 871-9311.");
		else
		{
			if (data.msg === "signed-in")
			{
				$("#dynamic-nav-link").html("My Account<span style='font-size: 13px;''>&nbsp;&nbsp;&#9660;</span>");
				$("#dynamic-nav-link").attr("href", "/my-profile");
				$("#username").html(data.firstName + " " + data.lastName);
			}

			else if (data.msg === "signed-out")
			{
				$("#dynamic-nav-link").html("Login");
				$("#dynamic-nav-link").attr("href", "/login");
			}
		}
	});
}

function attachNavBarEvents()
{
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
}

function initialize()
{
	resizePage();
	displayNavBar();
	attachNavBarEvents();

	$(window).resize(function()
	{
    	resizePage();
	});
}

function isUserSignedIn()
{
	let navLink = $("#dynamic-nav-link").attr("href");
	let signedIn = (navLink === "/my-profile") ? true : false;
	return signedIn;
}

/* Cookie accessor functions */

function setCookie(cname, cvalue, lifespan) 
{
    let date = new Date();
    date.setTime(date.getTime() + lifespan);
    let expires = "expires=" + date.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";";
}

function getCookie(cname) 
{
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) 
    {
        let c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1);
      	
        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }

    return "";
}

/* End of cookie accessor functions */
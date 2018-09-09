function resendVerificationLink(timePrev)
{
	let date = new Date();
	let timeCurr = date.getTime();

	if (timeCurr - timePrev < 30000)
	{
		alert("Please wait at least 30 seconds before resending the verification link!\nNote that reloading the page will restart the 30 second waiting period.");
		return;
	}

	$.get("/get-verification-email", function(data, status)
	{
		if(status != "success")
			alert("An issue occurred while sending your verification email!\nIf this problem persists, please call us at (860) 871-9311.");
		else		
			window.location.href = "/verification-request-sent";
	});
}

$(document).ready(function()
{
	let date = new Date();
	let lastSentTime = date.getTime();

	resizePage();

	$(window).resize(function()
	{
    	resizePage();
	});

	$("#resend").on("click", function()
	{
		resendVerificationLink(lastSentTime);
	});

	$("#resend").hover(function()
	{
		$(this).css("text-decoration", "underline");
	},
	function()
	{
		$(this).css("text-decoration", "none");
	});
});
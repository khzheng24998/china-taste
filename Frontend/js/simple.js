$(document).ready(function()
{
	resizePage();
	checkIfUserIsSignedIn();

	$(window).resize(function()
	{
    	resizePage();
	});
});
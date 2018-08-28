function resizePage()
{
	let winHeight = window.innerHeight;
	winHeight = Math.floor(0.8 * winHeight);
	$("#page-body").css("min-height", winHeight);
}

$(document).ready(function()
{
	resizePage();

	$(window).resize(function()
	{
    	resizePage();
	});
});
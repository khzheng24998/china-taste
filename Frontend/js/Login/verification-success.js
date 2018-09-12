function attachEventHandlers()
{
	$("#close-modal").on("click", function()
	{
		$("#modal").hide();
	});
}

$(document).ready(function()
{
	initialize();
	attachEventHandlers();
});
function sendFiles(app)
{
	/*-------------------------------------------------*/
	/*				   General Purpose                 */
	/*-------------------------------------------------*/

	/* General purpose CSS files */

	app.get('/Frontend/css/shop-homepage.css', function(req, res)
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	app.get('/Frontend/css/generic.css', function(req, res)
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	/* General purpose JS files */

	app.get('/Frontend/js/simple.js', function(req, res)
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	app.get('/Frontend/js/Helper/functions.js', function(req, res)
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	app.get('/Frontend/js/Helper/validation.js', function(req, res)
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	/*-------------------------------------------------*/
	/*					   Login                       */
	/*-------------------------------------------------*/

	/* Simple HTML files */

	app.get('/account-created', function(req, res)
	{
		res.sendFile(__dirname + '/Frontend/html/Login/Simple/account-created.html');
	});

	app.get('/signed-out', function(req, res)
	{
		res.sendFile(__dirname + '/Frontend/html/Login/Simple/signed-out.html');
	});

	app.get('/reset-success', function(req, res)
	{
		res.sendFile(__dirname + '/Frontend/html/Login/Simple/reset-success.html');
	});

	/* Login */

	app.get('/login', function(req, res)
	{
		res.sendFile(__dirname + '/Frontend/html/Login/login.html');
	});

	app.get('/Frontend/css/Login/login-styles.css', function(req, res) 
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	app.get('/Frontend/css/Login/login.css', function(req, res) 
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	app.get('/Frontend/js/Login/login.js', function(req, res)
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	/* Create account */

	app.get('/create-account', function(req, res)
	{
		res.sendFile(__dirname + '/Frontend/html/Login/create-account.html');
	});

	app.get('/Frontend/css/Login/create-account.css', function(req, res) 
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	app.get('/Frontend/js/Login/create-account.js', function(req, res)
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	/* Verification request sent */

	app.get('/verification-request-sent', function(req, res)
	{
		res.sendFile(__dirname + '/Frontend/html/Login/verification-request-sent.html');
	});

	app.get('/Frontend/js/Login/resend-email.js', function(req, res)
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	/* Reset request sent */

	app.get('/reset-request-sent', function(req, res)
	{
		res.sendFile(__dirname + '/Frontend/html/Login/reset-request-sent.html');
	});

	/* Forgot password */

	app.get('/forgot-password', function(req, res)
	{
		res.sendFile(__dirname + '/Frontend/html/Login/forgot-password.html');
	});

	app.get('/Frontend/js/Login/forgot-password.js', function(req, res)
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	/* Password reset */

	app.get('/Frontend/js/Login/password-reset.js', function(req, res)
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	/* Verification success */

	app.get('/Frontend/css/Login/verification-success.css', function(req, res) 
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	app.get('/Frontend/js/Login/verification-success.js', function(req, res) 
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	/*-------------------------------------------------*/
	/*					  Profile                      */
	/*-------------------------------------------------*/

	/* Profile */

	app.get('/my-profile', function(req, res)
	{
		res.sendFile(__dirname + '/Frontend/html/Profile/profile.html');
	});

	app.get('/Frontend/css/Profile/profile.css', function(req, res) 
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	app.get('/Frontend/js/Profile/profile.js', function(req, res)
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	/*-------------------------------------------------*/
	/*					     ...                       */
	/*-------------------------------------------------*/

	/* Item selection */

	app.get('/Frontend/css/itemSelect.css', function(req, res) 
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	app.get('/Frontend/js/itemSelect.js', function(req, res)
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	/* Checkout */

	app.get('/checkout', function(req, res) 
	{
		res.sendFile(__dirname + '/Frontend/html/checkout.html');
	});

	app.get('/Frontend/css/checkout.css', function(req, res) 
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	app.get('/Frontend/js/checkout.js', function(req, res)
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	/* Confirmation */

	app.get('/confirmation', function(req, res)
	{
		res.sendFile(__dirname + '/Frontend/html/confirmation.html');
	});

	app.get('/Frontend/js/confirmation.js', function(req, res)
	{
	  	res.sendFile(__dirname + req.originalUrl);
	});

	/*-------------------------------------------------*/
	/*					    Menu                       */
	/*-------------------------------------------------*/

	app.get('/', function(req, res) 
	{
		res.sendFile(__dirname + '/Frontend/html/Menu/apps.html');
	});
}

module.exports.sendFiles = sendFiles;
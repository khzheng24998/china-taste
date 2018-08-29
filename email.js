var nodemailer = require('nodemailer');
const Crypto = require("crypto");

function formatEmailBody(emailBody, order)
{

}

function sendResetLink(password, key, receiver)
{
	let url = "http://localhost:3000/password-reset?" + key;
	let emailBody = "<p>To reset your password, click the following link:</p><a href='" + url + "'>" + url + "</a><p>If you did not request a password reset, please disregard this message.</p>";

	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: 
		{
			user: 'chinatasteofvernon@gmail.com',
			pass: password
		}
  	});

	let mailOptions = {
		from: 'chinatasteofvernon@gmail.com',
  		to: receiver,
  		subject: 'Password Reset',
  		html: emailBody
	};

	transporter.sendMail(mailOptions, function(error, info)
	{
		if (error) 
		{
      		console.log(error);
      		return false;
		}
    	else
    	{
      		console.log('Email sent: ' + info.response);
      		return true;
    	}
    });
}

function sendVerificationLink(password, key, receiver)
{
	let url = "http://localhost:3000/verify-email?" + key;
	let emailBody = "<p>To verify your email, click the following link:</p><a href='" + url + "'>" + url + "</a><p>If you did not recently create an account with us or change your email, please disregard this message.</p>";

	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: 
		{
			user: 'chinatasteofvernon@gmail.com',
			pass: password
		}
  	});

	let mailOptions = {
		from: 'chinatasteofvernon@gmail.com',
  		to: receiver,
  		subject: 'Password Reset',
  		html: emailBody
	};

	transporter.sendMail(mailOptions, function(error, info)
	{
		if (error) 
		{
      		console.log(error);
      		return false;
		}
    	else
    	{
      		console.log('Email sent: ' + info.response);
      		return true;
    	}
    });
}

function sendMail(password, order)
{
	let emailBody = "";

	emailBody += "<h4>Customer Information</h4>";
	emailBody += "<table><tr>";
	emailBody += '<td>Name: ' + order.info.customerInfo.firstName + " " + order.info.customerInfo.lastName + "&nbsp" + "</td>";
	emailBody += '<td>Phone Number: ' + order.info.customerInfo.phoneNumber + "</td></tr></table>";

	emailBody += "<h4>Order Information</h4>";
	emailBody += "<p>Type: " + order.info.orderType + "</p>";
	emailBody += "<p>Payment Method: " + order.info.orderDetails.paymentMethod + "</p>";
	emailBody += "<table><tr>";
	emailBody += "<td>Request Date: " + order.info.orderDetails.requestDate + "               " + "</td>";
	emailBody += "<td>Request Time: " + order.info.orderDetails.requestTime + "</td></tr>";

	if (order.info.orderType === "delivery")
	{
		emailBody += "<h4>Address Information</h4>";
		emailBody += "<p>Address: " + order.info.addressInformation.address + "</p>";
		emailBody += "<p>City: " + order.info.addressInformation.city + "</p>";
		emailBody += "<p>State: " + order.info.addressInformation.state + "</p>";
		emailBody += "<p>Zip Code: " + order.info.addressInformation.zipCode + "</p>"
	}

	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: 
		{
			user: 'chinatasteofvernon@gmail.com',
			pass: password
		}
  	});

	let mailOptions = {
		from: 'chinatasteofvernon@gmail.com',
  		to: 'kennyzheng24998@gmail.com',
  		subject: 'Order Confirmation (Test)',
  		html: emailBody
	};

	transporter.sendMail(mailOptions, function(error, info)
	{
		if (error) 
      		console.log(error);
    	else 
      		console.log('Email sent: ' + info.response);
    });
}

module.exports.sendMail = sendMail;
module.exports.sendResetLink = sendResetLink;
module.exports.sendVerificationLink = sendVerificationLink;
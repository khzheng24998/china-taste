var prompt = require('prompt');
var nodemailer = require('nodemailer');

var emailBody = "<p>Name: Kenny Zheng</p><p>Phone Number: (860) 335-1427</p><p>Request Date: 8/20 (Today)</p><p>Request Time: ASAP</p><p>Your Order:</p><ul><li>2 x 1. Fried Whole Chicken Wings (5)</li><li>1 x 5. Boneless Spare Ribs (S)</li><li>1 x 3. Spring Roll (1) (Only Veg.)</li></ul>";

prompt.start();
prompt.get(['password'], function(err, result)
{

  console.log(result.password);

   var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'chinatasteofvernon@gmail.com',
      pass: result.password
    }
  });

var mailOptions = {
  from: 'chinatasteofvernon@gmail.com',
  to: 'kennyzheng24998@gmail.com',
  subject: 'Email Test',
  html: emailBody
};


   transporter.sendMail(mailOptions, function(error, info)
   {
    if (error) 
      console.log(error);
    else 
      console.log('Email sent: ' + info.response);
    });

});


const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");
const msg = {
  to: 'kennyzheng24998@gmail.com',
  from: 'test@example.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail.send(msg);
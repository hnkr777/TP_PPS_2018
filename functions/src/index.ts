

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

/*exports.sendEmail = functions.database.ref('/emails')
  .onWrite(event => {
    return sendEmail('arkn84@gmail.com');
  });

// Sends a welcome email to the given user.
function sendEmail(email: string) {
  const mailOptions = {
    from: `<noreply@example.com>`,
    to: email,
    subject: '',
    content: ''
  };
  // The user subscribed to the newsletter.
  mailOptions.subject = `¡Bienvenido a Remisería Radix!`;
  mailOptions.content = `Ya tiene dado de alta su usuario, esperamos que disfrute el servicio.`;
  return nodemailer.mailTransport.sendMail(mailOptions).then(() => {
    console.log('Nuevo email de bienvenida enviado a: ', email);
  });

}*/



/*const functions = require('firebase-functions');
const emailjs = require('emailjs/email');

exports.sendmailfn = functions.database.ref('/sendmail/{emailkey}').onWrite(event => {
    //var doc = new pdfdocument();
    let email = event.data.val().emailid;

    //doc.text('This email was sent as soon as the user logged in');
    //doc.end();

    let server = emailjs.server.connect({
        user: <googleusername>
        password: <googlepassword>
        host: 'smtp.gmail.com',
        ssl: true
    });
    
    server.send({
        text: 'This mail was sent automatically when the user logged in',
        from: 'myself@thisvideo.com',
        to: emailid,
        subject: 'Wow, we can send an email this way',
        attachment: [
            {data: 'somerandomdata', type:'application/pdf', stream: doc, name: 'rules.pdf'}
        ]
    }, (err, message) => {
        if (err) 
            console.log(err)    
    })
})*/
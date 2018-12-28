const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();


// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res) =>{
    console.log("test");
    res.json({name:"Hello"});
})

app.post('/send', (req, res) => {
  const output = `
    <h3>Transaction verification code</h3>
    <p>You attempted to make a transaction with our application, to continue, please enter the code bellow</p>
    <ul>  
      <h1>${req.body.code}</h1>
    </ul>
    <p>If you didn't make any transaction, you can ignore this messege</p>
  `;
  console.log(req.body);
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service:"Gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'internetbankingapp@gmail.com', // generated ethereal user
        pass: 'internetbanking'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Internet banking app" <internetbankingapp@gmail.com>', // sender address
      to: req.body.recemail, // list of receivers
      subject: 'Transaction verification code', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.json({msg:'Email has been sent'});
  });
  });

app.listen(6969, () => console.log('Server started...'));
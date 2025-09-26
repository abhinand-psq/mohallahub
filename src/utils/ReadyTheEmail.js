
import Mailgen from 'mailgen';

var mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'Mailgen',
        link: 'https://tsek.jsdf.com/'
    }
});

export const prepareEmail = (username,emailredirectlink) =>{

let email =  {body: {
        name: username,
        intro: 'Welcome to our product.',
        action: {
            instructions: 'To get started with, please click below button',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your email',
                link: emailredirectlink
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }}
    var htmlemailBody = mailGenerator.generate(email);


var textemailBody = mailGenerator.generatePlaintext(email);

return {htmlemailBody,textemailBody}
}


export const prepareforgetpassword = (username,passwordredirectlink) =>{

let email =  {body: {
        name: username,
        intro: 'homeschool.',
        action: {
            instructions: 'please click to reset your password',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'reset the password',
                link: passwordredirectlink
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }}
    var htmlemailBody = mailGenerator.generate(email);


var textemailBody = mailGenerator.generatePlaintext(email);

return {htmlemailBody,textemailBody}
}


import nodemailer from 'nodemailer'


export const transporter = nodemailer.createTransport({
  host:"sandbox.smtp.mailtrap.io",
  port: 587,
    secure: false, 

  auth: {
    user: "dbb17ec995d786",
    pass: "fd8917fd164317",
  },
});


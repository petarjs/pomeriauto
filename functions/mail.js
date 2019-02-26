const Mailgun = require('mailgun-js')

const apiKey = '5a39eeec1d0498818b610735ef36f5e0-2d27312c-0c3b25d8'
const domain = 'mail.pomeriauto.com'

function sendEmail(email, subject, html) {
    let mailgun = new Mailgun({ apiKey, domain });

    const mailOptions = {
        from: `PomeriAuto <noreply@pomeriauto.com>`,
        to: email,
        subject,
        html
    };

    return mailgun
        .messages()
        .send(mailOptions, (err, body) => {
            if (err) {
                console.log({err})
            }
        })
}

module.exports = {
    sendEmail
}
const express = require('express');
const path = require('path');
const nodemailer = require ('nodemailer');
const { google } = require ('googleapis');
const app = express();
 
// view engine setup
// app.engine('handlebars', exphbs());
// app.set('view engine', 'handlebars');

//Static assests set up
app.use(express.static('./public'));

//Bode-parser set up
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './index.html'));
})

app.post('/', (req, res) => {
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h>
    <ul>
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.msg}</p>
    `
    const CLIENT_ID = '235745246240-vv2ligeq6qel18t7b75qjkrh88hg2hee.apps.googleusercontent.com';
    const CLIENT_SECRET = 'svjq1gMq78EbIOKWnI37rdKf';
    const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
    const REFRESH_TOKEN = '1//0474JHsjfKeL3CgYIARAAGAQSNwF-L9IrTD1bSKAbIGaN26sPE5TsYRWpltxLrpuUeWyXuLV_0dXA2J9VxKANV-1Upu4sfOgR9t8';
    
    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })
    
async function sendMail() {
    try{
        const accessToken = oAuth2Client.getAccessToken();
    
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'ademiju.stephen@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
    
    const mailOptions = {
        from: 'Nodemailer <ademiju.stephen@gmail.com>',
        to : 'ademijutobi@gmail.com',
        subject: 'You Have A New Contact Request',
        text: 'Hello there',
        html: output
    };

    const result = await transport.sendMail(mailOptions)
    return result;

    } catch (error){
        return error
    }
}
    sendMail().then(result => console.log('Email sent...'))
    .catch(error => console.log(error.message))
    res.redirect('back')


})


app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

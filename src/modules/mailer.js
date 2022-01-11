const nodemailer = require('nodemailer');

//const path = require('path');
//const hbs = require('nodemailer-express-handlebars');

const { host, port, user, pass } = require('../config/mail.json');

var transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass },
});

/* transport.use(
  'compile',
  hbs({
    viewEngine: 'handlebars',
    //resolve(__dirname, '..', 'app', 'views', 'emails');
    //viewPath: path.resolve(__dirname, '..', 'resources', 'mail', 'auth'),
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
  })
); */

module.exports = transport;

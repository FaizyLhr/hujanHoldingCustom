let pdf = require("pdf-creator-node");
let QRCode = require("qrcode");
let fs = require('fs')

let config = require("../config");
let emailService = require('./emailService');
let pdfTemplate = fs.readFileSync(process.cwd() + '/server/public/template.html', "utf8");
let greenTemplate = fs.readFileSync(process.cwd() + '/server/public/green.html', "utf8");
const statuses = require('../constants/status');
const messages = require('../constants/messages');


function formatDate(d){
  return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
}

async function sendPDFEmail (r) {
    let qr = await QRCode.toDataURL(config.link + "/details/" + r.referenceNumber + '/' + r.email);
    var testTime = "Not Provided";
    if(r.testTime){
      testTime = r.testTime.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    }
    var report = 
    {
      referenceNumber: r.referenceNumber.toUpperCase(),
      dob: formatDate(r.dob),
      date: r.testTime.toLocaleString('en-US'),
      issue: r.issueTime.toLocaleString('en-US'),
      name: r.firstName + " " + r.lastName,
      passportNumber: r.passportNumber,
      email: r.email,
      status: statuses[r.status -1],
      gender: r.gender,
      qr: qr,
      message: messages[r.status -1] 
    }

    var options = {
      height: "1300px",
    }


    var document = {
      html: r.status ===2? greenTemplate: pdfTemplate,
      data: {report: report},
      path: process.cwd() + `/server/public/pdf/${r.referenceNumber}.pdf`
    }

    pdf.create(document, options).then(function(result) {
      console.log(result);
      if(r.status === 4)
        emailService.sendInvalidReportEmail(report);
      else 
        emailService.sendReportEmail(report);
    })
    .catch(function(err) {
      console.log(err);
    });
}


module.exports = {
    sendPDFEmail
}
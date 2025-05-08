// Import Package
require('dotenv').config();

// Import File
const agenda = require('./agenda/agenda');

//Immediately Invoked Function Expression (IIFE)
(async function(){
const {emailjob} = require('./agenda/jobs/emailjob');

emailjob(agenda);
await agenda.start();
})
();

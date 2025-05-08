require('dotenv').config()
const Agenda = require('agenda');

const agenda = new Agenda({
    db:{address:process.env.MONGO_URL, collection:'agendaJobs'},
    defaultLockLifetime:  10000
});

module.exports = agenda
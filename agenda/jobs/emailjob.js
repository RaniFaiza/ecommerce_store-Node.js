// import packages
require('dotenv').config();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
//import files
const { jobs } = require('agenda/dist/agenda/jobs');
const {sendVerificationEmail} = require('../../utils/email');

// Define job to send registration email
async function emailjob(agenda){
    agenda.define('send verification email',async (job, done)=>{

        const {user} = job.attrs.data;

    try{ 
            await sendVerificationEmail(user);
            
            // Job marked as completed 
            done();

    } catch(error){

        console.error(` Failed to send email to ${user.email}: ${error.message}`);
        
        jobs.attrs.failCount = Number.isInteger(jobs.attrs.failCount)? jobs.attrs.failCount + 1 : 1;
        
        //Retry Mechanism
        if(jobs.attrs.failCount <4 ){
            console.log(`Retrying... Attempt #${job.attrs.failCount + 1}`);
            await job.schedule('in 1 minute').save();
        }
        else{
            await agenda.now('dead-letter-queue',{user,error:error.message});
        }

        // Job marked as failed
        done(error);
        
    }

    });

    // Definition  of Dead-Letter-Queue
    agenda.define('dead-letter-queue',async(job)=>{
        const { user, error } = job.attrs.data;
        console.log(`Job permanently failed for ${user.email}: ${error}`);
    });
}

module.exports = {emailjob}
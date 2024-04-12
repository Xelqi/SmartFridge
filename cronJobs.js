const cron = require('node-cron');
const { sendNotificationToAllUsers } = require('./controllers/notificationController');

// Function to start the cron job
function startCronJob() {
    // Schedule the task to run at 12 PM every day
    cron.schedule('0 12 * * *', () => {
        console.log('Running scheduled task...');
        // Call the function to send notifications to all users
        sendNotificationToAllUsers();
    });
}


// Function to start the cron job
// function startCronJob() {
//     // Schedule the task to run every minute
//     cron.schedule('* * * * *', () => {
//         console.log('Running scheduled task...');
//         // Call the function to send notifications to all users
//         sendNotificationToAllUsers();
//     });
// }

// Function to stop the cron job if necessary
function stopCronJob() {
    // Implement if needed
}

module.exports = { startCronJob, stopCronJob };

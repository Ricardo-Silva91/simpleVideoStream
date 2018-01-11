const cron = require('node-cron');
const jsonfile = require('jsonfile');

const variables = require('./../variables');

cron.schedule('0 0 * * * *', function () {
//cron.schedule('* * * * * *', function () {
    console.log('refreshing videos');

    variables.refreshVideoList();

});

cron.schedule('* * * * * *', function () {
//cron.schedule('* * * * * *', function () {
    if (variables.mustWrite === true) {

        variables.db.videos = variables.videoList;

        jsonfile.writeFile(variables.dbPath, variables.db, {spaces: 4}, function (err) {
            if (err !== null) {
                console.error(err)
            }
        });
        variables.mustWrite = false;
    }

});

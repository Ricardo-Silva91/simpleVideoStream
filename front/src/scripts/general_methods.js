/**
 * Created by Ricardo on 23/05/2017.
 */

//exports.backendUrl = 'http://192.168.1.78:1337';
//exports.backendUrl = window.location.protocol+'//'+(window.location.hostname)+':1337';
exports.backendUrl = '/rest_server';

exports.getVideoList = function (cb) {

    fetch(this.backendUrl + '/getVideoList')
        .then((response) => response.json())
        .then((responseJson) => {
            //console.log(responseJson.result !== 'fail');
            //return responseJson.result !== 'fail';
            cb(responseJson);
        })
        .catch((error) => {
            //return false;
            cb(false);
        });
};



exports.refreshLists = function (cb) {

    const url_rest = this.backendUrl + '/refreshVideoList';

    const body = {
        nothing:'0'
    };

    fetch(url_rest, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: body
    })
        .then((response) => response.json())
        .then((responseJson) => {
            //console.log(responseJson.result !== 'fail');
            //return responseJson.result !== 'fail';
            cb(responseJson);
        })
        .catch((error) => {
            //return false;
            cb(false);
        });

    /*
    fetch(this.backendUrl + '/refreshVideoList')
        .then((response) => response.json())
        .then((responseJson) => {
            //console.log(responseJson.result !== 'fail');
            //return responseJson.result !== 'fail';
            cb(responseJson);
        })
        .catch((error) => {
            //return false;
            cb(false);
        });

    */
};

exports.stringHasWords = (stringToCheck, words) => {

    let checkBox = 0;

    console.log('looking for: ' + words[0].toLowerCase());

    for (let i = 0; i < words.length; i++) {
        if (stringToCheck.toLowerCase().indexOf(words[i].toLowerCase()) !== -1) {
            checkBox++;
        }
    }

    return checkBox === words.length;
};
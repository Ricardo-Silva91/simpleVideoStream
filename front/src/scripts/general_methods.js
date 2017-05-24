/**
 * Created by Ricardo on 23/05/2017.
 */

exports.backendUrl = '';

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
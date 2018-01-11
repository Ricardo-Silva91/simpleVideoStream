/**
 * Created by Ricardo on 23/05/2017.
 */

const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');

const recursive = require("recursive-readdir");

const acceptedExtensionsMovie = [
    '.mp4',
    '.mkv'
];
const acceptedExtensionsSub = [
    '.srt'
];

exports.mustWrite = false;

const fileTypeIsAccepted = (extension, type) => {
    return (type === 'movie' ? (acceptedExtensionsMovie.indexOf(extension.toLowerCase()) !== -1) : (acceptedExtensionsSub.indexOf(extension.toLowerCase()) !== -1));
};

exports.findSomethingBySomething = function (list, something, toFind) {

    let result = -1;

    for (let i = 0; i < list.length; i++) {
        if ((typeof toFind) === "string") {
            toFind = toFind.toLowerCase();
            list[i][something] = list[i][something].toLowerCase();
        }

        //console.log('toFind: ' + toFind + ' / list: ' + list[i][something]);

        if (list[i][something] === toFind) {
            console.log(toFind + ' already exists');
            result = i;
            break;
        }
    }
    return result;

};

exports.videoDirectory_path = __dirname + '/data';
exports.dbPath = __dirname + '/db.json';

function ignoreFunc(file, stats) {
    // `file` is the absolute path to the file, and `stats` is an `fs.Stats`
    // object returned from `fs.lstat()`.
    console.log(file);
    console.log(stats);
    return acceptedExtensionsMovie.indexOf(path.extname(file)) === -1;
}

exports.refreshVideoList = () => {

    this.videoList = [];
    this.index = 0;

    recursive(this.videoDirectory_path, (err, items) => {
        if(err) {
            console.log(err);
        }
        else {
          for (let i = 0; i < items.length; i++) {
              let filePath = items[i];

              if (this.findSomethingBySomething(this.videoList, 'original_name', path.parse(filePath).name) === -1) {
                  if (fileTypeIsAccepted(path.extname(items[i]), 'movie')) {

                      this.videoList.push({
                          id: this.index++,
                          original_name: path.parse(filePath).name,
                          name: path.parse(filePath).name,
                          pathToVideo: path.normalize(filePath),
                          type: 'file'
                      });

                      this.mustWrite = true;
                  }
                  else {
                      console.log('Bad file type found on ' + items[i]);
                  }
              }

          }
        }



        //console.log(this.videoList[0]);

    });


/*
    fs.readdir(this.videoDirectory_path, (err, items) => {
        for (let i = 0; i < items.length; i++) {

            let filePath = this.videoDirectory_path + '/' + items[i];

            if (this.findSomethingBySomething(this.videoList, 'original_name', path.parse(filePath).name) === -1) {

                if (fs.lstatSync(filePath).isFile() === false) {

                    let videosToPush = [];

                    fs.readdir(filePath, (err, items) => {
                        //console.log(items);

                        if (items !== undefined) {
                            for (let j = 0; j < items.length; j++) {
                                if (fileTypeIsAccepted(path.extname(items[j]), 'movie') && this.findSomethingBySomething(this.videoList, 'original_name', path.basename(filePath + '/' + items[j])) === -1) {

                                    let vidToPush = {
                                        id: this.index++,
                                        original_name: path.basename(filePath + '/' + items[j]),
                                        name: path.parse(filePath + '/' + items[j]).name,
                                        pathToSub: [],
                                        type: 'dir',
                                        pathToPic: null
                                    };


                                    vidToPush.pathToVideo = path.normalize(filePath + '/' + items[j]);

                                    //console.log(vidToPush.original_name);

                                    videosToPush.push(vidToPush);

                                }
                            }
                        }

                        //this.videoList.push(vidToPush);
                        this.videoList = this.videoList.concat(videosToPush);
                        this.mustWrite = true;

                    });
                }
                else {
                    if (fileTypeIsAccepted(path.extname(items[i]), 'movie')) {

                        this.videoList.push({
                            id: this.index++,
                            original_name: path.parse(filePath).name,
                            name: path.parse(filePath).name,
                            pathToVideo: path.normalize(filePath),
                            type: 'file'
                        });

                        this.mustWrite = true;
                    }
                    else {
                        console.log('Bad file type found on ' + items[i]);
                    }
                }
            }

        }

    });

*/


};


jsonfile.readFile(this.dbPath, (err, obj) => {
    exports.db = obj;
    exports.videoList = obj.videos;
    exports.index = this.videoList.length;
    this.refreshVideoList();
});

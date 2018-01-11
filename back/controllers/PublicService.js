'use strict';

var fs = require('fs');
const express = require('express');

const variables = require('./../variables');

exports.getVideoListGET = function (args, res, next) {
    /**
     * list available videos
     * array of strings with video titles
     *
     * returns List
     **/
    var examples = {};
    examples['application/json'] = ["aeiou"];
    if (Object.keys(examples).length > 0) {
        /*
         fs.readdir(variables.videoDirectory_path, function (err, items) {
         examples = items;

         res.setHeader('Content-Type', 'application/json');
         res.end(JSON.stringify(examples, null, 2));
         });
         */
        examples = variables.videoList;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(examples, null, 2));

    } else {
        res.end();
    }
};
exports.setVideoThingPOST = function (args, res, next) {
    /**
     * list available videos
     * array of strings with video titles
     *
     * returns List
     **/
    var examples = {};
    examples['application/json'] = ["aeiou"];
    if (Object.keys(examples).length > 0) {

        const thing = args.body.value.thing;
        const new_val = args.body.value.string;
        const videoId = args.body.value.id;

        const videoPos = variables.findSomethingBySomething(variables.videoList, 'id', videoId);

        if (videoPos != -1) {
            variables.videoList[videoPos][thing] = new_val;
            variables.refreshVideoList();
            examples = {
                result: 'success'
            };
        }
        else {
            examples = {
                result: 'fail',
                message: 'bad id'
            }
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(examples, null, 2));

    } else {
        res.end();
    }
};

exports.refreshVideoListPOST = function (args, res, next) {
    /**
     * list available videos
     * array of strings with video titles
     *
     * returns List
     **/
    var examples = {};
    examples['application/json'] = {
        result: 'success'
    };
    if (Object.keys(examples).length > 0) {
        /*
         fs.readdir(variables.videoDirectory_path, function (err, items) {
         examples = items;

         res.setHeader('Content-Type', 'application/json');
         res.end(JSON.stringify(examples, null, 2));
         });
         */
        variables.refreshVideoList();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(examples, null, 2));

    } else {
        res.end();
    }
};

exports.getWatchVideoGET = function (args, res, next, req) {
    /**
     * watch a video
     * get a video stream
     *
     * videoTitle String the video name
     * returns Object
     **/
    let examples = {};
    examples['application/json'] = "{}";
    if (Object.keys(examples).length > 0) {

        //console.log(args.videoTitle.value);

        const videoId = args.videoId.value;

        const videoPos = variables.findSomethingBySomething(variables.videoList, 'id', videoId);

        if (videoPos !== -1) {
            const path = variables.videoList[videoPos].pathToVideo;

            fs.stat(path, (err, stats) => {
                if (err) {
                    console.log(err);
                    return res.status(404).end('<h1>Movie Not found</h1>');
                }
                else {

                    const {range} = req.headers;
                    const {size} = stats;
                    const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
                    const end = size - 1;
                    const chunkSize = (end - start) + 1;

                    res.set({
                        'Content-Range': `bytes ${start}-${end}/${size}`,
                        'Accept-Ranges': 'bytes',
                        'Content-Length': chunkSize,
                        'Content-Type': 'video/mp4'
                    });

                    res.status(206);

                    const stream = fs.createReadStream(path, {start, end});
                    stream.on('open', () => stream.pipe(res));
                    stream.on('error', (streamErr) => res.end(streamErr));
                }
            });

        }
        else {
            examples = {
                result: "fail",
                code: 0,
                message: "video not found",
                fields: "videoId"
            };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples, null, 2));
        }
    }

};

exports.rootGET = function (args, res, next) {
    /**
     * nothing
     * just to see if server is awake.
     *
     * returns String
     **/
    var examples = {};
    examples['application/json'] = "videoStream says: good evening...";
    if (Object.keys(examples).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
        res.end();
    }
};

exports.getVideoSubsGET = function (args, res, next) {
    /**
     * list available videos
     * array of strings with video titles
     *
     * returns List
     **/
    var examples = {};
    examples['application/json'] = ["aeiou"];
    if (Object.keys(examples).length > 0) {

        const videoId = args.videoId.value;

        const videoPos = variables.findSomethingBySomething(variables.videoList, 'id', videoId);

        if (videoPos != -1) {

            console.log('reading ' + variables.videoList[videoPos].pathToSub[0]);

            fs.readFile(variables.videoList[videoPos].pathToSub[0], 'utf8', function(err, data) {
                if (err) throw err;
                examples = data;
                res.setHeader('Content-Type', 'text/plain');
                res.end(examples);
            });
        }
        else {
            examples = {
                result: "fail",
                code: 0,
                message: "video not found",
                fields: "videoId"
            };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples, null, 2));
        }


    } else {
        res.end();
    }
};


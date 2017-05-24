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

        fs.readdir(variables.videoDirectory_path, function (err, items) {
            examples = items;

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples, null, 2));
        });
    } else {
        res.end();
    }
}

exports.getWatchVideoGET = function (args, res, next, req) {
    /**
     * watch a video
     * get a video stream
     *
     * videoTitle String the video name
     * returns Object
     **/
    var examples = {};
    examples['application/json'] = "{}";
    if (Object.keys(examples).length > 0) {

        //console.log(args.videoTitle.value);

        const videoTitle = args.videoTitle.value;

        fs.readdir(variables.videoDirectory_path, function (err, items) {

            if (items.indexOf(videoTitle) != -1) {

                var path = variables.videoDirectory_path + '/' + videoTitle;

                fs.stat(path, (err, stats) => {
                    if (err) {
                        console.log(err);
                        return res.status(404).end('<h1>Movie Not found</h1>');
                    }
                    // Variáveis necessárias para montar o chunk header corretamente

                    const {range} = req.headers;
                    const {size} = stats;
                    const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
                    const end = size - 1;
                    const chunkSize = (end - start) + 1;
                    // Definindo headers de chunk

                    res.set({
                        'Content-Range': `bytes ${start}-${end}/${size}`,
                        'Accept-Ranges': 'bytes',
                        'Content-Length': chunkSize,
                        'Content-Type': 'video/mp4'
                    });

                    // É importante usar status 206 - Partial Content para o streaming funcionar
                    res.status(206);
                    // Utilizando ReadStream do Node.js
                    // Ele vai ler um arquivo e enviá-lo em partes via stream.pipe()
                    const stream = fs.createReadStream(path, {start, end});
                    stream.on('open', () => stream.pipe(res));
                    stream.on('error', (streamErr) => res.end(streamErr));
                });

            }
            else {
                examples = {
                    result: "fail",
                    code: 0,
                    message: "video not found",
                    fields: "videoTitle"
                };
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(examples, null, 2));
            }
        });

    } else {
        res.end();
    }
}

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
}


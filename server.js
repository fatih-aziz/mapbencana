import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import Promise from 'bluebird';
import parser from 'xml2json-light';
import request from 'request';
const Client = require('node-rest-client').Client;
import fetch from 'node-fetch';
import {
    DataSnapshot
} from 'firebase-functions/lib/providers/database';
fetch.Promise = Promise;

let rest = new Client();

// Get data from bmkg
let getBmkg = function () {
    return new Promise(function (resolve, reject) {
        rest.get("http://data.bmkg.go.id/gempaterkini.xml", (data, res) => resolve(data.Infogempa.gempa)).on('error', (err) => reject(err));
    });
}

// initializing firebase database connection
var admin = require('firebase-admin');
var serviceAccount = require("./private_key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://surveysensor-55f21.firebaseio.com"
});
const db = admin.database();
// get collection
const ref = db.ref("/surveydarisensor");

let getDb = function () {
    return new Promise(function (resolve, reject) {
        ref.on('value', DataSnapshot => {
            var newData = [];
            DataSnapshot.forEach(childSnapshot => {
                newData.push(childSnapshot.val());
            })
            resolve(newData);
        })
    })
}

// initializing API
const app = express();
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:7000");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.get('/api/v1/map/init', (req, res) => {
    res.setHeader("content-type", "application/javascript");
    request.get(`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=visualization&callback=initMap`)
        .pipe(res);
})

app.get('/api/v1/map/get/multisource', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    Promise.join(getBmkg(), getDb(), function (bmkg, db) {
        db = db.map((data) => {
            return {
                idUser: data.iduser,
                nama: data.nama,
                mag: parseFloat(data.magnitudo),
                time: `${data.tanggalgempa} ${data.waktugempa}`,
                reportTime: data.waktupelaporan,
                newslink: null,
                mmi: data.mmi,
                quiz: data.kuesioner,
                address: data.alamat,
                coords: [parseFloat(`${data.bujurgempa}0000`), parseInt(`${data.lintanggempa}0000`)],
            }
        });
        bmkg = bmkg.map((data) => {
            var cords = data.point.coordinates.split(',');
            return {
                idUser: null,
                nama: null,
                mag: parseFloat(data.Magnitude),
                time: `${data.Tanggal} ${data.Jam}`,
                reportTime: null,
                newslink: null,
                mmi: null,
                quiz: null,
                address: data.Wilayah,
                coords: [parseFloat(`${cords[0]}0000`), parseInt(`${cords[1]}0000`)],
            }
        });
        var data = db.concat(bmkg);
        res.status(200).send({
            success: true,
            data: data
        })
    }).catch((TypeError, errFn) => {
        console.log(TypeError, errFn);
    })
})

app.get('/api/v1/map/get/bmkg', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    getBmkg()
        .then(bmkg => {
            res.status(200).send({
                success: true,
                data: bmkg
            })
        })
        .catch(err => {
            if (err.code == "ENOTFOUND")
                res.status(404).send({
                    error: `${err.hostname}: 404 - NOT FOUND`
                });
            else
                res.status(500).send({
                    error: `500 - Internal Server Error`
                });
        });
})

app.get('/api/v1/map/get/database', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    getDb()
        .then(db => {
            res.status(200).send({
                success: true,
                data: db
            })
        })
        .catch(err => {
            if (err.code == "ENOTFOUND")
                res.status(404).send({
                    error: `${err.hostname}: 404 - NOT FOUND`
                });
            else
                res.status(500).send({
                    error: `500 - Internal Server Error`
                });
        });
})
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`running on port: ${PORT}`);
})
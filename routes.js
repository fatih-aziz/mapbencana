'use strict';
import express from "express";
import * as bodyParser from "body-parser";
import "express-group-routes";
import * as dotenv from "dotenv";
dotenv.config();
import Promise from "bluebird";
import * as request from "request";
import path from 'path';
// require helpers

global.appRoot = path.resolve(__dirname);
require(appRoot + '/library/helpers');

// import model
import * as mainControl from './controllers/mainControllers';
mainControl.conLocalDb();
// initializing API
const app = express();

// middleware helper
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:7000");

    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
});
// handle views
app.group("/", (router) => {
    app.engine("html", require("ejs").renderFile);
    app.use('/assets', express.static('public'));
    app.set("view engine", "html");
    app.set("views", "./views"); // specify the views directory

    router.get('/', (req, res) => {
        res.render("index");
    })
});

app.group('/api/v1', (router) => {
    router.group('/user', router => {
        router.post('/', (req, res) => {
            console.log(req.body);

            res.status(200).send(`your data: ${req.body}`)
        })
        router.get('/', (req, res) => {
            res.send("GET USER");
            // res.render("index");
        })
    })
    router.group('/map', router => {
        router.get("/bmkg", (req, res) => {
            res.setHeader("Content-Type", "application/json");
            mainControl.bmkg()
                .then(bmkg => {
                    res.status(200).send({
                        success: true,
                        data: bmkg
                    });
                })
                .catch(err => {
                    console.log(err);

                    if (err.code == "ENOTFOUND")
                        res.status(404).send({
                            error: `${err.hostname}: 404 - NOT FOUND`
                        });
                    else
                        res.status(500).send({
                            error: `500 - Internal Server Error`
                        });
                });
        });

        router.get("/init", (req, res) => {
            res.setHeader("content-type", "application/javascript");
            request
                .get(
                    `https://maps.googleapis.com/maps/api/js?key=${
            process.env.GOOGLE_API_KEY
          }&libraries=visualization&callback=initMap`
                )
                .pipe(res);
        });

        router.get("/multisource", (req, res) => {
            res.setHeader("Content-Type", "application/json");
            mainControl.survey = function () {
                return new Promise((response, reject) => {
                    let source2 = [{
                            idUser: null,
                            nama: null,
                            mag: 5.4,
                            time: "02-Jul-19 03:39:50 WIB",
                            reportTime: null,
                            newslink: null,
                            mmi: null,
                            quiz: null,
                            address: "101 km TimurLaut MALUKUBRTDAYA",
                            coords: [128.49, -7]
                        },
                        {
                            idUser: null,
                            nama: null,
                            mag: 5.4,
                            time: "02-Jul-19 03:39:50 WIB",
                            reportTime: null,
                            newslink: null,
                            mmi: null,
                            quiz: null,
                            address: "101 km TimurLaut MALUKUBRTDAYA",
                            coords: [128.49, -7]
                        }
                    ]
                    response(source2);
                })
            };
            Promise.join(mainControl.bmkg(), mainControl.survey(), function (bmkg, survey) {
                // db = db.map(data => {
                //     return {
                //         idUser: data.iduser,
                //         nama: data.nama,
                //         mag: parseFloat(data.magnitudo),
                //         time: `${data.tanggalgempa} ${data.waktugempa}`,
                //         reportTime: data.waktupelaporan,
                //         newslink: null,
                //         mmi: data.mmi,
                //         quiz: data.kuesioner,
                //         address: data.alamat,
                //         coords: [
                //             parseFloat(`${data.bujurgempa}0000`),
                //             parseInt(`${data.lintanggempa}0000`)
                //         ]
                //     };
                // });
                bmkg = bmkg.map(data => {
                    var cords = data.point.coordinates.split(",");
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
                        coords: [parseFloat(`${cords[0]}0000`), parseInt(`${cords[1]}0000`)]
                    };
                });
                var data = {
                    bmkg: bmkg,
                    db: survey,
                };
                res.status(200).send({
                    success: true,
                    data: data
                });
            }).catch((TypeError, errFn) => {
                console.log(TypeError, errFn);
            });
        });
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`running on port: ${PORT}`);
});
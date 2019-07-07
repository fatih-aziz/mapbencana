/* eslint-disable indent */
/* eslint-disable no-unused-vars */
// import mysql from "mysql";
// eslint-disable-next-line no-undef
const model = require(appRoot + '/models/index.js')
let bmkg = function () {
    return new Promise((acc, rej) => {
        rp.get('http://data.bmkg.go.id/gempaterkini.xml')
            .then(res => xml2js(res).Infogempa.gempa)
            .then(fromRp => acc(fromRp))
            .catch(err => {
                rej(err)
            })
    })
}
// make public functions
module.exports = {
    constructor: function (a, b) {},
    // controll lapor
    lapor: {
        post: (req, res) => {
            model.lapor.create({
                nama: req.body.nama,
                iduser: req.body.iduser,
                lat: req.body.lat,
                lng: req.body.lng,
                quiz: req.body.quiz,
                mmi: req.body.mmi,
                tempat: req.body.tempat,
                waktukejadian: req.body.waktukejadian,
                wakpelaporan: req.body.waktupelaporan,
            }, (err, result) => {
                if (err)
                    res.status(400).send({
                        status: false,
                        msg: 'Save data error',
                        err: err,
                        data: result
                    })
                res.status(200).send({
                    status: true,
                    msg: 'Save data success',
                    data: result
                })
            })
        },
        index: (req, res) => {
            model.lapor.get((err, result) => {
                res.status(200).send({
                    success: true,
                    data: result
                })
            })
        }
    },
    // controll bmkg
    bmkg: {
        sync: function (req, res) {
            bmkg().then(data => {
                model.terkini.sync(data, (err, result) => {
                    res.status(200).send({
                        success: true,
                        data: result
                    })
                })
            })
        },
        get: function (req, res) {
            res.setHeader('Content-Type', 'application/json')
            bmkg().then(data => {
                res.status(200).send({
                    success: true,
                    data: data
                })
            }).catch(err => {
                if (err.code == 'ENOTFOUND')
                    res.status(404).send({
                        error: `${err.hostname}: 404 - NOT FOUND`
                    })
                else
                    res.status(500).send({
                        error: '500 - Internal Server Error'
                    })
            })
        }
    },
    multiSource: {
        get: function (req, res) {
            // let laporAsync = Promise.promisifyAll(model.lapor)
            // let bmkgAsync = bmkg
            // let terkiniAsync = Promise.promisifyAll(model.terkini)
            // console.log(laporAsync)
            // console.log(bmkgAsync)
            // console.log(terkiniAsync)
            res.setHeader('Content-Type', 'application/json')
            let mergeData = {}
            bmkg().then(data => {
                mergeData.bmkg = formatData(data, 'bmkg')
            }).then(() => {
                res.status(200).send({
                    status: true,
                    data: mergeData
                })
            }).catch(err => {
                if (err.code == 'ENOTFOUND')
                    res.status(404).send({
                        status: false,
                        msg: `${err.hostname}: 404 - NOT FOUND`,
                        err: err
                    })
                else
                    res.status(500).send({
                        status: false,
                        msg: '500 - Internal Server Error',
                        err: err
                    })
            })
        }
    }
}
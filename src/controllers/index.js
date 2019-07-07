/* eslint-disable indent */
/* eslint-disable no-unused-vars */
// import mysql from "mysql";
// eslint-disable-next-line no-undef
const model = require(appRoot + '/models/index.js')
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
            (async function () {
                try {
                    let data = formatData(await model.lapor.get(), 'lapor')
                    res.status(200).send({
                        success: true,
                        data: data
                    })
                } catch (err) {
                    res.status(400).send({
                        success: false,
                        msg: 'Gagal memuat laporan gempa',
                        error: err
                    })
                }
            })()
        },
    },
    // controll bmkg
    bmkg: {
        sync: function (req, res) {
            bmkg().then(data => {
                model.terkini.sync(data, (err, result) => {
                    if (err) {
                        assert.ifError(err, 'Syncron Fail :' + err)
                        res.status(400).send({
                            success: false,
                            msg: 'Syncron Fail, Insert data fail',
                            err: err
                        })
                    } else
                        res.status(200).send({
                            success: true,
                            data: result
                        })
                })
            }).catch(err => {
                res.status(400).send({
                    success: false,
                    msg: 'Syncron Fail, BMKG Offline',
                    err: err
                })
            })
        },
        get: function (req, res) {
            res.setHeader('Content-Type', 'application/json')
            model.terkini.get().then(data => {
                    res.status(200).send({
                        status: true,
                        data: formatData(data, 'bmkg'),
                    })
                })
                .catch(err => {
                    res.status(400).send({
                        status: false,
                        msg: 'Gagal memuat database Gempa Terkini',
                        error: err
                    })
                })
        }
    },
    multiSource: {
        get: function (req, res) {
            (async function () {
                let mergeData = {}
                mergeData.gempaBmkg = formatData(await model.terkini.get(), 'bmkg') || {
                    err: 'Fail load gempa terkini'
                }
                mergeData.gempaLapor = formatData(await model.lapor.get(), 'lapor') || {
                    err: 'Fail load gempa lapor'
                }
                res.setHeader('Content-Type', 'application/json')
                res.status(200).send({
                    status: true,
                    data: mergeData
                })
            })()
        }
    }
}
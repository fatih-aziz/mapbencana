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
        post: (req, res, next) => {
            // console.log(req);
            if (req.body instanceof Array) {
                let formated = req.body.map(el => {
                    if (!el.waktukejadian || el.waktukejadian == 0)
                        el.waktukejadian = null
                    if (!el.waktupelaporan || el.waktupelaporan == 0)
                        el.waktupelaporan = dateFormat(Date(), 'isoDateTime')
                    return {
                        nama: el.nama || "anonymous",
                        iduser: el.iduser,
                        lat: el.lintang || el.lat,
                        lng: el.bujur || el.lng,
                        quiz: el.kuisioner || el.quiz,
                        mmi: el.mmi,
                        tempat: el.tempat || el.address,
                        waktukejadian: el.waktukejadian,
                        waktupelaporan: el.waktupelaporan,
                        coords: [el.bujur, el.lintang]
                    }
                });
                (async function () {
                    try {
                        let created = await model.lapor.createArray(formated)
                        if (!created)
                            next(new Error('hell'))
                        else {
                            res.status(200).send({
                                status: true,
                                data: created
                            })
                        }
                    } catch (err) {
                        assert.ifError(err, 'Gagal menyimpan data lapor')
                        res.status(400).send({
                            status: false,
                            msg: 'Gagal menyimpan data lapor',
                            error: err.toString()
                        })
                    }
                })()
            } else if (req.body.iduser) {
                if (!req.body.waktukejadian || req.body.waktukejadian == 0)
                    req.body.waktukejadian = null
                if (!req.body.waktupelaporan || req.body.waktupelaporan == 0)
                    req.body.waktupelaporan = dateFormat(Date(), 'isoDateTime')
                let data = {
                    nama: req.body.nama || "anonymous",
                    iduser: req.body.iduser,
                    lat: req.body.lintang || req.body.lat,
                    lng: req.body.bujur || req.body.lng,
                    quiz: req.body.kuisioner || req.body.quiz,
                    mmi: req.body.mmi,
                    tempat: req.body.tempat || req.body.address,
                    waktukejadian: req.body.waktukejadian,
                    bujurgempa: req.body.bujurgempa,
                    lintanggempa: req.body.lintanggempa,
                    tanggalgempa: req.body.tanggalgempa,
                    waktugempa: req.body.waktugempa,
                    waktupelaporan: req.body.waktupelaporan,
                    coords: [req.body.bujur, req.body.lintang]
                };
                (async function () {
                    try {
                        let created = await model.lapor.create(data)
                        res.status(200).send({
                            status: true,
                            value: 1,
                            message: "Terimakasih",
                            data: created
                        })
                    } catch (err) {
                        res.status(400).send({
                            status: false,
                            value: 0,
                            message: "Coba lagi"
                        })
                    }
                })()
            } else {
                res.status(400).send({
                    status: false,
                    msg: 'Gagal menyimpan data lapor. User ID kosong',
                    error: {}
                })
            }
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
                        error: err.toString()
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
                            err: err.toString()
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
                    err: err.toString()
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
                        error: err.toString()
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
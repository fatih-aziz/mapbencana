/* eslint-disable indent */
/* eslint-disable no-unused-vars */
// import mysql from "mysql";
// eslint-disable-next-line no-undef
const model = require(appRoot + '/models/index.js')
import bcrypt from 'bcrypt'
const saltRound = 10
// make public functions
module.exports = {
    admin: {
        index: (req, res) => {
            res.render('admin')
        }
    },
    user: {
        index: (req, res) => {
            (async () => {
                model.user.get()
                    .then(data => {
                        res.status(200).send({
                            status: true,
                            data: data
                        })
                    })
            })()
        },
        post: (req, res) => {
            (async () => {
                let data = req.body
                data.password = await bcrypt.hash(data.password, saltRound)
                try {
                    await model.user.create(data) || false
                    res.status(200).send({
                        value: 1,
                        status: true,
                        message: 'Register berhasil, silahkan login!'
                    })
                } catch (err) {
                    let errorMessage = "Gagal mendaftarkan user"
                    if (err.toString().match(/nama: Path `nama`/g))
                        errorMessage = "Data belum lengkap"
                    else if (err.toString().match(/expected `email` to be unique/g))
                        errorMessage = "Oopps, email anda telah terdaftar sebelumnya"
                    res.status(400).send({
                        value: 0,
                        error: err.toString(),
                        status: false,
                        message: errorMessage
                    })
                }
            })()
        },
        login: (req, res) => {
            (async () => {
                let data = req.body
                try {
                    let user = await model.user.login({
                        email: data.email
                    }) || false
                    if (!user)
                        throw new Error("email not found")
                    let passw = await bcrypt.compare(data.password, user.password)
                    if (!passw)
                        throw new Error("password not match")
                    res.status(200).send({
                        value: 1,
                        status: true,
                        nama: user.nama,
                        nama: user.iduser,
                        message: 'Selamat datang! ' + user.nama
                    })
                } catch (err) {
                    let errorMessage = "Gagal mendaftarkan user"
                    if (err.toString().match(/email not found/g))
                        errorMessage = "Oopss, Username salah"
                    else if (err.toString().match(/password not match/g))
                        errorMessage = "Oopps, Password salah"
                    res.status(400).send({
                        value: 0,
                        error: err.toString(),
                        status: false,
                        message: errorMessage
                    })
                }
            })()
        }
    },
    // controll lapor
    lapor: {
        post: (req, res, next) => {
            let postData = req.body
            if (postData instanceof Array) {
                let formated = postData.map(el => {
                    if (!el.waktukejadian || el.waktukejadian == 0)
                        el.waktukejadian = null
                    if (!el.waktupelaporan || el.waktupelaporan == 0)
                        el.waktupelaporan = dateFormat(Date(), 'isoDateTime')
                    return {
                        nama: el.nama || "anonymous",
                        iduser: el.iduser,
                        lat: el.lintang || el.lat,
                        lng: el.bujur || el.lng,
                        quiz: el.kuisioner || el.kuesioner || el.quiz,
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
            } else if (postData.iduser) {
                if (!postData.waktukejadian || postData.waktukejadian == 0)
                    postData.waktukejadian = null
                if (!postData.waktupelaporan || postData.waktupelaporan == 0)
                    postData.waktupelaporan = dateFormat(Date(), 'isoDateTime')
                let data = {
                    nama: postData.nama || "anonymous",
                    iduser: postData.iduser,
                    lat: postData.lintang || postData.lat,
                    lng: postData.bujur || postData.lng,
                    quiz: postData.kuisioner || postData.quiz,
                    mmi: postData.mmi,
                    tempat: postData.tempat || postData.address,
                    waktukejadian: postData.waktukejadian,
                    bujurgempa: postData.bujurgempa,
                    lintanggempa: postData.lintanggempa,
                    tanggalgempa: postData.tanggalgempa,
                    waktugempa: postData.waktugempa,
                    waktupelaporan: postData.waktupelaporan,
                    coords: [postData.bujur, postData.lintang]
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
                    let data = formatData(await model.lapor.get(), req.query.type || 'lapor')
                    res.status(200).send({
                        success: true,
                        value: 1,
                        message: "Berhasil memuat data laporan gempa",
                        data: data
                    })
                } catch (err) {
                    res.status(400).send({
                        success: false,
                        value: 0,
                        message: 'Gagal memuat laporan gempa',
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
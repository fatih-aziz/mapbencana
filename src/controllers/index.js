/* eslint-disable indent */
/* eslint-disable no-unused-vars */
// import mysql from "mysql";
// eslint-disable-next-line no-undef
const model = require(appRoot + '/models/index.js')

// make public functions
module.exports = {
    constructor: function (a, b) {},
    // controll sensor
    lapor: {
        post: (req, res) => {
            model.lapor.create({
                nama: req.body.nama,
                iduser: req.body.iduser,
                lintang: req.body.lat,
                bujur: req.body.lng,
                quiz: req.body.quiz,
                mmi: req.body.mmi,
                time: dateFormat(new Date(), 'isoDateTime'),
            }, (err, result) => {
                if (err)
                    res.status(400).send({
                        status: false,
                        msg: 'Save data error',
                        err: err,
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
        get: function (req, res) {
            res.setHeader('Content-Type', 'application/json')
            // eslint-disable-next-line no-undef
            rp.get('http://data.bmkg.go.id/gempaterkini.xml')
                // eslint-disable-next-line no-undef
                .then(res => xml2js(res).Infogempa.gempa)
                .then(data => {
                    res.status(200).send({
                        success: true,
                        data: data
                    })
                })
                .catch(err => {
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

}
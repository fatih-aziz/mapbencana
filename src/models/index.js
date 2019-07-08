/* eslint-disable no-undef */
/* eslint-disable indent */
global.ObjectID = require('mongodb').ObjectID
import mongoose from 'mongoose'
const analisa = require('./gempaAnalisa')
const lapor = require('./gempaLapor')
const terkini = require('./gempaTerkini')
const user = require('./user')

mongoose.connect(process.env.DBMAIN_URL + process.env.DBMAIN_DB1, {
    useNewUrlParser: true
}).then(() => {

}).catch((err) => {
    console.log(err)
})
var conn = mongoose.connection
mongoose.Promise = global.Promise
// mongoose.set('debug', true);

let connA = Promise.promisifyAll(conn)
terkini.check(connA).then((res) => {
    assert.ok(res, 'Collection terkini not found')
})
analisa.check(connA).then((res) => {
    assert.ok(res, 'Collection sensor not found')
})
lapor.check(connA).then((res) => {
    assert.ok(res, 'Collection survey not found')
})
user.check(connA).then((res) => {
    assert.ok(res, 'Collection User not found')
})

module.exports = {
    terkini: terkini,
    lapor: lapor,
    analisa: analisa,
    user: user,
}
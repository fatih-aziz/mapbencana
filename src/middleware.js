'use strict'
import express from 'express'
import 'express-group-routes'
import * as dotenv from 'dotenv'
dotenv.config()
import * as parser from 'xml2json-light'
const rp = require('request-promise')
import Promise from 'bluebird'
import path from 'path'
import dateFormat from 'dateformat'

// make them global
global.fs = require('fs')
global.express = express
global.r2 = require('r2')
global.fetch = require('node-fetch')
global.dateFormat = dateFormat
global.Promise = Promise
global.xml2js = parser.xml2json
global.rp = rp
global.appRoot = path.dirname(require.main.filename)
// eslint-disable-next-line no-undef
require(appRoot + '/library/helpers')

// initializing API
const app = express()
// eslint-disable-next-line no-undef
require(appRoot + '/models/index')
// eslint-disable-next-line no-undef
require(appRoot + '/routes/index')(app)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`running on port: ${PORT}`)
})
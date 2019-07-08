'use strict'
import express from 'express'
import * as bodyParser from 'body-parser'
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
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(bodyParser.json())

app.use(function (req, res, next) {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:7000')

	// Request methods you wish to allow
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, PATCH, DELETE'
	)

	// Request headers you wish to allow
	res.setHeader(
		'Access-Control-Allow-Headers',
		'X-Requested-With,content-type'
	)

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true)

	// Pass to next layer of middleware
	next()
})

app.engine('html', require('ejs').renderFile)
app.use('/assets', express.static(appRoot + '/../public'))
app.set('view engine', 'html')
app.set('views', appRoot + '/views')

// import middleware
// eslint-disable-next-line no-undef
require(appRoot + '/models/index')
// eslint-disable-next-line no-undef
require(appRoot + '/routes/index')(app)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`running on port: ${PORT}`)
})
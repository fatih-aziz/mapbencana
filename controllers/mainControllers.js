import mysql from "mysql";
// load helpers
// load models
// import * as models from '../models/index';
import * as dotenv from "dotenv";
dotenv.config();
const Client = require("node-rest-client").Client;
const rest = new Client();

// make public functions
module.exports = {
    constructor: function (a, b) {},
    // Get data from bmkg
    bmkg: function () {
        return new Promise(function (resolve, reject) {
            rest
                .get("http://data.bmkg.go.id/gempaterkini.xml", (data, res) =>
                    resolve(data.Infogempa.gempa)
                )
                .on("error", err => reject(err));
        });
    },
    // get data from mongodb
    conLocalDb: function () {

    }
};
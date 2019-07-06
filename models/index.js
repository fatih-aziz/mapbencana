import * as dotenv from "dotenv";
dotenv.config();
// import Double from '@mongoosejs/double';
import sensor from './gempaSensor';
import mongoose from 'mongoose';
let conn = mongoose.connect(process.env.DBMAIN_URL + process.env.DBMAIN_DB1, {
    useNewUrlParser: true
});
var db = mongoose.connection
mongoose.Promise = global.Promise;
mongoose.set('debug', true);

process.exit(1);
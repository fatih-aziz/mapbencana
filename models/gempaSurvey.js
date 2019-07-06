import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const gempaSchema = new mongoose.Schema({
    mag: {
        type: Number,
    },
});

module.exports = {
    sensor: mongoose.model('gempasensors', gempaSchema),
    survey: mongoose.model('gempasensors', gempaSchema),
    terkini: mongoose.model('gempasensors', gempaSchema),
    get: function (callback, limit) {
        // this..find(callback).limit(limit);
    },
    create: function (data) {
        // const model = new this.Gempa(data);
        // model.save();
    }
}
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const gempaSchema = new mongoose.Schema({
    mag: {
        type: Number,
    },
});

module.exports = {
    sensor: mongoose.model('gempasensors', gempaSchema),
    get: function (callback, limit) {
        this.sensor.find(callback).limit(limit);
    },
    create: function (data) {
        const model = new this.sensor(data);
        model.save();
    }
}
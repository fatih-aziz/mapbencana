import mongoose from 'mongoose'

const gempaSchema = new mongoose.Schema({
	lat: {
		alias: 'lintang',
		type: String,
	},
	lng: {
		alias: 'bujur',
		type: String,
	},
	coords: Object,
	address: {
		alias: 'tempat',
		type: String
	},
	mag: Number,
	deep: Number,
	disasterDate: {
		type: Date,
		alias: 'waktukejadian',
	},
	createdDate: {
		type: Date,
	},
})
const terkini = mongoose.model('gempaterkini', gempaSchema)
module.exports = {
	model: terkini,
	check: function (conn) {
		let model = this.model
		return isCollectionExist(conn, model)
	},

	find: function (opt, call) {
		this.model.find(opt, call)
	},

	get: function (call, limit) {
		this.model.find(call).limit(limit)
	},

	create: function (data) {
		console.log(data)
		// const model = new this.model(data)
		// model.save()
	},
	sync: function (data, call) {
		this.model.deleteMany({}, (err, res) => {
			if (err)
				assert.ifError(err)
			else {
				let formated = data.mapInLoop(el => {
					let split = el.point.coordinates.split(',')
					return {
						lat: el.Lintang,
						lng: el.Bujur,
						coords: [split[1], split[0], ],
						address: el.Wilayah,
						mag: el.Magnitude,
						deep: el.Kedalaman,
						disasterDate: el.Tanggal + ' ' + el.Jam,
						createdDate: dateFormat(new Date(), 'isoDateTime'),
					}
				})
				this.model.insertMany(formated, call)
			}
		})
	}
}
export default terkini
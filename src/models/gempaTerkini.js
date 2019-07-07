import mongoose from 'mongoose'

const gempaSchema = new mongoose.Schema({
	Tanggal: {
		type: String,
	},
	Jam: {
		type: String,
	},
	Bujur: {
		type: String,
	},
	point: {
		type: Object,
	},
	Lintang: {
		type: String,
	},
	Magnitude: {
		type: String,
	},
	Kedalaman: {
		type: String,
	},
	_symbol: {
		type: String,
	},
	Wilayah: {
		type: String,
	}
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
		const model = new this.model(data)
		model.save()
	}
}
export default terkini
import mongoose from 'mongoose'

const gempaSchema = new mongoose.Schema({
	origine_time: {
		type: Date,
		required: true,
	},
	kondisi: String,
	intesitas: {
		type: String,
		alias: 'mmi'
	},
	magnitude: {
		type: Number,
		alias: 'mag'
	},
	latitude: {
		type: Number,
		alias: 'lat'
	},
	longitude: {
		type: Number,
		alias: 'lng'
	},
	createdDate: {
		type: Number,
		alias: 'create'

	},
})
const analisa = mongoose.model('gempaanalisa', gempaSchema)
module.exports = {
	model: analisa,
	check: function (conn) {
		let model = this.model
		// eslint-disable-next-line no-undef
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
export default analisa
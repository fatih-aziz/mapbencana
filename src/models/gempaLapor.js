import mongoose from 'mongoose'

const gempaSchema = new mongoose.Schema({
	nama: {
		type: String,
		required: true,
	},
	iduser: {
		type: Number,
		required: true,
	},
	lintang: {
		type: Number,
	},
	bujur: {
		type: Number,
	},
	tempat: {
		type: String
	},
	kuisioner: {
		type: String,
		alias: 'quiz',
	},
	mmi: {
		type: String,
	},
	time: {
		type: Date,
		alias: 'reportTime',
	},
})
const lapor = mongoose.model('gempalapor', gempaSchema)
module.exports = {
	model: lapor,
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

	create: function (data, call) {
		const model = new this.model(data)
		model.save(call)
	}
}
export default lapor
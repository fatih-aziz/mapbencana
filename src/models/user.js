import mongoose from 'mongoose'

const gempaSchema = new mongoose.Schema({
	mag: {
		type: Number,
	},
})
const sensor = mongoose.model('User', gempaSchema)
module.exports = {
	model: sensor,
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
export default sensor
import mongoose from 'mongoose'

const gempaSchema = new mongoose.Schema({})
const analisa = mongoose.model('gempaanalisa', gempaSchema)
module.exports = {
	model: analisa,
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
export default analisa
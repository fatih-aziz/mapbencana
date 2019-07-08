import mongoose from 'mongoose'
import uniqueValid from 'mongoose-unique-validator'
const AutoIncrement = require('mongoose-sequence')(mongoose)

const userSchema = new mongoose.Schema({
	nama: {
		type: String,
		required: true,
	},
	alamat: {
		type: String
	},
	notelp: {
		type: String
	},
	jenkel: {
		type: String,
	},
	email: {
		type: String,
		index: true,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true,
	},
	leveluser: {
		type: String
	},
})

userSchema.plugin(uniqueValid)
userSchema.plugin(AutoIncrement, {
	inc_field: 'iduser'
})

const user = mongoose.model('user', userSchema)
module.exports = {
	model: user,
	check: function (conn) {
		let model = this.model
		// eslint-disable-next-line no-undef
		return isCollectionExist(conn, model)
	},

	find: function (opt, call) {
		this.model.find(opt, call)
	},

	get: async function (opt, limit) {
		return await this.model.find(opt).limit(limit)
	},

	login: async function (opt) {
		return await this.model.findOne(opt)
	},

	create: async function (data) {
		const model = new this.model(data)
		return await model.save()
	}

}
export default user
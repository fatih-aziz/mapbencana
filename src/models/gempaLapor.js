import mongoose from 'mongoose'

const gempaSchema = new mongoose.Schema({
	name: {
		type: String,
		alias: 'nama',
		required: true
	},
	iduser: {
		type: Number,
		required: true,
	},
	lat: {
		alias: 'lintang',
		type: Number,
	},
	lng: {
		alias: 'bujur',
		type: Number,
	},
	mag: {
		type: String,
		alias: 'magnitudo'
	},
	lintanggempa: {
		type: String,
	},
	bujurgempa: {
		type: String,
	},
	tanggalgempa: {
		type: String,
	},
	waktugempa: {
		type: String,
	},
	coords: Object,
	address: {
		alias: 'tempat',
		type: String
	},
	quiz: {
		type: String,
		alias: 'kuisioner',
	},
	mmi: {
		type: String,
	},
	disasterDate: {
		type: String,
		alias: 'waktukejadian',
	},
	createdDate: {
		type: String,
		alias: 'waktupelaporan',
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

	get: async function (limit) {
		try {
			return await this.model.find({}).limit(limit)
		} catch (err) {
			assert.ifError(err, 'Gagal mengambil database lapor gempa')
			throw new Error('Gagal mengambil database lapor gempa' + err)
		}
	},

	createArray: async function (data) {
		try {
			return await this.model.insertMany(data)
		} catch (err) {
			throw new Error(err)
		}
	},

	create: async function (data) {
		const model = new this.model(data)
		return await model.save()
	}
}
export default lapor
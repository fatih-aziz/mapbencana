import mongoose from 'mongoose'

const gempaSchema = new mongoose.Schema({
	name: {
		type: String,
		alias: 'nama',
		required: true,
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
		type: Date,
		alias: 'waktukejadian',
	},
	createdDate: {
		type: Date,
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
			assert.ifError(err, 'Delete data fail')
			throw new Error("Delete data fail! " + err)
		}
	},

	create: function (data, call) {
		data.coords = [data.lat, data.lng]
		data.waktupelaporan = data.waktupelaporan || dateFormat(new Date(), 'isoDateTime')
		const model = new this.model(data)
		model.save(call)
	}
}
export default lapor
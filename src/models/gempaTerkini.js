/* eslint-disable no-undef */
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
	mag: String,
	deep: String,
	disasterDate: {
		type: String,
		alias: 'waktukejadian',
	},
	createdDate: {
		type: Date,
	},
})

async function bmkg() {
	try {
		let resp = await r2('http://data.bmkg.go.id/gempaterkini.xml').text
		return xml2js(resp).Infogempa.gempa
	} catch (err) {
		throw new Error(err)
	}
}

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

	get: async function (opt) {
		try {
			let data = await bmkg()
			if (data) {
				let del = await this.model.deleteMany({})
				if (!del.ok) {
					assert.ifError(err, 'Delete data fail')
					throw new Error("Delete data fail!")
				}
				let formated = data.map(el => {
					let split = el.point.coordinates.split(',')
					return {
						lat: el.Lintang,
						lng: el.Bujur,
						coords: [split[0], split[1]],
						address: el.Wilayah,
						mag: el.Magnitude,
						deep: el.Kedalaman,
						disasterDate: el.Tanggal + ' ' + el.Jam,
						createdDate: dateFormat(new Date(), 'isoDateTime'),
					}
				})
				return await this.model.insertMany(formated)
			}
		} catch (err) {
			assert.ifError(err, 'Syncronize Failure: ' + err)
			return await this.model.find(opt)
		}
	},

	createMany: function (data, call) {
		this.model.insertMany(data, call)
	},

	create: function (data, call) {
		this.model.insert(data, call)
	},
}
export default terkini
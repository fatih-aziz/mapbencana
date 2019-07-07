/* eslint-disable no-prototype-builtins */
if (!Object.prototype.forInLoop) {
	Object.defineProperty(Object.prototype, 'forInLoop', {
		value: function (callback, thisArg) {
			if (this == null) {
				throw new TypeError('Not an object')
			}
			thisArg = thisArg || global
			for (var key in this) {
				if (this.hasOwnProperty(key)) {
					callback.call(thisArg, this[key], key, this)
				}
			}
		}
	})
}

if (!Object.prototype.mapInLoop) {
	Object.defineProperty(Object.prototype, 'mapInLoop', {
		value: function (callback, thisArg) {
			let obj = this
			return Object.keys(obj).reduce(function (result, key) {
				result[key] = callback.call(thisArg, obj[key], key, obj)
				return result
			}, {})
		}
	})
}


global.die = function (msg = null) {
	console.log(msg)
	process.exit(1)
}

global.validateDb = function (data) {
	let validateData = data
	return new Promise(function (resolve, reject) {
		validateData.forInLoop(el => {
			if (el == null)
				return reject(new Error('Validate DB Fail'))
		})
		resolve(validateData)
	})
}

global.isCollectionExist = function (conn, model) {
	return new Promise((res, rej) => {
		conn.onAsync('connected')
			.then(() => {
				return conn.db.listCollections().toArray()
			})
			.then(list => {
				let found = false
				list.forEach(el => {
					if (el.name == model.collection.collectionName)
						found = true
				})
				res(found)
			})
			.catch(err => {
				rej(err)
			})
	})
}

global.formatData = function (data, type) {
	if (type == 'lapor') {
		data.mapInLoop((res) => {
			return {
				idUser: data.iduser,
				nama: data.nama,
				mag: null,
				time: '02-Jul-19 03:39:50 WIB',
				reportTime: data.reportTime,
				newslink: null,
				mmi: null,
				quiz: data.quiz,
				address: '101 km TimurLaut MALUKUBRTDAYA',
				coords: [128.49, -7]
			}
		})
	}
}
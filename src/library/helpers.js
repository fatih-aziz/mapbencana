/* eslint-disable no-undef */
/* eslint-disable no-prototype-builtins */
import formatcoords from 'formatcoords'

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
		// direct map cuz data already array 
		return data.map(el => {
			if (el.coords instanceof Array) {
				let formatCord = formatcoords(el.coords.join()).format('-d', {
					latLonSeparator: ','
				})
				let split = formatCord.split(',')
				el.coords = [split[0], split[1]]
			}
			return el
		})
	} else if (type == 'bmkg') {
		// direct map cuz data already array 
		return data.map(el => {
			let formatCord = formatcoords(el.coords.join()).format('-d', {
				latLonSeparator: ','
			})
			let split = formatCord.split(',')
			el.coords = [split[0], split[1]]
			return el
		})
	}
}

global.saveJson = function (filename, obj, callback) {
	let path = appRoot + '/../tmp/' + filename
	fs.readFile(path, 'utf8', function readFileCallback(err, data) {
		if (err || !data) {
			let cont = []
			cont.push(obj)
			let json = JSON.stringify(cont)
			if (callback)
				fs.writeFile(path, json, 'utf8', callback)
			else
				fs.writeFile(path, json, 'utf8', (err) => {
					if (err)
						console.log(err)
				})
		} else {
			let cont = JSON.parse(data)
			cont.push(obj)
			let json = JSON.stringify(cont)
			if (callback)
				fs.writeFile(path, json, 'utf8', callback)
			else
				fs.writeFile(path, json, 'utf8', (err) => {
					if (err)
						console.log(err)
				})
		}
	})
}

global.assert = {
	saveToJson: function name(msg) {
		console.log(msg)
		saveJson('error.json', {
			msg: new Error(msg).toString(),
			createdDate: dateFormat(new Date(), 'isoDateTime')
		})
	},
	ok: function (cond, msg) {
		if (!cond) this.saveToJson(msg)
	},
	ifError: function (cond, msg) {
		if (cond) this.saveToJson(msg)
	}
}
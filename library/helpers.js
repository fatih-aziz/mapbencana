if (!Object.prototype.forInLoop) {
	Object.defineProperty(Object.prototype, 'forInLoop', {
		value: function (callback, thisArg) {
			if (this == null) {
				throw new TypeError('Not an object');
			}
			thisArg = thisArg || global;
			for (var key in this) {
				if (this.hasOwnProperty(key)) {
					callback.call(thisArg, this[key], key, this);
				}
			}
		}
	});
}

if (!Object.prototype.mapInLoop) {
	Object.defineProperty(Object.prototype, 'mapInLoop', {
		value: function (callback, thisArg) {
			let obj = this;
			return Object.keys(obj).reduce(function (result, key) {
				result[key] = callback.call(thisArg, obj[key], key, obj);
				return result
			}, {})
		}
	});
}


function die(msg = null) {
	console.log(msg);
	process.exit(1);
}

function validateDb(data) {
	var data = data;
	return new Promise(function (resolve, reject) {
		data.forInLoop(el => {
			if (el == null)
				return reject(new Error("Validate DB Fail"));
		});
		resolve(data);
	})
}

module.exports = {
	die: die,
	validateDb: validateDb
}
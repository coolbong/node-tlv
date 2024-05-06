/**
 * Created by coolbong on 2016-03-23.
 *
 * reference
 * - http://www.openscdp.org/scsh3/tlv.html
 * - ISO7816-4 5.2 Data object
 * - EMV Card Personalization Specification July 2007 Version 1.1
 */
// TODO add input type Uint8Array
// TODO new Buffer to Buffer.from

// constant
var Dictionary = require("./Dictionary");

var setDecoder = require("./Decoder").setDecoder;

var ut = require("./util");
var toHexString = ut.toHexString;
var toBuffer = ut.toBuffer;
var toNumber = ut.toNumber;
var toAscii = ut.toAscii;
var newBuffer = ut.newBuffer;
var un = ut.un;

var strip = ut.strip;

TLV.EMV = 0x00;
TLV.DGI = 0x01;

TLV.DOL = DOL;
TLV.TL = TL;

/**
 * Create a TLV object.
 *
 * @param {string | number} tag
 * @param {string} value
 * @param {number} [encoding] TLV.EMV / TLV.DGI
 * @returns {TLV}
 * @constructor
 */
function TLV(tag, value, encoding) {
	if (!(this instanceof TLV)) {
		return new TLV(tag, value, encoding);
	}
	this.encodingMode = encoding || TLV.EMV; //number

	// parameter check
	if (this.encodingMode !== TLV.EMV && this.encodingMode !== TLV.DGI) {
		throw new Error("Not supported encoding mode");
	}

	this.tag = TLV.adjustTag(tag, this.encodingMode); //string
	this.value = TLV.adjustValue(value); //string
	this.length = this.value.length / 2; //number

	//to buffer
	if (Buffer.isBuffer(value)) {
		this.bValue = newBuffer(value);
	} else {
		this.bValue = newBuffer(this.value);
	}

	// buffered data
	this.bTag = newBuffer(this.tag);
	this.bLength = TLV.getBufferLength(this.length, this.encodingMode);
	//size:  tag length , length length, value length
	//Combined length of tag, length and value field
	this.size = this.bTag.length + this.bLength.length + this.bValue.length;

	var offset = 0;
	var child;
	this.info = {};
	this.child = [];

	if (this.encodingMode === TLV.DGI) {
		// it's not spec.
		if (this.bValue[0] === 0x70 || this.tag == "9102") {
			this.info.encoding = "constructed";
			this.isConstructed = true;
			while (offset < this.length) {
				child = TLV.parse(this.bValue.slice(offset));
				offset += child.size;
				this.child.push(child);
			}
		} else {
			this.info.encoding = "primitive";
			this.isConstructed = false;
		}
	} else {
		//info
		this.name = Dictionary.getName(this.tag);
		this.info = {};

		var CLASS_UNIVERSAL = 0x00; //0000 0000 b
		var CLASS_APPLICATION = 0x40; //0100 0000 b
		var CLASS_CONTEXT_SPECIFIC = 0x80; //1000 0000 b
		var CLASS_PRIVATE = 0xc0; //1100 0000 b

		var ENCODING_PRIMITIVE = 0x00; //0000 0000 b
		var ENCODING_CONSTRUCTED = 0x20; //0010 0000 b

		//var SUBSEQUENT_BYTE             = 0x1F; //0001 1111 b
		//var ANOTHER_SUBSEQUENT_BYTE     = 0x80; //1000 0000 b

		var tlv_class = this.bTag[0] & CLASS_PRIVATE;
		var tlv_encoding = this.bTag[0] & ENCODING_CONSTRUCTED;

		switch (tlv_class) {
			case CLASS_UNIVERSAL:
				//'00 indicates a data object of the universal class'
				this.info.clazz = "universal";
				break;
			case CLASS_APPLICATION:
				//'01 indicates a data object of the application class'
				this.info.clazz = "application";
				break;
			case CLASS_CONTEXT_SPECIFIC:
				//'10 indicates a data object of the application class'
				this.info.clazz = "context specific";
				break;
			case CLASS_PRIVATE:
				//'11 indicates a data object of the application class'
				this.info.clazz = "private";
				break;
		}

		if (tlv_encoding === ENCODING_PRIMITIVE) {
			//'bit 6 value 0 indicates a primitive encoding'
			this.info.encoding = "primitive";
			this.isConstructed = false;
		} else {
			//'bit 6 value 1 indicates a constructed encoding'
			this.info.encoding = "constructed";
			this.isConstructed = true;
		}

		setDecoder(this);

		if (this.isConstructed) {
			while (offset < this.length) {
				child = TLV.parse(this.bValue.slice(offset));
				child.parent = this;
				setDecoder(child);
				offset += child.size;
				this.child.push(child);
			}
		}
	}
}

/**
 * Return the value of the tag field of the TLV.
 *
 * @param {string} [encoding] return type ('number' / 'hex' / 'buffer'). 'hex' is default
 * @returns {string|number|buffer} string value of the tag
 */
TLV.prototype.getTag = function (encoding) {
	//string
	if (encoding === "number") {
		return toNumber(this.tag);
	} else if (encoding === "buffer") {
		return toBuffer(this.tag);
	} else {
		return this.tag;
	}
};

/**
 * Return the value of the length field of the TLV.
 *
 * @param {string} [encoding] return type ('number' / 'hex' / 'buffer'). 'number' is default
 * @returns {number|string|buffer} the length field of the TLV.
 */
TLV.prototype.getLength = function (encoding) {
	//number
	if (encoding === "hex") {
		return toHexString(this.bLength);
	} else if (encoding === "buffer") {
		return TLV.getBufferLength(this.length, this.encodingMode);
	} else {
		return this.length;
	}
};

/**
 * Return the length of the TLV (tag + length + value)
 *
 * @returns {number} the length of the TLV
 */
TLV.prototype.getSize = function () {
	// number
	return this.size;
};

/**
 * Return the value of the value field of the TLV.
 * @param {string} [encoding] return type ('buffer' / 'hex' / 'ascii'). 'hex' is default
 * @returns {string|Buffer} the value field of the TLV.
 */
TLV.prototype.getValue = function (encoding) {
	if (encoding === "buffer") {
		//buffer
		return toBuffer(this.value);
	} else if (encoding === "ascii") {
		return toAscii(this.value);
	} else {
		//string
		return this.value;
	}
};

/**
 * Return the name of the TLV.
 *
 * @returns {string} the name of the TLV.
 */
TLV.prototype.getName = function () {
	return this.name || "";
};

/**
 * Return the value of the encoding of the TLV.
 *
 * @returns {number} TLV.EMV / TLV.DGI
 */
TLV.prototype.getEncoding = function () {
	// TLV.EMV / TLV.DGI
	return this.encodingMode;
};

/**
 * Return the value of the length field as string
 *
 * @returns {string} hex string
 */
TLV.prototype.getL = function (flag) {
	if (flag) {
		return toHexString(this.length);
	} else {
		return toHexString(this.bLength);
	}
};

/**
 * Return the value of the tag, length fields as string
 *
 * @returns {string} hex string
 */
TLV.prototype.getTL = function () {
	return this.tag + toHexString(this.bLength);
};

/**
 * Return the value of the length, value field as string
 *
 * @returns {string} hex string
 */
TLV.prototype.getLV = function (flag) {
	if (flag) {
		return toHexString(this.length) + this.value;
	} else {
		return toHexString(this.bLength) + this.value;
	}
};

/**
 * Return the value of the tag, value field as string.
 *
 * @returns {string} hex string
 */
TLV.prototype.getTV = function () {
	return this.tag + this.value;
};

/**
 * Return the value of the tag, length, value field as string.
 *
 * @returns {string} hex string
 */
TLV.prototype.getTLV = function () {
	return this.tag + toHexString(this.bLength) + this.value;
};

/**
 * Print the TLV structure.
 *
 * @param {number} [indent] tab space
 */
TLV.prototype.print = function (indent) {
	if (this.length === 0) {
		return;
	}

	var tab = "\t";
	indent = indent || 0;

	var prefix = "";
	for (var i = 0; i < indent; i++) {
		prefix += tab;
	}

	var tld = this.tag + " " + toHexString(this.bLength) + " (" + this.length + ")";

	if (this.name !== undefined) {
		tld = tld + " [" + this.name + "]";
	}

	console.log(prefix + tld);

	//value

	if (this.child.length !== 0) {
		this.child.forEach(function (child) {
			child.print(indent + 1);
		});
	} else {
		console.log(prefix + tab + this.value);

		if (this.desc) {
			var arr = this.desc(this);
			if (arr.length !== 0) {
				console.log(prefix + tab + arr.join("\n" + prefix + tab));
			}
		}
	}
};

TLV.prototype.print2 = function (indent) {
	if (this.length === 0) {
		return;
	}

	var tab = "\t";
	indent = indent || 0;

	var prefix = "";
	for (var i = 0; i < indent; i++) {
		prefix += tab;
	}

	//var tld = this.tag + ' ' + toHexString(this.bLength) + ' (' + this.length + ')';

	var tld = "'" + this.tag + "', ";

	var tag_name = "";
	if (this.name !== undefined) {
		tag_name = " // " + this.name;
	}

	//console.log(prefix + tld);

	//value

	if (this.child.length !== 0) {
		this.child.forEach(function (child) {
			child.print2(indent + 1);
		});
	} else {
		//console.log(prefix + tab + this.value);
		console.log("TLV(" + tld + "'" + this.value + "'), " + tag_name);

		if (this.desc) {
			var arr = this.desc(this);
			// if (arr.length !== 0) {
			//     console.log(prefix + tab + arr.join('\n' + prefix + tab));
			// }
		}
	}
};

/**
 * Get child TLV objects.
 *
 * @returns {TLV[]} array of TLV
 */
TLV.prototype.getChild = function () {
	// tlv (array)
	return this.child;
};

/**
 * Find tlv object.
 *
 * @param {string | number} tag
 * @returns {TLV}
 */
TLV.prototype.find = function (tag) {
	var upperTAG = TLV.adjustTag(tag);

	var child;
	var tlv;
	for (var i = 0; i < this.child.length; i++) {
		child = this.child[i];
		if (child.tag === upperTAG) {
			return this.child[i];
		}

		if (child.isConstructed) {
			tlv = this.child[i].find(tag);
			if (tlv !== undefined) {
				return tlv;
			}
		}
	}
};

/**
 * Find tlv object.
 *
 * @param {string | number} tag
 * @returns {[TLV]]} list of tlv
 */
TLV.prototype.findAll = function (tag) {
	var upperTAG = TLV.adjustTag(tag);

	var child;
	var results = [];
	var tlv;
	for (var i = 0; i < this.child.length; i++) {
		child = this.child[i];
		if (child.tag === upperTAG) {
			results.push(child);
		}

		if (child.isConstructed) {
			tlv = child.findAll(tag);
			if (tlv.length !== 0) {
				results = results.concat(tlv);
			}
		}
	}
	return results;
};

/**
 *
 * @param {string} tlv
 * @param {string} tagToUpdate
 * @param {string} valueToUpdate
 * @param {number} encoding
 * @returns
 */
TLV.update = function (tlv, tagToUpdate, valueToUpdate, encoding = 0) {
	const constructedTLV = TLV.parse(tlv, encoding);
	const constructed = findAndReplace(constructedTLV);
	return constructed.toUpperCase();

	/**
	 * Constructs the TLV (Tag-Length-Value) value for a given tag and updates its value if found.
	 * @param {string} tlv
	 * @returns
	 */
	function findAndReplace(tlv) {
		try {
			// Tag comparison
			if (tlv.tag === tagToUpdate) {
				const constructed = `${tlv.tag}${getLengthBasedOnEncoding(tlv.tag, valueToUpdate)}${valueToUpdate}`;
				return constructed;
			}
			let constructedValue = "";
			// Iterate all the childrens
			for (let itr = 0; itr < tlv.child.length; itr++) {
				constructedValue += findAndReplace(tlv.child[itr]);
			}
			// If there is no children
			if (!constructedValue.length) return `${tlv.tag}${getLengthBasedOnEncoding(tlv.tag, tlv.value)}${tlv.value}`;
			// The values might have been changed, so constructing the value once again
			return `${tlv.tag}${getLengthBasedOnEncoding(tlv.tag, constructedValue)}${constructedValue}`;
		} catch (e) {
			throw new Error("Provided TLV is incorrect");
		}
	}
};

TLV.add = function (tlv, tagUnder, { tagToAdd, valueToAdd }, encoding = 0) {
	const constructedTLV = TLV.parse(tlv, encoding);
	const tagToUpdate = `${tagToAdd}${getLengthBasedOnEncoding(tagToAdd, valueToAdd)}${valueToAdd}`;
	const constructed = findAndAdd(constructedTLV);
	return constructed.toUpperCase();

	/**
	 * Constructs the TLV (Tag-Length-Value) value for a given tag and updates its value if found.
	 * @param {TLV} tlv
	 * @returns
	 */
	function findAndAdd(tlv) {
		try {
			const _valueToAdd = `${tagToUpdate}${tlv.value}`;
			// Tag comparison
			if (tlv.tag === tagUnder) {
				const constructed = `${tlv.tag}${getLengthBasedOnEncoding(tlv.tag, _valueToAdd)}${_valueToAdd}`;
				return constructed;
			}
			let constructedValue = "";
			// Iterate all the childrens
			for (let itr = 0; itr < tlv.child.length; itr++) {
				constructedValue += findAndAdd(tlv.child[itr]);
			}
			// If there is no children
			if (!constructedValue.length) return `${tlv.tag}${getLengthBasedOnEncoding(tlv.tag, tlv.value)}${tlv.value}`;
			// The values might have been changed, so constructing the value once again
			return `${tlv.tag}${getLengthBasedOnEncoding(tlv.tag, constructedValue)}${constructedValue}`;
		} catch (e) {
			throw new Error(`Provided TLV is incorrect: ${e.message}`);
		}
	}
};

/**
 * Provides length value based on encoding
 *
 * @param {string} tag
 * @param {string} value
 * @returns
 */
function getLengthBasedOnEncoding(tag, value) {
	const valueLengthHex = value.length / 2;
	let result;
	if (encoding === TLV.DGI) {
		if (valueLengthHex < 255) return `${convertToHexAndPad(valueLengthHex, 2)}`;
		result = `FF${convertToHexAndPad(valueLengthHex, 4)}`;
	} else {
		const bytesCount = getLengthBytesCount(value);
		result = convertToHexAndPad(valueLengthHex, bytesCount);
	}
	return result;
}

/**
 *
 * @param {string} value
 * @param {number} paddingCount
 * @returns
 */
function convertToHexAndPad(value, paddingCount) {
	return value.toString(16).padStart(paddingCount * 2, 0);
}

function getLengthBytesCount(tagValue) {
	const lengthValue = tagValue.length;

	if (lengthValue <= 127) {
		return 1;
	} else {
		let bytesCount = 1;
		let remaining = lengthValue;

		while (remaining > 0) {
			bytesCount++;
			remaining >>= 7;
		}

		return bytesCount;
	}
}

/**
 * ditto getTLV().
 *
 * @returns {string} hex string
 */
TLV.prototype.toString = function () {
	return this.getTLV();
};

/**
 * Get Child TLV objects.
 *
 * @param {string | number} tag
 * @returns {TLV[]} array of TLV
 */
TLV.prototype.getTlvByTag = function (tag) {
	var upperTAG;
	var all = false;
	if (tag === "*" || tag === "" || tag === undefined) {
		all = true;
	} else {
		upperTAG = TLV.adjustTag(tag);
	}

	var ret = [];
	var child;
	for (var i = 0; i < this.child.length; i++) {
		child = this.child[i];
		if (all === true || child.tag === upperTAG) {
			ret.push(child);
		}

		if (child.isConstructed) {
			ret = ret.concat(child.getTlvByTag(tag));
		}
	}

	return ret;
};

TLV.prototype.parseDolValue = function () {
	return DOL.parse(this.getValue());
};

// static api

/**
 * Get TLV objects.
 *
 * @param data
 * @param encoding
 * @returns {TLV[]} array of TLV
 */
TLV.parseList = function (data, encoding) {
	encoding = encoding || TLV.EMV;

	var tlv = new TLV(0x20, data, encoding); // tag for constructed encoding

	return tlv.getChild();
};
/**
 * Parse
 * @param {string | Buffer} data TAG, LENGTH, VALUE hex string
 * @param {number} [encoding] TLV.EMV / TLV.DGI
 * @returns {TLV}
 */
TLV.parse = function (data, encoding) {
	encoding = encoding || TLV.EMV;

	var buf = toBuffer(data);

	var tag;
	var lenTag;
	var length;
	var len; // byte length of length
	var value;

	// DGI TLV
	if (encoding === TLV.DGI) {
		if (buf.length < 3) {
			throw Error("Invalid data");
		}
		var pos;
		tag = toHexString(buf.slice(0, 2));

		if (buf[2] === 0xff) {
			length = (buf[3] << 8) | buf[4];
			pos = 5;
		} else {
			length = buf[2];
			pos = 3;
		}

		value = buf.slice(pos, pos + length);
		return new TLV(tag, value, encoding);
	} else {
		// EMV TLV
		lenTag = 1;
		if ((buf[0] & 0x1f) === 0x1f) {
			// subsequent byte
			var idx = 1;
			do {
				lenTag++;
				if (idx > 4) {
					throw Error("Invalid tag length");
				}
			} while ((buf[idx++] & 0x80) === 0x80); // another subsequent byte
		}

		// handle tag
		tag = toHexString(buf.slice(0, lenTag));

		var lenOffset = lenTag;

		//81, 82, 83, 84
		if ((buf[lenOffset] & 0x80) === 0x80) {
			len = (buf[lenOffset] & 0x7f) + 1;
		} else {
			len = 1;
		}

		// handle length
		if (len === 1) {
			length = buf[lenOffset];
		} else if (len === 2) {
			length = buf[lenOffset + 1];
		} else if (len === 3) {
			length = (buf[lenOffset + 1] << 8) | buf[lenOffset + 2];
		} else if (len === 4) {
			length = (buf[lenOffset + 1] << 16) | (buf[lenOffset + 2] << 8) | buf[lenOffset + 3];
		} else if (len === 5) {
			length = (buf[lenOffset + 1] << 24) | (buf[lenOffset + 2] << 16) | (buf[lenOffset + 3] << 8) | buf[lenOffset + 4];
		} else {
			throw Error("Invalid length: " + len);
		}

		//handle value
		value = buf.slice(lenTag + len, lenTag + len + length);
		return new TLV(tag, value, encoding);
	}
};

/**
 * Return value of the length field as string.
 *
 * @param {string | Buffer | number} tag
 * @returns {string} hex string
 * @constructor
 */
TLV.T = function (tag) {
	var tlv = new TLV(tag, "");
	return tlv.getTag();
};

TLV.log = function (data, encoding) {
	TLV.parse(data, encoding).print();
};

/**
 * Return value of the length field as string.
 *
 * @param {string | Buffer} value
 * @param {boolean} [flag] default false
 * @returns {string} hex string
 */
TLV.L = function (value, flag) {
	var tlv = new TLV("", value);
	return tlv.getL(flag);
};

/**
 * Return value of the length field and the value field as string
 *
 * @param {string | Buffer} value
 * @param {boolean} [flag]
 * @return {string}
 */
TLV.LV = function (value, flag) {
	var tlv = new TLV("", value);
	return tlv.getLV(flag);
};

/**
 * Return value of the value field as string
 *
 * @param value
 * @returns {string}
 * @constructor
 */
TLV.V = function (value) {
	var tlv = new TLV("", value);
	return tlv.getValue();
};

/**
 *
 * @param {string | number} tag
 * @param {string} value
 * @param {number} [encoding] TLV.EMV / TLV.DGI
 * @return {string}
 */
TLV.TLV = function (tag, value, encoding) {
	var tlv = new TLV(tag, value, encoding);
	// string
	return tlv.getTLV();
};

/**
 *
 * @param buf
 * @param encoding
 * @returns {Buffer}
 */
TLV.getBufferTag = function (buf, encoding) {
	if (buf === undefined || buf.length === 0) {
		throw Error("Invalid data");
	}

	if (encoding === TLV.DGI) {
		if (buf.length < 2) {
			throw new Error("Invalid Tag length TLV.DGI");
		}
		return buf.slice(0, 2);
	} else {
		// SUBSEQUENT_BYTE              0x1f 0b0001 1111
		// ANOTHER_SUBSEQUENT_BYTE      0x80 0b1000 0000
		var lenTag = 1;
		if ((buf[0] & 0x1f) === 0x1f) {
			// subsequent byte
			var idx = 1;
			do {
				lenTag++;
			} while ((buf[idx] & 0x80) === 0x80); // another subsequent byte

			if (idx > 4) {
				throw Error("Invalid tag length TLV.EMV");
			}
		}

		return buf.slice(0, lenTag);
	}
};

/**
 *
 * @param {number} len
 * @param {number} [encoding]
 * @returns {Buffer}
 */
TLV.getBufferLength = function (len, encoding) {
	var bLen;

	if (encoding === TLV.DGI) {
		if (len > 0xfe) {
			bLen = newBuffer(3);
			bLen[0] = 0xff;
			bLen[1] = len >>> 8;
			bLen[2] = len;
		} else {
			bLen = newBuffer(1);
			bLen[0] = len;
		}
	} else {
		// refer to Table 8 ? BER-TLV length fields in ISO/IEC 7816
		if (len < 0x80) {
			//  0x00 ~ 0x7f
			bLen = newBuffer(1);
			bLen[0] = len;
		} else if (len < 0x0100) {
			//  0x00 ~ 0xff
			bLen = newBuffer(2);
			bLen[0] = 0x81;
			bLen[1] = len;
		} else if (len < 0x010000) {
			// 0x0000~0xffff
			bLen = newBuffer(3);
			bLen[0] = 0x82;
			bLen[1] = len >>> 8;
			bLen[2] = len;
		} else if (len < 0x01000000) {
			// 0x00000000 to 0x00ffffff
			bLen = newBuffer(4);
			bLen[0] = 0x83;
			bLen[1] = len >>> 16;
			bLen[2] = len >>> 8;
			bLen[3] = len;
		} else {
			bLen = newBuffer(5);
			bLen[0] = 0x84;
			bLen[1] = len >>> 24;
			bLen[2] = len >>> 16;
			bLen[3] = len >>> 8;
			bLen[4] = len;
		}
	}

	return bLen;
};

/**
 *
 * @param {string | Buffer | number} tag
 * @param {number} [encoding]
 * @returns {string}
 */
TLV.adjustTag = function (tag, encoding) {
	tag = tag || "";

	var ret;
	if (typeof tag === "number") {
		ret = toHexString(tag);
	} else if (typeof tag === "string") {
		tag = strip(tag);
		if (tag.length === 0 || tag === "") {
			ret = "";
		} else {
			var num = toNumber(tag);
			ret = toHexString(num);
		}
	} else if (Buffer.isBuffer(tag)) {
		if (tag.length > 3) {
			throw new Error("Invalid tag length: " + tag.length);
		}
		ret = toNumber(tag); // '[00, 82]' -> 82
		ret = toHexString(ret); // 82 -> '82'
	} else {
		throw new Error("Invalid tag type");
	}

	if (encoding === TLV.DGI && ret.length !== 4) {
		// dgi tag length have to be 2 byte
		//throw Error('Invalid DGI tag');
		ret += "00";
	}

	return ret;
};

/**
 *
 * @param {string | Buffer} value
 *
 * @returns {string}
 */
TLV.adjustValue = function (value) {
	value = value || "";

	if (Buffer.isBuffer(value)) {
		return toHexString(value);
	} else if (typeof value === "string") {
		value = strip(value);
		if ((value.length & 0x01) === 0x01) {
			throw Error("Invalid value length");
		}
		return value;
	} else if (value instanceof TLV) {
		return value.toString();
	} else {
		throw Error("Invalid value type: " + typeof value);
	}
};

/**
 *
 * @param {number | string} length number or hex string
 * @returns {number}
 */
TLV.adjustLength = function (length) {
	var ret;

	length = length || 0;

	if (typeof length === "number") {
		ret = length;
	} else if (typeof length === "string") {
		length = strip(length);
		ret = toNumber(length);
	} else {
		throw new Error("Invalid tag type");
	}
	return ret;
};

/**
 * Return the name of the TLV.
 *
 * @param {number | string} tag
 * @returns {string} the name of the TLV.
 */
TLV.getName = function (tag) {
	return Dictionary.getName(toHexString(tag)) || "";
};

/**
 *
 * @param tag
 * @param length
 * @returns {TL}
 * @constructor
 */
function TL(tag, length) {
	if (!(this instanceof TL)) {
		return new TL(tag, length);
	}

	this.tag = TLV.adjustTag(tag);
	this.length = TLV.adjustLength(length);

	this.bTag = newBuffer(this.tag);
	this.bLength = TLV.getBufferLength(this.length);
	this.size = this.bTag.length + this.bLength.length;

	this.name = Dictionary.getName(this.tag);
}

/**
 * Return the value of the tag field of the TL.
 *
 * @returns {string|number} string value of the tag
 */
TL.prototype.getTag = function (type) {
	if (type === "number") {
		return toNumber(this.tag);
	} else {
		return this.tag;
	}
};

TL.prototype.getLength = function () {
	return this.length;
};

TL.prototype.getSize = function () {
	return this.size;
};

TL.prototype.getName = function () {
	return this.name;
};

TL.prototype.setValue = function (value) {
	this.value = toHexString(value);
};

TL.prototype.getTL = function () {
	return this.tag + toHexString(this.bLength);
};

TL.prototype.getL = function (flag) {
	if (flag) {
		return toHexString(this.length);
	} else {
		return toHexString(this.bLength);
	}
};

TL.prototype.toString = function () {
	return this.getTL();
};

TL.prototype.toTLV = function (value) {
	return new TLV(this.tag, value);
};

TL.prototype.print = function (indent) {
	if (this.length === 0) {
		return;
	}

	var tab = "\t";
	indent = indent || 0;

	var prefix = "";
	for (var i = 0; i < indent; i++) {
		prefix += tab;
	}

	var tld = this.tag + " " + toHexString(this.bLength) + " (" + this.length + ")";

	if (this.name !== undefined) {
		tld = tld + " [" + this.name + "]";
	}

	console.log(prefix + tld);
};

function DOL(dolData) {
	var buf = toBuffer(dolData);

	var offset = 0;
	var tag;
	var lenTag;
	var length;
	var len; // byte length of length

	this.list = [];

	do {
		lenTag = 1;
		if ((buf[offset] & 0x1f) === 0x1f) {
			// subsequent byte
			var idx = offset + 1;
			do {
				lenTag++;
			} while ((buf[idx] & 0x80) === 0x80); // another subsequent byte
		}

		// handle tag
		tag = toHexString(buf.slice(offset, offset + lenTag));
		offset += lenTag;

		var lenOffset = offset;
		len = 1;

		//81, 82, 83, 84
		if ((buf[lenOffset] & 0x80) === 0x80) {
			len = (buf[lenOffset] & 0x7f) + 1;
		}

		// handle length
		if (len === 1) {
			length = buf[lenOffset];
			offset += 1;
		} else if (len === 2) {
			length = buf[lenOffset + 1];
			offset += 2;
		} else if (len === 3) {
			length = (buf[lenOffset + 1] << 8) | buf[lenOffset + 2];
			offset += 3;
		} else if (len === 4) {
			length = (buf[lenOffset + 1] << 16) | (buf[lenOffset + 2] << 8) | buf[lenOffset + 3];
			offset += 4;
		} else if (len === 5) {
			length = (buf[lenOffset + 1] << 24) | (buf[lenOffset + 2] << 16) | (buf[lenOffset + 3] << 8) | buf[lenOffset + 4];
			offset += 5;
		} else {
			console.log("error:" + this.tag);
			return;
			//throw Error('Invalid length');
		}

		this.list.push(new TL(tag, length));
	} while (offset < buf.length);
}

DOL.prototype.print = function () {
	this.list.forEach(function (item) {
		item.print();
	});
};

DOL.prototype.setValue = function (values) {
	values = toBuffer(values);

	var offset = 0;
	var tlvlist = [];
	this.list.forEach(function (item) {
		var tag = item.getTag();
		var length = item.getLength();
		var value = un(values, offset, length);
		offset += length;

		item.setValue(value);
		tlvlist.push(new TLV(tag, value));
	});

	return tlvlist;
};

DOL.prototype.getList = function () {
	return this.list;
};

DOL.prototype.find = function (tag) {
	tag = TLV.adjustTag(tag);

	this.list.forEach(function (item) {
		if (tag === item.tag) {
			return item;
		}
	});
};

DOL.prototype.count = function () {
	return this.list.length;
};

DOL.prototype.getDolRelatedDataLength = function () {
	var len = 0;
	this.list.forEach(function (item) {
		len += item.length;
	});

	return len;
};

/**
 *
 * @param {string | Number} dolData
 * @return {DOL}
 */
DOL.parse = function (dolData) {
	return new DOL(dolData);
};

module.exports = TLV;

//FIXME add command api
//FIXME add TLV async api
//FIXME DOL to TLV API
//TODO TLV Builder
//TODO TLV Decoder

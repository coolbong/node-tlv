/**
 * Created by coolbong on 2017-02-03.
 */


/**
 * convert to Buffer
 * @param {string | Buffer | number} data
 * @return {Buffer}
 */
function toBuffer(data) {
    if (Buffer.isBuffer(data)) {
        return new Buffer(data);
    } else if (typeof data === 'string') {
        data = strip(data);
        return new Buffer(data, 'hex');
    } else if (typeof data == 'number') {
        var h = data.toString(16);
        if ((h.length & 1) == 1) {
            h = '0' + h;
        }
        return new Buffer(h, 'hex');
    } else {
        return new Buffer(0);
    }
}


/**
 * make new Buffer
 *
 * @param {string | Buffer | number} num
 * @returns {Buffer}
 */
function newBuffer(num) {
    if (Buffer.isBuffer(num)) {
        return new Buffer(num);
    } else if (typeof num === 'string') {
        return new Buffer(num, 'hex');
    } else if (typeof num === 'number') {
        var buf = new Buffer(num);
        buf.fill(0);
        return buf;
    } else {
        return new Buffer();
    }
}



/**
 * convert to hex string
 *
 * @param {number | Buffer} num
 * @returns {string}
 */
function toHexString(num) {
    num = num || 0;

    if (Buffer.isBuffer(num)) {
        return num.toString('hex').toUpperCase();
    } else {
        var h = num.toString(16).toUpperCase();
        if ((h.length & 1) == 1) {
            h = '0' + h;
        }
        return h;
    }
}


/**
 * convert to number
 *
 * @param {string | buffer | number} val
 * @returns {number}
 */
function toNumber(val) {
    val = val || '';
    var str;
    if (Buffer.isBuffer(val)) {
        str = toHexString(val);
    } else if (typeof val === 'string') {
        str = strip(val)
    } else if (typeof val === 'number'){
        return val;
    } else {
        return 0;
    }

    return parseInt(str, 16);
}


/**
 *  remove space and tab
 *
 * @param {string} str
 * @returns {string}
 */
function strip(str) {
    str = str || '';
    return str.replace(/\s+/g, '');
}

module.exports  = {
    toBuffer: toBuffer,
    newBuffer: newBuffer,
    toHexString: toHexString,
    toNumber: toNumber,
    strip: strip
};
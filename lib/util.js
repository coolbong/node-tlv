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
    } else if (typeof data === 'number') {
        var h = data.toString(16);
        if ((h.length & 1) === 1) {
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
 * @param {number | Buffer | string} num
 * @returns {string}
 */
function toHexString(num) {
    num = num || 0;

    if (Buffer.isBuffer(num)) {
        return num.toString('hex').toUpperCase();
    } else if (typeof num === 'string') {
        num = strip(num);
        if ((num.length === 0) || num === '') {
            num = '';
        }
        return num;
    } else {
        var h = num.toString(16).toUpperCase();
        if ((h.length & 1) === 1) {
            h = '0' + h;
        }
        return h;
    }
}

function toAscii(hexstr) {
    hexstr = hexstr || '';

    var buf = toBuffer(hexstr);

    return buf.toString('ascii');
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

function u1(buffer, offset, encoding) {
    encoding = encoding || 'hex';
    if (encoding === 'hex') {
        return toHexString(buffer[offset]);
    } else if (encoding === 'number') {
        return toNumber(toHexString(buffer.slice(offset, offset+2)));
    }
}

function u2(buffer, offset, encoding) {
    encoding = encoding || 'hex';
    if (encoding === 'hex') {
        return toHexString(buffer.slice(offset, offset+2));
    } else if (encoding === 'number') {
        return toNumber(toHexString(buffer.slice(offset, offset+2)));
    }
}

function un(buffer, offset, len, encoding) {
    encoding = encoding || 'hex';
    len = len || buffer.length;
    if (encoding === 'hex') {
        return toHexString(buffer.slice(offset, offset+len));
    } else if (encoding === 'number') {
        return toNumber(toHexString(buffer.slice(offset, offset+len)));
    }
}

function bitOn(number, bit) {
    return ((number & bit) === bit);
}

module.exports  = {
    toBuffer: toBuffer,
    newBuffer: newBuffer,
    toHexString: toHexString,
    toAscii: toAscii,
    toNumber: toNumber,
    strip: strip,
    u1: u1,
    u2: u2,
    un: un,
    bitOn: bitOn
};
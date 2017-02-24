/**
 * Created by coolbong on 2017-02-24.
 */

var toBuffer = require('../util').toBuffer;
var toHexString = require('../util').toHexString;
var toAscii = require('../util').toAscii;

/**
 * Application Preferred Name
 * tag: 9F12 (parent 'A5')
 *
 * @param tlv
 * @returns {Array}
 */
function ApplicationPreferredName(tlv) {
    var ascii = toAscii(tlv.getValue());


    var desc = [];
    desc.push(ascii);
    return desc;
}


/**
 * Language Preference
 * tag: 5F2D (parent 'A5')
 *
 * @param tlv
 * @returns {Array}
 */
function LanguagePreference(tlv) {
    if (!(this instanceof LanguagePreference)) {
        return new LanguagePreference(tag, value);
    }

    TLV.apply(this, arguments);

    if (this.tag !== '5F2D') {
        throw new Error('Invalid Parameter');
    }
    //5F2D 04 (4) [Language Preference]
    //6B6F656E
    //ISO639
}

LanguagePreference.prototype.desc = function() {
    var desc = [];

    var ascii = new Buffer(this.getValue(), 'hex').toString();
    desc.push(ascii);
    return desc;
};

function ApplicationLabel(tag, value) {
    if (!(this instanceof ApplicationLabel)) {
        return new ApplicationLabel(tag, value);
    }

    TLV.apply(this, arguments);

    if (this.tag !== '50') {
        throw new Error('Invalid Parameter');
    }
    //50 0C (12) [Application Label]
    //4859554E4441492056495341
}

ApplicationLabel.prototype.desc = function() {
    var desc = [];
    var ascii = new Buffer(this.getValue(), 'hex').toString();
    desc.push(ascii);
    return desc;
};

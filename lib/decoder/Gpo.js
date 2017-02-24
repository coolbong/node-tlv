/**
 * Created by coolbong on 2017-02-14.
 */

var toBuffer = require('../util').toBuffer;
var toHexString = require('../util').toHexString;
var toAscii = require('../util').toAscii;

var un = require('../util').un;

/**
 * AIP (Application Interchange Profile)
 * tag: 82 (contact)
 * tag: D8 (contactless)
 *
 * @param tlv
 * @returns {Array}
 */
function ApplicationInterchangeProfile(tlv) {
    var value = toBuffer(tlv.getValue());

    var code = value[0];
    var desc = [];
    //desc.push('Application Interchange Profile [' + tlv.getTag() + ']: ' + tlv.getValue());

    if ((code & 0x80) == 0x80) {
        desc.push('RFU');
    }

    if ((code & 0x40) == 0x40) {
        desc.push('4000 Byte 1 b7: SDA supported (Offline Static Data Authenticate)');
    }

    if ((code & 0x20) == 0x20) {
        desc.push('2000 Byte 1 b6: DDA supported (Offline Dynamic Data Authenticate)');
    }

    if ((code & 0x10) == 0x10) {
        desc.push('1000 Byte 1 b5: Cardholder verification is supported');
    }

    if ((code & 0x08) == 0x08) {
        desc.push('0800 Byte 1 b4: Terminal risk management is to be performed');
    }

    if ((code & 0x04) ==0x04) {
        desc.push('0400 Byte 1 b3: Issuer authentication is supported');
    }

    if ((code & 0x02) == 0x02) {
        desc.push('0200 Byte 1 b2: RFU');
    }

    if ((code & 0x01) == 0x01) {
        desc.push('0100 Byte 1 b1: CDA supported');
    }

    code = value[1];
    if ((code & 0x80) == 0x80) {
        desc.push('0080 Byte 2 b8: Reserved for use by the EMV Contactless Specifications');
    }

    return desc;
}

/**
 * AFL (Application File Locator)
 * '94' contact
 * 'D9' contactless
 *
 * @param tlv
 * @return {Array}
 */
function ApplicationFileLocator(tlv) {


    var buf = toBuffer(tlv.getValue());
    var len = buf.length;

    if (len % 4 !== 0) {
        return [('Invalid data length: length % 4: ' + (len % 4))]
    }

    var cnt = len / 4;
    var offset = 0;
    var items = [];

    for (var i=0; i<cnt; i++) {
        var chunk = buf.slice(offset, offset + 4); offset += 4;
        items.push(chunk);
    }

    var desc = [];
    var str;
    items.forEach(function (item) {
        str = toHexString(item);
        str += ' SFI: ' + toHexString(item[0] >> 3) + ' ';
        if (item[1] == item[2]) {
            str += ' record: ' + toHexString(item[1]);
        } else {
            str += ' record: ' + toHexString(item[1]) + ' - ' + toHexString(item[2]);
        }
        desc.push(str);
    });

    return desc
}


function GpoResp() {

}

GpoResp.ApplicationFileLocator = ApplicationFileLocator;
GpoResp.ApplicationInterchangeProfile = ApplicationInterchangeProfile;

module.exports = GpoResp;

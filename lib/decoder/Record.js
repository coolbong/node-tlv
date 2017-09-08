/**
 * Created by coolbong on 2017-02-14.
 */
var toBuffer = require('../util').toBuffer;
var toHexString = require('../util').toHexString;
var toAscii = require('../util').toAscii;
var bitOn = require('../util').bitOn;


/**
 * Track 1 Data
 * The Track 1 Data contains the data objects of the track 1 according to ISO/IEC 7813
 * Structure B, excluding start sentinel, end sentinel and LRC. The Track 1 Data may be
 * used by the terminal for authorization and clearing.
 *
 * tag: '56'
 * [Exclude] STX : Start sentinel "%"
 * FC : Format code "B" (The format described here. Format "A" is reserved for proprietary use.)
 * PAN : Primary Account Number, up to 19 digits
 * FS : Separator "^"
 * NM : Name, 2 to 26 characters (including separators, where appropriate, between surname, first name etc.)
 * FS : Separator "^"
 * ED : Expiration data, 4 digits or "^"
 * SC : Service code, 3 digits or "^"
 * DD : Discretionary data, balance of characters
 * [Exclude] ETX : End sentinel "?"
 * [Exclude] LRC : Longitudinal redundancy check, calculated according to ISO/IEC 7811-2
 *
 * @param tlv
 * @return {Array}
 */
function Track1Data(tlv) {

    var desc = [];
    var value = toAscii(tlv.getValue());
    var offset = 0;

    if (value[0] !== 'B') {
        desc.push('Invalid format code (tract 1 data): ' + value[0]);
        return desc;
    }
    desc.push('FC: ' + value[0]); offset += 1;
    var idx = value.indexOf('^');

    desc.push('PAN: ' + value.substring(offset, idx)); offset = idx;
    desc.push('FS : (Field Separator): ' + value[offset]); offset += 1;
    idx = value.indexOf('^', offset);
    desc.push('NM : (Name): ' + value.substring(offset, idx)); offset = idx;
    desc.push('FS : (Field Separator): ' + value[offset]); offset += 1;
    desc.push('ED : (Expiration data YY/MM): ' + value.substring(offset, offset+2) + '/' + value.substring(offset+2, offset+4)); offset += 4;
    desc.push('SC : (Service Code): ' + value.substring(offset, offset+3)); offset += 3;
    desc.push('DD : (Discretionary data) : ' + value.substring(offset));


    return desc;
}

/**
 * Track 2 Data
 * Track 2 Equivalent Data
 * Contains the data objects of track 2 of the magnetic stripe according to the ISO.IEC
 * 7813, excluding start sentinel, end sentinel, and longitudinal redundancy check (LRC)
 *
 * tag: '57'
 *
 * ISO/IEC 7813
 * https://en.wikipedia.org/wiki/ISO/IEC_7813#Track_2
 *
 * [Exclude] STX : Start sentinel ";"
 * PAN : Primary Account Number, up to 19 digits, as defined in ISO/IEC 7812-1
 * FS : Separator "="
 * ED : Expiration date, YYMM or "=" if not present
 * SC : Service code, 3 digits or "=" if not present
 * DD : Discretionary data, balance of available digits
 * [Exclude]ETX : End sentinel "?"
 * [Exclude]LRC : Longitudinal redundancy check, calculated according to ISO/IEC 7811-2
 *
 * @param tlv
 * @returns {Array}
 */
function Track2Data(tlv) {
    var desc = [];
    var value = tlv.getValue();
    var offset = 0;

    var idx = value.indexOf('D');
    if (idx === -1) {
        desc.push('invalid Track 2 equivalent data');
        return desc;
    }
    desc.push('PAN: ' + value.substring(offset, idx)); offset = idx;
    offset += 1; // for FS Separator 'D'
    desc.push('ED : (Expiration data YY/MM): ' + value.substring(offset, offset+2) + '/' + value.substring(offset+2, offset+4)); offset += 4;
    desc.push('SC : (Service Code): ' + value.substring(offset, offset+3)); offset += 3;
    idx = value.indexOf('F', offset);

    if (idx !== -1) {
        desc.push('DD : (Discretionary data) : ' + value.substring(offset, idx));
    }
    return desc;
}


/**
 * Track 1 Discretionary Data
 *
 * Discretionary part of track 1 according to ISO/IEC 7813
 * @param tlv
 */
function Track1DiscretionaryData(tlv) {
    var desc = [];
    desc.push(toAscii(tlv.getValue()));
    return desc;
}

/**
 * CDOL1 (Card Risk Management Data Object List 1)
 * tag: 8C
 *
 * @param tlv
 * @returns {Array}
 */
function CDOL1 (tlv) {
    var dol = tlv.parseDolValue();

    var desc = [];
    desc.push('CDOL1: 8C CDOL1 Related Data length: ' + toHexString(dol.getDolRelatedDataLength()) + ' (' + dol.getDolRelatedDataLength() + ')');
    var dolList = dol.getList();
    dolList.forEach(function (tl) {
        desc.push(tl.getTag() + ' ' + tl.getL() + ' (' + tl.getLength() + ') ' + tl.getName());
    });

    return desc;
}


/**
 * CDOL2 (Card Risk Management Data Object List 2)
 * tag: '8D'
 *
 * @param tlv
 * @returns {Array}
 */
function CDOL2 (tlv) {
    var dol = tlv.parseDolValue();
    var desc = [];
    desc.push('CDOL2: CDOL2 Related Data length: ' + toHexString(dol.getDolRelatedDataLength()) + ' (' + dol.getDolRelatedDataLength() + ')');
    var dolList = dol.getList();
    dolList.forEach(function (tl) {
        desc.push(tl.getTag() + ' ' + tl.getL() + ' (' + tl.getLength() + ') ' + tl.getName());
    });

    return desc;
}



function CVM(data) {
    var value = toBuffer(data);
    var desc = [];
    var code = value[0] & 0x3F;

    desc.push('CVM: ' + toHexString(value));
    //desc.push('CV Rule Byte 1 (Leftmost): Cardholder Verification Method (CVM) codes: ' + toHexString(this.value[0]));

    if ((value[0] & 0x40) === 0x40)  {
        desc.push('\tMove to next rule if verification is unsuccessful');
    } else {
        desc.push('\tFail cardholder verification if this CVM is unsuccessful');
    }

    if (code === 0x00) {
        desc.push('\tFail CVM processing');
    } else if (code === 0x01) {
        // 0b0000 0000
        desc.push('\tPlaintext PIN verification performed by ICC');
    } else if (code === 0x02) {
        // 0b0000 0001
        desc.push('\tEnciphered PIN verified online')
    } else if (code === 0x03) {
        // 0b0000 0011
        desc.push('\tPlaintext PIN verification performed by ICC and signature(paper)');
    } else if (code === 0x04) {
        // 0b0000 0100
        desc.push('\tEnciphered PIN verification performed by ICC');
    } else if (code === 0x05) {
        // 0b0000 0101
        desc.push('\tEnciphered PIN verification performed by ICC and signature (paper)');
    } else if (code === 0x1E) {
        // 0b0001 1110
        desc.push('\tSignature (paper)');
    } else if (code === 0x1F) {
        // 0b0001 1111
        desc.push('\tNo CVM required');
    }

    code = value[1];

    //desc.push('CV Rule Byte 2  Cardholder Verification Method (CVM)  Condition codes: ' + toHexString(this.value[1]));
    if (code === 0x00) {
        desc.push('\tAlways');
    } else if (code === 0x01) {
        desc.push('\tIf unattended cash');
    } else if (code === 0x02) {
        desc.push('\tIf not unattended cash and not manual cash and not purchase with cashback');
    } else if (code === 0x03) {
        desc.push('\tIf terminal supports the CVM');
    } else if (code === 0x04) {
        desc.push('\tIf manual cash');
    } else if (code === 0x05) {
        desc.push('\tIf purchase with cashback');
    } else if (code === 0x06) {
        desc.push('\tIf transaction is in the application currency 21 and is under X value (see section 10.5 for a discussion of X)');
    } else if (code === 0x07) {
        desc.push('\tIf transaction is in the application currency and is over X value');
    } else if (code === 0x08) {
        desc.push('\tIf transaction is in the application currency and is under Y value (see section 10.5 for a discussion of Y)');
    } else if (code === 0x09) {
        desc.push('\tIf transaction is in the application currency and is over Y value');
    }

    return desc;
}


/**
 * CVM List (Cardholder Verification Method List)
 * tag: '8E'
 *
 * @pram tlv
 * @returns {Array}
 */

function CVMList(tlv) {

    value = toBuffer(tlv.getValue());
    this.cvm = [];
    var len = value.length;

    // x : 4 byte
    this.amountX = value.slice(0, 4);
    this.amountY = value.slice(4, 8);

    var value = value.slice(8, len);

    var cnt = value.length / 2;
    var offset = 0;
    for (var i=0; i<cnt; i++) {
        var item = value.slice(offset, offset+2);
        offset += 2;
        this.cvm.push(item);
    }

    var desc = [];
    desc.push('amount x: ' + toHexString(this.amountX));
    desc.push('amount y: ' + toHexString(this.amountY));

    this.cvm.forEach(function(item) {
        desc = desc.concat(CVM(item));
        //desc = desc.concat(toHexString(item));
        //desc.push('');
    });
    return desc;
}


/**
 * Issuer Country Code
 * tag: '5F28'
 *
 * @param tlv
 * @returns {Array}
 */
function IssuerCountryCode(tlv) {

    var value = tlv.getValue();
    var issuerCountryCode = require('./json/CountryCode.json');
    var obj = issuerCountryCode[value];

    var desc = [];
    if (obj !== undefined) {
        desc.push('country info: name : ' + obj['country'] + ' (' + obj['A3'] + ')');
    } else {
        desc.push('unknown country code. plz update ISO3166.');
    }
    return desc;
}


/**
 * Service Code
 * http://www.gae.ucm.es/~padilla/extrawork/tracks.html
 * tag: '5F30'
 *
 * @param tlv
 * @returns {Array}
 */
function ServiceCode(tlv) {
    var value = tlv.getValue();

    var desc = [];
    //Digit 1 (most significant): Interchange and technology:
    var digit = parseInt(value[1]);
    var digit1InterchangeAndTech = {
        0: '0: Reserved for future use by ISO.',
        1: '1: Available for international interchange.',
        2: '2: Available for international interchange and with integrated circuit, which should be used for the financial transaction when feasible.',
        3: '3: Reserved for future use by ISO.',
        4: '4: Reserved for future use by ISO.',
        5: '5: Available for national interchange only, except under bilateral agreement.',
        6: '6: Available for national interchange only, except under bilateral agreement, and with integrated circuit, which should be used for the financial transaction when feasible.',
        7: '7: Not available for general interchange, except under bilateral agreement.',
        8: '8: Reserved for future use by ISO.',
        9: '9: Test.'
    };

    desc.push(digit1InterchangeAndTech[digit]);


    digit = parseInt(value[2]);
    var digit2AuthorizingProcessing = {
        0: '0: Transactions are authorized following the normal rules.',
        1: '1: Reserved for future use by ISO.',
        2: '2: Transactions are authorized by issuer and should be online.',
        3: '3: Reserved for future use by ISO.',
        4: '4: Transactions are authorized by issuer and should be online, except under bilateral agreement.',
        5: '5: Reserved for future use by ISO.',
        6: '6: Reserved for future use by ISO.',
        7: '7: Reserved for future use by ISO.',
        8: '8: Reserved for future use by ISO.',
        9: '9: Reserved for future use by ISO.'
    };
    desc.push(digit2AuthorizingProcessing[digit]);


    digit = parseInt(value[3]);
    var digit3RangeOfServices = {
        0: '0: No restrictions and PIN required.',
        1: '1: No restrictions.',
        2: '2: Goods and services only (no cash).',
        3: '3: ATM only and PIN required.',
        4: '4: Cash only.',
        5: '5: Goods and services only (no cash) and PIN required.',
        6: '6: No restrictions and require PIN when feasible.',
        7: '7: Goods and services only (no cash) and require PIN when feasible.',
        8: '8: Reserved for future use by ISO.',
        9: '9: Reserved for future use by ISO.'
    };

    desc.push(digit3RangeOfServices[digit]);

    return desc;
}

/**
 * Application Usage Control
 *
 * Indicates issuer's specified restrictions on the geographic usage and services allowed for the application
 * tag: '9F07'
 *
 * @param tlv
 * @returns {Array}
 */
function ApplicationUsageControl(tlv) {
    var buff = toBuffer(tlv.getValue());
    var code = buff[0];
    var desc = [];

    desc.push('byte1: ' + toHexString(code));
    if ((code & 0x80) === 0x80) {
        desc.push('\tb8 Valid for domestic cash transactions');
    }
    if ((code & 0x40) === 0x40) {
        desc.push('\tb7 Valid for international cash transactions');
    }
    if ((code & 0x20) === 0x20) {
        desc.push('\tb6 Valid for domestic goods');
    }
    if ((code & 0x10) === 0x10) {
        desc.push('\tb5 Valid for international goods');
    }
    if ((code & 0x08) === 0x08) {
        desc.push('\tb4 Valid for domestic services');
    }
    if ((code & 0x04) === 0x04) {
        desc.push('\tb3 Valid for international services');
    }
    if ((code & 0x02) === 0x02) {
        desc.push('\tb2 Valid at ATMs');
    }
    if ((code & 0x01) === 0x01) {
        desc.push('\tb1 Valid at terminals other than ATMs');
    }

    code = buff[1];
    desc.push('byte2: ' + toHexString(code));
    if ((code & 0x80) === 0x80) {
        desc.push('\tb8 Domestic cash-back allowed');
    }
    if ((code & 0x40) === 0x40) {
        desc.push('\tb7 International cash-back allowed');
    }
    return desc;
}

/**
 * IAC (Issuer Action Code)
 * tag: '9F0D': 'Default', '9F0E': Denial , '9F0F': Online
 * length: 5
 *
 * @param tlv
 * @return {Array}
 */
function IssuerActionCode(tlv) {
    var desc = [];

    var buf = tlv.getValue('buffer');

    var oneByte = buf[0];
    desc.push('Byte 1: ' + toHexString(oneByte));

    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Data authentication was not performed');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 SDA failed');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 ICC Data missing');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Card appears on terminal exception file');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 DDA failed');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 CDA failed');
    //if (bitOn(oneByte, 0x03))desc.push('\tb2-1 RFU');

    oneByte = buf[1];
    desc.push('Byte 2: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Chip card and terminal have different application versions');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Expired application');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Application not yet effective');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Requested service not allowed for card product');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 New card');
    //if (bitOn(oneByte, 0x07)) desc.push('\tb3-b1 RFU');

    oneByte = buf[2];
    desc.push('Byte 3: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Cardholder verification was not successful');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Unrecognized Cardholder Verification Method (CVM)');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 PIN Try Limit exceeded');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 PIN entry required but PIN pad not present/working');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 PIN entry required, PIN pad present but PIN not entered');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 Online PIN entered');
    //if (bitOn(oneByte, 0x03)) desc.push('\tb2-1 RFU');

    oneByte = buf[3];
    desc.push('Byte 4: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Transaction exceeds floor limit');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Lower consecutive offline limit exceeded');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Upper consecutive offline limit exceeded');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Transaction selected randomly for online processing');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 Merchant forced transaction online');
    //if (bitOn(oneByte, 0x04)) desc.push('\tb3-1 RFU');

    oneByte = buf[4];
    desc.push('Byte 5: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Default TDOL used');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Issuer Authentication was unsuccessful');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Script processing failed before final GENERATE AC');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Script processing failed after final GENERATE AC');
    //if (bitOn(oneByte, 0x0F)) desc.push('\tb4-1 RFU');

    return desc;
}



module.exports = {
    Track1Data: Track1Data,
    Track2Data: Track2Data,
    Track1DiscretionaryData: Track1DiscretionaryData,
    CDOL1 : CDOL1,
    CDOL2 : CDOL2,
    CVMList : CVMList,
    IssuerCountryCode : IssuerCountryCode,
    ServiceCode : ServiceCode,
    ApplicationUsageControl : ApplicationUsageControl,
    IssuerActionCode: IssuerActionCode
};
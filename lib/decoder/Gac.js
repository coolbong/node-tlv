/**
 * Created by coolbong on 2017-02-27.
 */
var ut = require('../util');
var toHexString = ut.toHexString;
var toBuffer = ut.toBuffer;
var bitOn = ut.bitOn;
var u1 = ut.u1;
var u2 = ut.u2;
var un = ut.un;

/**
 * CID (Cryptogram Information Data)
 * tag: 9F27
 * length: 1
 *
 * @param tlv
 * @return {Array}
 */
function CryptogramInformationData(tlv) {
    var desc = [];
    var value = tlv.getValue('buffer');
    var code;

    code = value[0] & 0xc0;
    if (code == 0x80) {
        desc.push('10XX XXXX ARQC (Authorization Request Cryptogram): Online authorisation requested');
    } else if (code == 0x40) {
        desc.push('01XX XXXX TC (Transaction Certificate): Transaction approved');
    } else if (code == 0x00) {
        desc.push('00XX XXXX AAC (Application Authentication Cryptogram): Transaction declined');
    }

    return desc;
}


/**
 * IAD (Issuer Application Data)
 * tag: 9F10
 *
 * @param tlv
 * @return {Array}
 */
function IssuerApplicationData(tlv) {
    var buf = tlv.getValue('buffer');

    var format = buf[0];

    switch(format) {
        case 0x0F:
            return [' Issuer Application Data for a Common Core DefinitionsCompliant Application'];
        case 0x06:
        case 0x1F:
            return IssuerApplicationDataVisa(tlv);
        default:
            return IssuerApplicationDataMaster(tlv);
    }
}


/**
 * IAD (Issuer Application Data) for master
 * tag: 9F10
 * length: 18, 20, 26 or 28
 *
 * @param tlv
 * @return {Array}
 */
function IssuerApplicationDataMaster(tlv) {
    var desc = [];
    var buf = tlv.getValue('buffer');

    var len = buf.length;
    var offset = 0;

    desc.push('Key Derivation index: ' + u1(buf, offset)); offset += 1;
    desc.push('Cryptogram version number: ' + u1(buf, offset)); offset += 1;

    var cvr = un(buf, offset, 6); offset += 6;

    desc = desc.concat(CardVerificationResultsMaster(cvr));
    desc.push('DAC/ICC Dynamic Number: ' + u2(buf, offset)); offset += 2;

    var remainder = len-offset;

    //console.log(remainder);
    switch(remainder) {
        case 8:
        case 16:
            desc.push('Plaintext/Encrypted Counters: ' + un(buf, offset, remainder)); offset += remainder;
            break;
        case 10:
        case 18:
            desc.push('Plaintext/Encrypted Counters: ' + un(buf, offset, remainder)); offset += remainder;
            desc.push('Last Online ATC'); offset += 2;
            break;
    }

    return desc;
}


/**
 * IAD (Issuer Application Data) for visa
 * tag: 9F10
 *
 * @param tlv
 * @return {Array}
 */
function IssuerApplicationDataVisa(tlv) {
    var desc = [];
    var buf = tlv.getValue('buffer');

    var offset = 0;
    desc.push('length of  Visa Discretionary Data: ' + u1(buf, offset)); offset += 1;
    if (buf[0] === 0x06) {
        // IAD Format 0/1/3 (Current)
        desc.push('Derivation key index: ' + u1(buf, offset)); offset += 1;
        desc.push('Cryptogram version number: ' + u1(buf, offset)); offset += 1;

        var cvr = un(buf, offset, 4); offset += 4;

        var data = CardVerificationResultsVisa(cvr);
        desc = desc.concat(data);
        var discretionary_data = un(buf, offset);
        if (discretionary_data !== '') {
            desc.push('Issuer Discretionary Data:' + discretionary_data);
        }

    } else if (buf[0] === 0x1F) {
        // IAD Format 2 (New in VIS 1.6)
        desc.push('Cryptogram version number: ' + u1(buf, offset)); offset += 1;
        desc.push('Derivation key index: ' + u1(buf, offset)); offset += 1;
        desc.push('Card Verifcation Result: ' + un(buf, offset, 5)); offset += 5;
        desc.push('Issuer Discretionary Data:' + un(buf, offset));
    }
    return desc;
}

/**
 * CVR (Card Verification Results)
 * tag: '9F52'
 * length: 6
 *
 * @param buf
 * @returns {Array}
 */
function CardVerificationResultsMaster(buf) {

    var desc = [];
    //var buf = tlv.getValue('buffer');

    buf = toBuffer(buf);

    desc.push('Card Verification Result: ' + toHexString(buf));

    desc.push('byte1: ' + toHexString(buf[0]));
    var code = (buf[0] & 0xc0);
    //desc.push('b8-7 AC Returned In Second Generate AC');
    if (code == 0x00) {
        desc.push('\tb8-7 00: AAC Returned In Second Generate AC');
    } else if (code == 0x40) {
        desc.push('\tb8-7 01: TC Returned In Second Generate AC');
    } else if (code == 0x80) {
        desc.push('\tb8-7 10: AC Not Requested In Second Generate AC');
    }

    code = (buf[0] & 0x30);
    //desc.push('b6-5 AC Returned In First Generate AC');
    if (code == 0x00) {
        desc.push('\tb6-5 00: AAC Returned In First Generate AC');
    } else if (code == 0x20) {
        desc.push('\tb6-5 10: ARQC Returned In First Generate AC');
    } else if (code == 0x10) {
        desc.push('\tb6-5 01: TC Returned In First Generate AC');
    }

    code = buf[0] & 0x0f;
    if ((code & 0x08) == 0x08) {
        desc.push('b4 Date Check Failed');
    }

    if ((code & 0x04) == 0x04) {
        desc.push('b3 Offline PIN Verification Performed');
    }

    if ((code & 0x02) == 0x02) {
        desc.push('b2 Offline Encrypted PIN Verification Performed');
    }

    if ((code & 0x01) == 0x01) {
        desc.push('b1 Offline PIN Verification Successful');
    }

    code = buf[1];
    desc.push('byte2: ' + toHexString(buf[1]));
    if ((code & 0x80) == 0x80) {
        desc.push('\tb8 DDA Returned');
    }
    if ((code & 0x40) == 0x40) {
        desc.push('\tb7 Combined DDA/AC Generation Returned In First Generate AC');
    }
    if ((code & 0x20) == 0x20) {
        desc.push('\tb6 Combined DDA/AC Generation Returned In Second Generate AC');
    }
    if ((code & 0x10) == 0x10) {
        desc.push('\tb5 Issuer Authentication Performed');
    }
    if ((code & 0x08) == 0x08) {
        desc.push('\tb4 CIAC-Default Skipped On CAT3');
    }
    if ((code & 0x04) == 0x04) {
        desc.push('\tb3 Offline Change PIN Result');
    }
    //if ((code & 0x03) == 0x01) {
    //	desc.push('\tb2-1 Issuer Discretionary');
    //}

    code = buf[2];
    desc.push('byte3: ' + toHexString(code));
    desc.push('\tb8-5 Low Order Nibble Of Script Counter: ' + (code >>> 4));
    desc.push('\tb4-1 Low Order Nibble Of PIN Try Counter: ' + (code & 0x0f));


    code = buf[3];
    desc.push('byte4: ' + toHexString(code));
    if ((code & 0x80) == 0x80) {
        desc.push('\tb8 Last Online Transaction Not Completed');
    }
    if ((code & 0x40) == 0x40) {
        desc.push('\tb7 Unable To Go Online Indicated');
    }
    if ((code & 0x20) == 0x20) {
        desc.push('\tb6 Offline PIN Verification Not Performed');
    }
    if ((code & 0x10) == 0x10) {
        desc.push('\tb5 Offline PIN Verification Failed');
    }
    if ((code & 0x08) == 0x08) {
        desc.push('\tb4 PTL Exceeded');
    }
    if ((code & 0x04) == 0x04) {
        desc.push('\tb3 International Transaction');
    }
    if ((code & 0x02) == 0x02) {
        desc.push('\tb2 Domestic Transaction');
    }
    if ((code & 0x01) == 0x01) {
        desc.push('\tb1 Terminal Erroneously Considers Offline PIN OK');
    }

    code = buf[4];
    desc.push('byte5: ' + toHexString(code));
    if ((code & 0x80) == 0x80) {
        desc.push('\tb8 Lower Consecutive Counter 1 Limit Exceeded');
    }
    if ((code & 0x40) == 0x40) {
        desc.push('\tb7 Upper Consecutive Counter 1 Limit Exceeded');
    }
    if ((code & 0x20) == 0x20) {
        desc.push('\tb6 Lower Cumulative Accumulator 1 Limit Exceeded');
    }
    if ((code & 0x10) == 0x10) {
        desc.push('\tb5 Upper Cumulative Accumulator 1 Limit Exceeded');
    }
    if ((code & 0x08) == 0x08) {
        desc.push('\tb4 Go Online On Next Transaction Was Set');
    }
    if ((code & 0x04) == 0x04) {
        desc.push('\tb3 Issuer Authentication Failed');
    }
    if ((code & 0x02) == 0x02) {
        desc.push('\tb2 Script Received');
    }
    if ((code & 0x01) == 0x01) {
        desc.push('\tb1 Script Failed');
    }

    code = buf[5];
    desc.push('byte6: ' + toHexString(code));
    if ((code & 0x80) == 0x80) {
        desc.push('\tb8 Lower Consecutive Counter 2 Limit Exceeded');
    }
    if ((code & 0x40) == 0x40) {
        desc.push('\tb7 Upper Consecutive Counter 2 Limit Exceeded');
    }
    if ((code & 0x20) == 0x20) {
        desc.push('\tb6 Lower Cumulative Accumulator 2 Limit Exceeded');
    }
    if ((code & 0x10) == 0x10) {
        desc.push('\tb5 Upper Cumulative Accumulator 2 Limit Exceeded');
    }
    if ((code & 0x08) == 0x08) {
        desc.push('\tb4 MTA Limit Exceeded');
    }
    if ((code & 0x04) == 0x04) {
        desc.push('\tb3 Number Of Days Offline Limit Exceeded');
    }
    if ((code & 0x02) == 0x02) {
        desc.push('\tb2 Match Found In Additional Check Table');
    }
    if ((code & 0x01) == 0x01) {
        desc.push('\tb1 No Match Found In Additional Check Table');
    }
    return desc;
}

/**
 * CVR (Card Verification Results) for VISA
 *
 * tag: '9F52'
 * length: 4 or 5
 * 
 * @param {Buffer} buf 
 */
function CardVerificationResultsVisa(buf) {
    buf = toBuffer(buf);
    var desc = [];
    desc.push('Card Verification Result: ' + toHexString(buf));

    //CVR for IAD Format 0/1/3
    if (buf[0] === 0x03) {
        desc.push('byte 1: CVR length: ' + toHexString(buf[0]));
    } else {
        desc.push('byte 1: ' + toHexString(buf[0]));
    }
    var oneByte = buf[1] & 0x30;
    desc.push('byte2: ' + toHexString(buf[1]));
    if (oneByte == 0x00) {
        desc.push('\tb8-7 00: AAC Returned In Second Generate AC');
    } else if (oneByte == 0x40) {
        desc.push('\tb8-7 01: TC Returned In Second Generate AC');
    } else if (oneByte == 0x80) {
        desc.push('\tb8-7 10: AC Not Requested In Second Generate AC');
    }
    oneByte = (buf[1] & 0x30);
    if (oneByte == 0x00) {
        desc.push('\tb6-5 00: AAC Returned In First Generate AC');
    } else if (oneByte == 0x20) {
        desc.push('\tb6-5 10: ARQC Returned In First Generate AC');
    } else if (oneByte == 0x10) {
        desc.push('\tb6-5 01: TC Returned In First Generate AC');
    }
    oneByte = buf[1] & 0x0f;
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 Issuer Authentication performed and failed');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 Offline PIN verification performed');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 Offline PIN verification failed');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 Unable to go online');

    oneByte = buf[2];
    desc.push('byte3: ' + toHexString(buf[2]));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Last online transaction not completed');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 PIN Try Limit exceeded');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Exceeded velocity checking counters');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 New card');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 Issuer Authentication failure on last online transaction');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 Issuer Authentication not performed after online authorization');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 Application blocked by card because PIN Try Limit exceeded');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 Offline static data authentication failed on last transaction and transaction declined offline');

    oneByte = buf[3];
    desc.push('byte4: ' + toHexString(buf[3]));
    desc.push('\tb8-5 Number of Issuer Script commands: ' + (buf[3]>>4));
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 Issuer Script processing failed');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 Offline dynamic data authentication failed on last transaction and transaction declined offline');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 Offline dynamic data authentication performed');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 PIN verification command not received for a PINExpecting card');

    if (buf[0] !== 0x03 ) {
        //CVR for IAD Format 2
        oneByte = buf[4];
        desc.push('byte3: ' + toHexString(buf[4]));
        if (bitOn(oneByte, 0x02)) desc.push('\tb2 CDCVM Successfully Performed');
        if (bitOn(oneByte, 0x01)) desc.push('\tb1 Secure Messaging uses EMV Session keybased derivation');
    }
    return desc;
}

/**
 * Terminal Type
 * tag: '9F35'
 * length: 1
 *
 * https://www.emvco.com/faq.aspx?id=40#36
 * @param tlv
 * @returns {Array}
 */
function TerminalType(tlv) {
    var terminalType = require('./json/TerminalType.json');
    var key = tlv.getValue();
    var obj = terminalType[key];

    var desc = [];
    if (obj !== undefined) {
        var str;
        str =  'environment: ' + obj['environment'] + ' ';
        str += 'operator: ' + obj['operator'] + ' ';
        str += 'transaction type: ' + obj['type'];
        desc.push(str);
    } else {
        desc.push('unknown terminal type');
    }

    return desc;
}


module.exports = {
    CryptogramInformationData: CryptogramInformationData,
    IssuerApplicationData: IssuerApplicationData,
    TerminalType: TerminalType
};
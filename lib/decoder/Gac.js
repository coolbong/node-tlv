/**
 * Created by coolbong on 2017-02-27.
 */
var ut = require('../util');
var toHexString = ut.toHexString;
var toBuffer = ut.toBuffer;
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
        desc.push('10XX XXXX ARQC (Authorization Request Cryptogram)');
    } else if (code == 0x40) {
        desc.push('01XX XXXX TC (Transaction Certificate)');
    } else if (code == 0x00) {
        desc.push('00XX XXXX AAC (Application Authentication Cryptogram)');
    }

    return desc;
}

/**
 * IAD (Issuer Application Data)
 * tag: 9F10
 * length: 18, 20, 26 or 28
 *
 * @param tlv
 * @return {Array}
 */
function IssuerApplicationData(tlv) {
    var desc = [];
    var buf = tlv.getValue('buffer');

    var len = buf.length;
    var offset = 0;

    desc.push('Key Derivation index: ' + u1(buf, offset)); offset += 1;
    desc.push('Cryptogram version number: ' + u1(buf, offset)); offset += 1;

    var cvr = un(buf, offset, 6); offset += 6;

    desc = desc.concat(CardVerificationResults(cvr));
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
 * CVR (Card Verification Results)
 * tag: '9F52'
 * length: 6
 *
 * @param buf
 * @returns {Array}
 */
function CardVerificationResults(buf) {

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
    } else if (code == 0x01) {
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





module.exports = {
    CryptogramInformationData: CryptogramInformationData,
    IssuerApplicationData: IssuerApplicationData,
    CardVerificationResults: CardVerificationResults
};
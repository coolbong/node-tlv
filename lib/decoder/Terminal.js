/**
 * Created by coolbong on 2017-03-09.
 */
var bitOn = require('../util').bitOn;
var toHexString = require('../util').toHexString;

// Tag: 95
function TerminalVerificationResult(tlv) {
    var desc = [];
    var oneByte;
    var buf = tlv.getValue('buffer');

    oneByte = buf[0];
    desc.push('byte1: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Offline Data Authentication Was Not Performed');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 SDA Failed');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 ICC Data Missing');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Card Appears On Terminal Exception File');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 DDA Failed');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 CDA Failed');

    oneByte = buf[1];
    desc.push('byte2: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 ICC And Terminal Have Different Application Versions');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Expired Application');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Application Not Yet Effective');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Requested Service Not Allowed For Card Product');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 New Card');

    oneByte = buf[2];
    desc.push('byte3: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Cardholder Verification Was Not Successful');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Unrecognised CVM');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 PIN Try Limit Exceeded');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 PIN Entry Required And PIN Pad Not Present Or Not Working');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 PIN Entry Required, PIN Pad Present, But PIN Was Not Entered');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 Online PIN Entered');

    oneByte = buf[3];
    desc.push('byte4: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Transaction Exceeded Floor Limit');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Lower Consecutive Offline Limit Exceeded');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Upper Consecutive Offline Limit Exceeded');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Transaction Selected Randomly For Online Processing');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 Merchant Forced Transaction Online');

    oneByte = buf[4];
    desc.push('byte5: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Default TDOL Used');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Issuer Authentication Failed');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Script Processing Failed Before Final Generate AC');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Script Processing Failed After Final Generate AC');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 Relay Resistance Threshold Exceeded');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 Relay Resistance Time Limits Exceeded');

    if ((oneByte & 0x03) === 0x00) {
        //desc.push('b2-1 00: Relay resistance protocol not supported');
    } else if ((oneByte & 0x03) === 0x01) {
        desc.push('b2-1 01: RRP Not Performed');
    } else if ((oneByte & 0x03) === 0x02) {
        desc.push('b2-1 10: RRP Performed');
    }

    return desc;
}

// Tag: 9B
function TerminalStatusInformation(tlv) {
    var desc = [];
    var oneByte;
    var buf = tlv.getValue('buffer');

    oneByte = buf[0];
    desc.push('byte1: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Offline data authentication was performed');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Cardholder verification was performed');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Card risk management was performed');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Issuer authentication was performed');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 Terminal risk management was performed');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 Script processing was performed');
    // bit2-1 RFU

    oneByte = buf[1];
    desc.push('byte2: ' + toHexString(oneByte)); 
    // bit8-1 RFU

    return desc;
}

// Tag : 9F33
function TerminalCapabilities(tlv) {
    var desc = [];
    var oneByte;
    var buf = tlv.getValue('buffer');

    oneByte = buf[0];
    desc.push('byte1: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Manual key entry');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Magnetic stripe');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 IC with contacts');
    // bit 5-1 RFU

    oneByte = buf[1];
    desc.push('byte2: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Plaintext PIN for ICC verification');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Enciphered PIN for online verification');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Signature (paper)');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Enciphered PIN for offline verification');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 No CVM Required');
    // bit 3-1 RFU

    oneByte = buf[2];
    desc.push('byte3: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 SDA');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 DDA');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Signature (paper)');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Enciphered PIN for offline verification');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 No CVM Required');
    // bit 3-1 RFU

    return desc;
}

// Tag: 9F40
function AdditionalTerminalCapabilities(tlv) {
    var desc = [];
    var oneByte;
    var buf = tlv.getValue('buffer');

    oneByte = buf[0];
    desc.push('byte1: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Cash');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Goods');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Services');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Cashback');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 Inquiry');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 Transfer');
    if (bitOn(oneByte, 0x20)) desc.push('\tb2 Payment');
    if (bitOn(oneByte, 0x10)) desc.push('\tb1 Administrative');

    oneByte = buf[1];
    desc.push('byte2: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Cash Deposit');
    // bit7-1 RFU

    oneByte = buf[2];
    desc.push('byte3: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Numeric keys');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Alphabetic and special characters keys');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Command keys');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Function keys');
    // bit4-1 RFU

    oneByte = buf[3];
    desc.push('byte4: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Print, attendant');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Print, cardholder');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Display, attendant');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Display, cardholder');
    // bit4-3 RFU
    if (bitOn(oneByte, 0x20)) desc.push('\tb2 Code table 10');
    if (bitOn(oneByte, 0x10)) desc.push('\tb1 Code table 9');

    oneByte = buf[4];
    desc.push('byte5: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Code table 8');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Code table 7');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Code table 6');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Code table 5');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 Code table 4');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 Code table 3');
    if (bitOn(oneByte, 0x20)) desc.push('\tb2 Code table 2');
    if (bitOn(oneByte, 0x10)) desc.push('\tb1 Code table 1');

    return desc;
}



module.exports = {
    TerminalVerificationResult:TerminalVerificationResult,
    TerminalStatusInformation:TerminalStatusInformation,
    TerminalCapabilities:TerminalCapabilities,
    AdditionalTerminalCapabilities:AdditionalTerminalCapabilities
};
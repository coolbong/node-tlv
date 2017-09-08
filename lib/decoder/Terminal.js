/**
 * Created by coolbong on 2017-03-09.
 */
var bitOn = require('../util').bitOn;
var toHexString = require('../util').toHexString;

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


module.exports = {
    TerminalVerificationResult:TerminalVerificationResult
};
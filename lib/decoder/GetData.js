/**
 * Created by coolbong on 2017-02-27.
 */

var bitOn = require('../util').bitOn;
var toHexString = require('../util').toHexString;
/**
 * CIAC (Card Issuer Action Code)
 * tag: 'C3', 'C4', 'C5', 'CD', 'CE', 'CF'
 *
 * @param tlv
 * @return {Array}
 */
function CardIssuerActionCode(tlv) {
    var desc = [];

    var buf = tlv.getValue('buffer');
    var oneByte;


    oneByte = buf[0];
    desc.push('Byte 1: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Last Online Transaction Not Completed');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Unable To Go Online Indicated');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Offline PIN Verification Not Performed');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Offline PIN Verification Failed');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 PTL Exceeded');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 International Transaction');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 Domestic Transaction');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 Terminal Erroneously Considers Offline PIN OK');

    oneByte = buf[1];
    desc.push('Byte 2: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Lower Consecutive Counter 1 Limit Exceeded');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Upper Consecutive Counter 1 Limit Exceeded');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Lower Cumulative Accumulator 1 Limit Exceeded');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Upper Cumulative Accumulator 1 Limit Exceeded');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 Go Online On Next Transaction Was Set');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 Issuer Authentication Failed');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 Script Received');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 Script Failed');

    oneByte = buf[2];
    desc.push('Byte 3: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Lower Consecutive Counter 2 Limit Exceeded');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Upper Consecutive Counter 2 Limit Exceeded');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Lower Cumulative Accumulator 2 Limit Exceeded');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Upper Cumulative Accumulator 2 Limit Exceeded');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 MTA Limit Exceeded');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 Number Of Days Offline Limit Exceeded');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 Match Found In Additional Check Table');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 No Match Found In Additional Check Table');
    return desc;
}

module.exports = {
    CardIssuerActionCode: CardIssuerActionCode
};
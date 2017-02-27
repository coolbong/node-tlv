/**
 * Created by coolbong on 2017-02-24.
 */

var toHexString = require('../util').toHexString;

/**
 * Processing Options Data Object List (PDOL)
 * tag: 9F38
 * length: variable
 *
 * @param tlv
 * @returns {Array}
 */
function Pdol(tlv) {
    var dol = tlv.parseDolValue();

    var desc = [];
    desc.push('PDOL: ' + tlv.getTag() + ' PDOL Related Data length: ' + toHexString(dol.getDolRelatedDataLength()) + ' (' + dol.getDolRelatedDataLength() + ')');
    var dolList = dol.getList();
    dolList.forEach(function (tl) {
        desc.push(tl.getTag() + ' ' + tl.getL() + ' (' + tl.getLength() + ') ' + tl.getName());
    });

    return desc;
}

module.exports = {
    Pdol: Pdol
};
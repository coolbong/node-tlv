/**
 * Created by coolbong on 2016-12-09.
 */
 
var assert = require('assert');
var TLV = require('../lib/TLV');

exports.record = {

    'visa PAN': function () {
        var tlv = TLV.parse('70818D5A0845797205098670045F24031704305F25031204305F280204105F300202015F3401018C159F02069F03069F1A0295055F2A029A039C019F37048D178A029F02069F03069F1A0295055F2A029A039C019F37048E10000000000000000001031E0302031F009F0702FF009F0802008C9F0D05986804A8009F0E050010A800009F0F05986804F8009F42020410');

        // Primary Account Number
        var pan = tlv.find('5A');

        
        var value = pan.getValue();
        assert(value.length === 16);

    }
};
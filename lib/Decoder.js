/**
 * Created by coolbong on 2017-02-24.
 */

var toAscii = require('./util').toAscii;

// SELECT


// GET_PROCESSING_OPTION
var ApplicationInterchangeProfile = require('./decoder/Gpo').ApplicationInterchangeProfile;
var ApplicationFileLocator = require('./decoder/Gpo').ApplicationFileLocator;


// only emv element
var emv = {
    // SELECT
    '84': {
        name: 'Dedicated File (DF) Name',
        decoder: undefined
    },
    'A5' : {
        name: 'File Control Information (FCI) Proprietary Template',
        decoder: undefined
    },
    '50': {
        name: 'Application Label',
        decoder: ascii
    },
    '5F2D' : {
        name : 'Language Preference',
        decoder: ascii
    },
    '9F12' : {
        name: 'Application Preferred Name',
        decoder: ascii
    },

    // GET_PROCESSING_OPTION
    '82' : {
        name: 'Application Interchange Profile',
        decoder: ApplicationInterchangeProfile
    },
    '94' : {
        name: 'Application File Locator (AFL) (contact)',
        decoder: ApplicationFileLocator
    }

};


function setDecoder(tlv) {
    var tag = tlv.getTag();
    if (emv[tag] !== undefined) {
        tlv.name = emv[tag].name;
        tlv.desc = emv[tag].decoder;
    }
}


function ascii(tlv) {

    return [toAscii(tlv.getValue())];
}

module.exports = {
    setDecoder: setDecoder
};
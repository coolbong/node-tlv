/**
 * Created by coolbong on 2017-02-24.
 */

var toAscii = require('./util').toAscii;

// SELECT
var Pdol = require('./decoder/Select').Pdol;


// GET_PROCESSING_OPTION
var ApplicationInterchangeProfile = require('./decoder/Gpo').ApplicationInterchangeProfile;
var ApplicationFileLocator = require('./decoder/Gpo').ApplicationFileLocator;


// READ_RECORD
var CDOL1 = require('./decoder/Record').CDOL1;
var CDOL2 = require('./decoder/Record').CDOL2;
var CVMList = require('./decoder/Record').CVMList;
var IssuerCountryCode = require('./decoder/Record').IssuerCountryCode;
var ServiceCode = require('./decoder/Record').ServiceCode;
var ApplicationUsageControl = require('./decoder/Record').ApplicationUsageControl;

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
    '9F38' : {
        name: 'Processing Options Data Object List (PDOL)',
        decoder: Pdol
    },

    // GET_PROCESSING_OPTION
    '82' : {
        name: 'Application Interchange Profile',
        decoder: ApplicationInterchangeProfile
    },
    '94' : {
        name: 'Application File Locator (AFL) (contact)',
        decoder: ApplicationFileLocator
    },

    // READ_RECORD
    '5F20' : {
        name: 'Card holder name',
        decoder: ascii
    },
    '5F28': {
        name : 'Issuer Country Code',
        decoder: IssuerCountryCode
    },
    '5F30': {
        name: 'Service Code',
        decoder: ServiceCode
    },
    '8C' : {
        name: 'CDOL1 (Card Risk Management Data Object List 1)',
        decoder: CDOL1
    },
    '8D' : {
        name: 'CDOL2 (Card Risk Management Data Object List 2)',
        decoder: CDOL2
    },
    '8E' : {
        name: 'CVM List (Cardholder Verification Method List)',
        decoder: CVMList
    },
    '9F07' : {
        name: 'Application Usage Control',
        decoder: ApplicationUsageControl
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
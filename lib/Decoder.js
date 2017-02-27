/**
 * Created by coolbong on 2017-02-24.
 */

var toNumber = require('./util').toNumber;
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
var IssuerActionCode = require('./decoder/Record').IssuerActionCode;

// GENERAGE_AC
var CryptogramInformationData = require('./decoder/Gac').CryptogramInformationData;
var IssuerApplicationData = require('./decoder/Gac').IssuerApplicationData;

// GET_DATA
var CardIssuerActionCode = require('./decoder/GetData').CardIssuerActionCode;

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
    },
    '9F0D' : {
        name: 'Issuer Action Code - Default',
        decoder: IssuerActionCode
    },
    '9F0E' : {
        name: 'Issuer Action Code - Denial',
        decoder: IssuerActionCode
    },
    '9F0F' : {
        name: 'Issuer Action Code - Online',
        decoder: IssuerActionCode
    },
    'C4' : {
        name: 'Card Issuer Action Code – Default (contact)',
        decoder: CardIssuerActionCode
    },
    'CD' : {
        name: 'Card Issuer Action Code – Default (contactless)',
        decoder: CardIssuerActionCode
    },
    'C5' : {
        name: 'Card Issuer Action Code - Online (contact)',
        decoder: CardIssuerActionCode
    },
    'CE' : {
        name: 'Card Issuer Action Code - Online (contactless)',
        decoder: CardIssuerActionCode
    },
    'C3' : {
        name: 'Card Issuer Action Code - Decline (contact)',
        decoder: CardIssuerActionCode
    },
    'CF' : {
        name: 'Card Issuer Action Code - Decline (contactless)',
        decoder: CardIssuerActionCode
    },

    // GENERATE AC
    '9F10' : {
        name: 'IAD (Issuer Application Data)',
        decoder: IssuerApplicationData
    },
    '9F27' : {
        name: 'CID (Cryptogram Information Data)',
        decoder: CryptogramInformationData
    },
    '9F36' : {
        name: 'ATC (Application Transaction Count',
        decoder: number
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

function number(tlv) {
    return ['DEC: ' + toNumber(tlv.getValue())];
}

module.exports = {
    setDecoder: setDecoder
};

//FIXME visa, master, amx tag
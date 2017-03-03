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
var Record = require('./decoder/Record');


// GENERAGE_AC
var GAC = require('./decoder/Gac');


// GET_DATA
var GetData = require('./decoder/GetData');

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
        decoder: getCountryCode
    },
    '5F30': {
        name: 'Service Code',
        decoder: Record.ServiceCode
    },
    '8C' : {
        name: 'CDOL1 (Card Risk Management Data Object List 1)',
        decoder: Record.CDOL1
    },
    '8D' : {
        name: 'CDOL2 (Card Risk Management Data Object List 2)',
        decoder: Record.CDOL2
    },
    '8E' : {
        name: 'CVM List (Cardholder Verification Method List)',
        decoder: Record.CVMList
    },
    '9F07' : {
        name: 'Application Usage Control',
        decoder: Record.ApplicationUsageControl
    },
    '9F0D' : {
        name: 'Issuer Action Code - Default',
        decoder: Record.IssuerActionCode
    },
    '9F0E' : {
        name: 'Issuer Action Code - Denial',
        decoder: Record.IssuerActionCode
    },
    '9F0F' : {
        name: 'Issuer Action Code - Online',
        decoder: Record.IssuerActionCode
    },

    // GENERATE AC RESP
    '9F10' : {
        name: 'IAD (Issuer Application Data)',
        decoder: GAC.IssuerApplicationData
    },
    '9F27' : {
        name: 'CID (Cryptogram Information Data)',
        decoder: GAC.CryptogramInformationData
    },
    '9F36' : {
        name: 'ATC (Application Transaction Count',
        decoder: number
    },

    // GENERATE AC CMD
    '5F2A' : {
        name: 'Transaction Currency Code',
        decoder: getCurrencyCode
    },
    '9F35' : {
        name: 'Terminal Type',
        decoder: GAC.TerminalType
    },
    '9F42' : {
        name: 'Application Currency Code',
        decoder: getCurrencyCode
    },

    // GET_DATA
    'C4' : {
        name: 'Card Issuer Action Code – Default (contact)',
        decoder: GetData.CardIssuerActionCode
    },
    'CD' : {
        name: 'Card Issuer Action Code – Default (contactless)',
        decoder: GetData.CardIssuerActionCode
    },
    'C5' : {
        name: 'Card Issuer Action Code - Online (contact)',
        decoder: GetData.CardIssuerActionCode
    },
    'CE' : {
        name: 'Card Issuer Action Code - Online (contactless)',
        decoder: GetData.CardIssuerActionCode
    },
    'C3' : {
        name: 'Card Issuer Action Code - Decline (contact)',
        decoder: GetData.CardIssuerActionCode
    },
    'CF' : {
        name: 'Card Issuer Action Code - Decline (contactless)',
        decoder: GetData.CardIssuerActionCode
    },
    'C8' : {
        name: 'CRM Country Code',
        decoder: getCountryCode
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

function getCountryCode(tlv) {
    var value = tlv.getValue();
    var countryCode = require('./decoder/json/CountryCode.json');
    var obj = countryCode[value];

    var desc = [];
    if (obj !== undefined) {
        desc.push('country info: name : ' + obj['country'] + ' (' + obj['A3'] + ')');
    } else {
        desc.push('unknown country code. plz update ISO3166.');
    }
    return desc;
}

/**
 *
 * tag: '5F2A' Transaction Currency Code
 * tag: '9F42' Application Currency Code
 *
 * data from
 * https://www.currency-iso.org/en/home/tables/table-a1.html
 * https://www.currency-iso.org/dam/downloads/lists/list_one.xml
 * @param tlv
 */
function getCurrencyCode(tlv) {
    var value = tlv.getValue();
    var currencyCode = require('./decoder/json/CurrencyCode.json');

    var list = currencyCode['list'];




    var desc = [];
    if (list !== undefined) {
        var array = [];
        list.forEach( function (item) {
            if (item['number'] === value) {
                array.push(item);
            }
        });

        var obj = array[0];
        desc.push('Code: [' + obj['code'] + '] : ' + obj['currency']);

        // var str = 'country: ';
        // array.forEach( function (item) {
        //     str += item['country'] + ', ';
        // });
        //desc.push(str);

    } else {
        desc.push('unknown country code. plz update ISO3166.');
    }
    return desc;
}

module.exports = {
    setDecoder: setDecoder
};

//FIXME visa, master, amx tag
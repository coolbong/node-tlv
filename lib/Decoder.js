/**
 * Created by coolbong on 2017-02-24.
 */

var toNumber = require('./util').toNumber;
var toAscii = require('./util').toAscii;

// SELECT
var Pdol = require('./decoder/Select').Pdol;


// GET_PROCESSING_OPTION
var Gpo = require('./decoder/Gpo');

// READ_RECORD
var Record = require('./decoder/Record');


// GENERAGE_AC
var GAC = require('./decoder/Gac');


// GET_DATA
var GetData = require('./decoder/GetData');


var Template = require('./decoder/Template');

// Terminal
var Terminal = require('./decoder/Terminal');

// only emv element
var emv = {
    // SELECT
    '84': {
        name: 'Dedicated File (DF) Name',
        decoder: isPse
    },
    'A5' : {
        name: 'File Control Information (FCI) Proprietary Template',
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
        decoder: Gpo.ApplicationInterchangeProfile
    },
    '94' : {
        name: 'Application File Locator (AFL) (contact)',
        decoder: Gpo.ApplicationFileLocator,
        func: Gpo.ApplicationFileLocatorFunction
    },

    // READ_RECORD
    '56' : {
        name: 'Track 1 Data',
        decoder: Record.Track1Data
    },
    '57' : {
        name: 'Track 2 Equivalent Data',
        decoder: Record.Track2Data
    },
    '5F20' : {
        name: 'Card holder name',
        decoder: ascii
    },
    '5F25' : {
        name : 'Application Effective Date',
        decoder: getDateFormat
    },
    '5F24' : {
        name: 'Application Expiration Date',
        decoder: getDateFormat
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
    '9F1F' : {
        name: 'Track 1 Discretionary Data',
        decoder: Record.Track1DiscretionaryData
    },
    '9F6B' : {
        name: 'Track 2 Data',
        decoder: Record.Track2Data
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
    '9F1A' : {
        name: 'Terminal Country Code',
        decoder: getCountryCode
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
    '9F4F' : {
        name: 'Log Format',
        decoder: GetData.LogFormat
    },
    'C3' : {
        name: 'Card Issuer Action Code - Decline (contact)',
        decoder: GetData.IssuerActionCode
    },
    'C4' : {
        name: 'Card Issuer Action Code – Default (contact)',
        decoder: GetData.IssuerActionCode
    },
    'C5' : {
        name: 'Card Issuer Action Code - Online (contact)',
        decoder: GetData.IssuerActionCode
    },
    'CD' : {
        name: 'Card Issuer Action Code – Default (contactless)',
        decoder: GetData.IssuerActionCode
    },
    
    'CE' : {
        name: 'Card Issuer Action Code - Online (contactless)',
        decoder: GetData.IssuerActionCode
    },
    'CF' : {
        name: 'Card Issuer Action Code - Decline (contactless)',
        decoder: GetData.IssuerActionCode
    },
    'C8' : {
        name: 'CRM Country Code',
        decoder: getCountryCode
    },

    'D5' : {
        name: 'Application Control (Contact)',
        decoder: GetData.ApplicationControl
    },
    'D7' : {
        name: 'Application Control (Contactless)',
        decoder: GetData.ApplicationControl
    },

    // TERMINAL
    '95' : {
        name: 'Terminal Verification Results',
        decoder: Terminal.TerminalVerificationResult
    },
    '9B' : {
        name: 'Transaction Status Information',
        decoder: Terminal.TerminalStatusInformation
    },
    '9F33' : {
        name: 'Terminal Capabilities',
        decoder: Terminal.TerminalCapabilities
    },
    '9F40' : {
        name: 'Additional Terminal Capabilities',
        decoder: Terminal.AdditionalTerminalCapabilities
    },
    

    // for CPA
    'C1' : {
        name: 'Application Control',
        decoder: GetData.ApplicationControl4Cpa
    },

    // CPA template 
    'BF30' : {
        name : 'Accumulator Value(DF0X) / Limit(DF1X)',
    },
    'BF31' : {
        name : 'Accumulator Profile Control',
        decoder: Template.AccumulatorProfileControl
    },
    'BF32' : {
        name : 'Accumulator x Control',
        decoder: Template.AccumulatorControl
    },
    'BF34' : {
        name : 'Card Issuer Action Codes',
        decoder: Template.Ciacs
    },
    'BF36' : {
        name : 'Counter Profile Control',
        decoder: Template.CounterProfileControl
    },
    'BF37' : {
        name : 'Counter x Control',
        decoder: Template.CounterControl
    },

    'BF3B' : {
        name: 'Issuer Options Profile Control',
        decoder : Template.IssuerOptionsProfileControl
    },
    //// BF3D	DF01	MTA Profile Control 1	4	Fixed	08181F00
    'BF3D' : {
        name: 'MTA Profile Control',
        decoder : Template.MtaProfileCotnrol
    },
};


function setDecoder(tlv) {
    var tag = tlv.getTag();

    if (tag[0] === 'D' && tag[1] === 'F') { // is template tag
        var parent = tlv.parent;
        if (parent !== undefined) {
            tlv.name = parent.name;
            tlv.desc = parent.desc;
            return;
        }
    }

    if (emv[tag] !== undefined) {
        tlv.name = emv[tag].name;
        tlv.desc = emv[tag].decoder;
        if (emv[tag].func) {	
            // for extra function (afl getCommand)
            emv[tag].func(tlv);	
        }
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

function getDateFormat(tlv) {
    var desc = [];
    var value = tlv.getValue();
    var year = '20' + value.slice(0, 2);
    var month = value.slice(2, 4);
    var date = value.slice(4);
    desc.push('YYYY-MM-DD: '+ year + '-' + month + '-' + date);
    return desc;
}

function isPse(tlv) {
    var value = tlv.getValue();

    if ('315041592E5359532E4444463031' === value || '325041592E5359532E4444463031' === value) {
        return ascii(tlv)
    }

    // FIXME AID

    return [];
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
        if (obj)
            desc.push('Code: [' + obj['code'] + '] : ' + obj['currency']);
        else
            desc.push('unknown country code ' + value + '. plz update ISO3166.');
    } else {
        desc.push('no country codes? plz load.');
    }
    return desc;
}

module.exports = {
    setDecoder: setDecoder
};

//FIXME visa, master, amex tag
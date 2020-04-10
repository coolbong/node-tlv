/**
 * Created by coolbong on 2015-04-28.
 */

//FIXME function (TAG) return  {tag, length, description};
//need length information string info to {}

function Dictionary() {

}

// FIXME: dictionary data to  { tag: 42, desc: 'Application Identifier(AID)', length: ?? }

var emvDictionary = {
    '42' : 'Issuer Identification Number (IIN)',
    '4F' : 'Application Identifier(AID)',
    '50' : 'Application Label',
    '57' : 'Track 2 Equivalent Data',
    '5A' : 'Application Primary Account Number (PAN)',
    '5F20' : 'Cardholder Name',
    '5F24' : 'Application Expiration Date',
    '5F25' : 'Application Effective Date',
    '5F28' : 'Issuer Country Code',
    '5F2A' : 'Transaction Currency Code',
    '5F2D' : 'Language Preference',
    '5F30' : 'Service Code',
    '5F34' : 'Application Primary Account Number (PAN) Sequence Number',
    '5F36' : 'Transaction Currency Exponent',
    '5F50' : 'Issuer URL',
    '5F53' : 'International Bank Account Number (IBAN)',
    '5F54' : 'Bank Identifier Code (BIC)',
    '5F55' : 'Issuer Country Code (alpha2 format)',
    '5F56' : 'Issuer Country Code (alpha3 format)',
    '61' : 'Application Template',
    '6F' : 'File Control Information (FCI) Template',
    '70' : 'READ RECORD Response Message Template',
    '71' : 'Issuer Script Template 1',
    '72' : 'Issuer Script Template 2',
    '73' : 'Directory Discretionary Template',
    '77' : 'Response Message Template Format 2',
    '80' : 'Response Message Template Format 1',
    '81' : 'Amount, Authorised (Binary)',
    '82' : 'Application Interchange Profile',
    '83' : 'Command Template',
    '84' : 'Dedicated File (DF) Name',
    '86' : 'Issuer Script Command',
    '87' : 'Application Priority Indicator',
    '88' : 'Short File Identifier (SFI)',
    '89' : 'Authorisation Code',
    '8A' : 'Authorisation Response Code',
    '8C' : 'Card Risk Management Data Object List 1 (CDOL1)',
    '8D' : 'Card Risk Management Data Object List 2 (CDOL2)',
    '8E' : 'Cardholder Verification Method (CVM) List',
    '8F' : 'Certification Authority Public Key Index',
    '90' : 'Issuer Public Key Certificate',
    '91' : 'Issuer Authentication Data',
    '92' : 'Issuer Public Key Remainder',
    '93' : 'Signed Static Application Data',
    '94' : 'Application File Locator (AFL) (contact)',

    '95' : 'Terminal Verification Results',
    '97' : 'Transaction Certificate Data Object List (TDOL)',
    '98' : 'Transaction Certificate (TC) Hash Value',
    '99' : 'Transaction Personal Identification Number (PIN) Data',
    '9A' : 'Transaction Date',
    '9B' : 'Transaction Status Information',
    '9C' : 'Transaction Type',
    '9D' : 'Directory Definition File (DDF) Name',
    '9F01' : 'Acquirer Identifier',
    '9F02' : 'Amount, Authorised (Numeric)',
    '9F03' : 'Amount, Other (Numeric)',
    '9F04' : 'Amount, Other (Binary)',
    '9F05' : 'Application Discretionary Data',
    '9F06' : 'Application Identifier (AID) - terminal',
    '9F07' : 'Application Usage Control',
    '9F08' : 'Application Version Number',
    '9F09' : 'Application Version Number',
    '9F0B' : 'Cardholder Name Extended',
    '9F0D' : 'Issuer Action Code - Default',
    '9F0E' : 'Issuer Action Code - Denial',
    '9F0F' : 'Issuer Action Code - Online',
    '9F10' : 'Issuer Application Data',
    '9F11' : 'Issuer Code Table Index',
    '9F12' : 'Application Preferred Name',
    '9F13' : 'Last Online Application Transaction Counter (ATC) Register',
    '9F14' : 'Lower Consecutive Offline Limit',
    '9F15' : 'Merchant Category Code',
    '9F16' : 'Merchant Identifier',
    '9F18' : 'Issuer Script Identifier',
    '9F1A' : 'Terminal Country Code',
    '9F1B' : 'Terminal Floor Limit',
    '9F1C' : 'Terminal Identification',
    '9F1D' : 'Terminal Risk Management Data',
    '9F1E' : 'Interface Device (IFD) Serial Number',
    '9F1F' : 'Track 1 Discretionary Data',
    '9F20' : 'Track 2 Discretionary Data',
    '9F21' : 'Transaction Time',
    '9F23' : 'Upper Consecutive Offline Limit',
    '9F26' : 'Application Cryptogram',
    '9F27' : 'Cryptogram Information Data',
    '9F2D' : 'ICC PIN Encipherment Public Key Certificate',
    '9F2E' : 'ICC PIN Encipherment Public Key Exponent',
    '9F2F' : 'ICC PIN Encipherment Public Key Remainder',
    '9F32' : 'Issuer Public Key Exponent',
    '9F33' : 'Terminal Capabilities',
    '9F34' : 'Cardholder Verification Method (CVM) Results',
    '9F35' : 'Terminal Type',
    '9F36' : 'Application Transaction Counter (ATC)',
    '9F37' : 'Unpredictable Number',
    '9F38' : 'Processing Options Data Object List (PDOL)',
    '9F39' : 'Point-of-Service (POS) Entry Mode',
    '9F3A' : 'Amount, Reference Currency',
    '9F3B' : 'Application Reference Currency',
    '9F3C' : 'Transaction Reference Currency Code',
    '9F3D' : 'Transaction Reference Currency Exponent',
    '9F40' : 'Additional Terminal Capabilities',
    '9F41' : 'Transaction Sequence Counter',
    '9F42' : 'Application Currency Code',
    '9F43' : 'Application Reference Currency Exponent',
    '9F44' : 'Application Currency Exponent',
    '9F45' : 'Data Authentication Code',
    '9F46' : 'ICC Public Key Certificate',
    '9F47' : 'ICC Public Key Exponent',
    '9F48' : 'ICC Public Key Remainder',
    '9F49' : 'Dynamic Data Authentication Data Object List (DDOL)',
    '9F4A' : 'Static Data Authentication Tag List',
    '9F4B' : 'Signed Dynamic Application Data',
    '9F4C' : 'ICC Dynamic Number',
    '9F4D' : 'Log Entry',
    '9F4E' : 'Merchant Name and Location',
    '9F4F' : 'Log Format',
    '9F7C' : 'Merchant Custom Data',
    'A5' : 'File Control Information (FCI) Proprietary Template',
    'BF0C' : 'File Control Information (FCI) Issuer Discretionary Data',

    // contactless
    'D9' : 'Application File Locator (AFL) (contactless)',

    // EMV ContactlessSpecifications for Payment Systems
    // Book C-2 Kernel 2 Specification Version 2.6 February 2016

    '9F29' : 'Extended Selection',
    '9F2A' : 'Kernel Identifier',
    '5F57' : 'Account Type',
    '9F50' : 'Offline Accumulator Balance',
    '9F52' : 'Card Verification Result',
    '9F53' : 'Transaction Category Code',
    '9F5D' : 'Application Capabilities Information',
    '9F5E' : 'DS ID',
    '9F60' : 'CVC3 (Track1)',
    '9F61' : 'CVC3 (Track2)',
    '9F69' : 'UDOL',
    '9F6A' : 'Unpredictable Number (Numeric)',
    '9F6D' : 'Mag-stripe Application Version Number (Reader)',
    '9F6E' : 'Third Party Data',
    '9F70' : 'Protected Data Envelope 1',
    '9F71' : 'Protected Data Envelope 2',
    '9F72' : 'Protected Data Envelope 3',
    '9F73' : 'Protected Data Envelope 4',
    '9F74' : 'Protected Data Envelope 5',
    '9F75' : 'Unprotected Data Envelope 1',
    '9F76' : 'Unprotected Data Envelope 2',
    '9F77' : 'Unprotected Data Envelope 3',
    '9F78' : 'Unprotected Data Envelope 4',
    '9F79' : 'Unprotected Data Envelope 5',
    'DF41' : 'DS Management Control',
    'DF4B' : 'POS Cardholder Interaction Information',
    'DF60' : 'DS Input (Card)',
    'DF61' : 'DS Digest H',
    'DF62' : 'DS ODS Info',
    'DF63' : 'DS ODS Term',
    'DF8104' : 'Balance Read Before Gen AC',
    'DF8105' : 'Balance Read After Gen AC',
    'DF8106' : 'Data Needed',
    'DF8107' : 'CDOL1 Related Data',
    'DF8108' : 'DS AC Type',
    'DF8109' : 'DS Input (Term)',
    'DF810A' : 'DS ODS Info For Reader',
    'DF810B' : 'DS Summary Status',
    'DF810C' : 'Kernel ID',
    'DF810D' : 'DSVN Term',
    'DF810E' : 'Post-Gen AC Put Data Status',
    'DF810F' : 'Pre-Gen AC Put Data Status',
    'DF8110' : 'Proceed To First Write Flag',
    'DF8111' : 'PDOL Related Data',
    'DF8112' : 'Tags To Read',
    'DF8113' : 'DRDOL Related Data',
    'DF8114' : 'Reference Control Parameter',
    'DF8115' : 'Error Indication',
    'DF8116' : 'User Interface Request Data',
    'DF8117' : 'Card Data Input Capability',
    'DF8118' : 'CVM Capability – CVM Required',
    'DF8119' : 'CVM Capability – No CVM Required',
    'DF811A' : 'Default UDOL',
    'DF811B' : 'Kernel Configuration',
    'DF811C' : 'Max Lifetime of Torn Transaction Log Record',
    'DF811D' : 'Max Number of Torn Transaction Log Records',
    'DF811E' : 'Mag-stripe CVM Capability – CVM Required',
    'DF811F' : 'Security Capability',
    'DF8120' : 'Terminal Action Code – Default',
    'DF8121' : 'Terminal Action Code – Denial',
    'DF8122' : 'Terminal Action Code – Online',
    'DF8123' : 'Reader Contactless Floor Limit',
    'DF8124' : 'Reader Contactless Transaction Limit (No On-device CVM)',
    'DF8125' : 'Reader Contactless Transaction Limit (On-device CVM)',
    'DF8126' : 'Reader CVM Required Limit',
    'DF8127' : 'Time Out Value',
    'DF8128' : 'IDS Status',
    'DF8129' : 'Outcome Parameter Set',
    'DF812A' : 'DD Card (Track1)',
    'DF812B' : 'DD Card (Track2)',
    'DF812C' : 'Mag-stripe CVM Capability – No CVM Required',
    'DF812D' : 'Message Hold Time',
    'DF8130' : 'Hold Time Value',
    'DF8131' : 'Phone Message Table',
    'DF8132' : 'Minimum Relay Resistance Grace Period',
    'DF8133' : 'Maximum Relay Resistance Grace Period',
    'DF8134' : 'Terminal Expected Transmission Time For Relay Resistance CAPDU',
    'DF8135' : 'Terminal Expected Transmission Time For Relay Resistance RAPDU',
    'DF8136' : 'Relay Resistance Accuracy Threshold',
    'DF8137' : 'Relay Resistance Transmission Time Mismatch Threshold',
    'FF8101' : 'Torn Record',
    'FF8102' : 'Tags To Write Before Gen AC',
    'FF8103' : 'Tags To Write After Gen AC',
    'FF8104' : 'Data To Send',
    'FF8105' : 'Data Record',
    'FF8106' : 'Discretionary Data',



    //master card
    'C6': 'PIN Try Limit',
    '9F17': 'PIN Try Counter',
    '9F6C' : 'Mag Stripe Application Version Number',
    '9F62' : 'Track 1 Bit Map for CVC3 (PCVC3TRACK1)',
    '9F63' :'Track 1 Bit Map for UN and ATC (PUNATCTRACK1)',
    '56' : 'Track 1 Data',
    '9F64' : 'Track 1 Nr of ATC Digits (NATCTRACK1)',
    '9F65' : 'Track 2 Bit Map for CVC3 (PCVC3TRACK2)',
    '9F66' : 'Track 2 Bit Map for UN and ATC (PUNATCTRACK2)',
    '9F6B' : 'Track 2 Data',
    '9F67' : 'Track 2 Nr of ATC Digits (NATCTRACK2)',
    '9F5B' : 'DSDOL',
    '9F51' : 'DRDOL',
    '9F5F' : 'DS Slot Availability',
    '9F7F' : 'DS Unpredictable Number',
    '9F7D' : 'DS Summary 1',
    '9F6F' : 'DS Slot Management Control',
    '9F54' : 'DS ODS Card',
    'DF36' : 'PIN Decipherments Error Counter Limit',
    'DF3A' : 'AC Session Key Counter Limit (contact)',
    'DF32' : 'SMI Session Key Counter Limit (contact)',
    'DF34' : 'AC Session Key Counter Limit (contactless)',
    'DF33' : 'SMI Session Key Counter Limit (contactless)',
    'C9' : 'Accumulator 1 Currency Code',
    'D1' : 'Accumulator 1 Currency Conversion Table',
    'CA' : 'Accumulator 1 Lower Limit',
    'CB' : 'Accumulator 1 Upper Limit',
    'DF16' : 'Accumulator 2 Currency Code',
    'DF17' : 'Accumulator 2 Currency Conversion Table',
    'DF18' : 'Accumulator 2 Lower Limit',
    'DF19' : 'Accumulator 2 Upper Limit',
    'D3' : 'Additional check table',
    '9F7E' : 'Application life cycle data',
    'C7' : 'CDOL1 related data length',
    'DF1F' : 'Counter 2 Lower Limit',
    'DF21' : 'Counter 2 Upper Limit',
    'C8' : 'CRM Country Code',
    'D6' : 'Default ARPC Response Code',
    'DE' : 'Log Data Table',
    'DF24' : 'MTA Currency Code',
    'DF27' : 'Number of Days Offline Limit',
    'DF11' : 'Accumulator 1 Control (contact)',
    'DF12' : 'Accumulator 1 Control (contactless)',
    'DF28' : 'Accumulator 1 CVR Dependency Data (contact)',
    'DF29' : 'Accumulator 1 CVR Dependency Data (contactless)',
    'DF14' : 'Accumulator 2 Control (contact)',
    'DF15' : 'Accumulator 2 Control (contactless)',
    'DF2A' : 'Accumulator 2 CVR Dependency Data (contact)',
    'DF2B' : 'Accumulator 2 CVR Dependency Data (contactless)',
    'D5' : 'Application Control (contact)',
    'D7' : 'Application Control  (contactless) ',
    'D8' : 'Application Interchange Profile contactless',
    'C4' : 'Card Issuer Action Code – Default (contact)',
    'CD' : 'Card Issuer Action Code – Default (contactless) ',
    'C5' : 'Card Issuer Action Code - Online (contact)',
    'CE' : 'Card Issuer Action Code - Online (contactless)',
    'C3' : 'Card Issuer Action Code - Decline (contact)',
    'CF' : 'Card Issuer Action Code - Decline (contactless)',
    'DF1A' : 'Counter 1 control (Contact)',
    'DF1B' : 'Counter 1 control (contactless)',
    'DF2C' : 'Counter 1 CVR Dependency Data (Contact)',
    'DF2D' : 'Counter 1 CVR Dependency Data (contactless)',
    'DF1D' : 'Counter 2 control (Contact)',
    'DF1E' : 'Counter 2 control (contactless)',
    'DF2E' : 'Counter 2 CVR Dependency Data (Contact)',
    'DF2F' : 'Counter 2 CVR Dependency Data (contactless)',
    'DF30' : 'Interface Enabling Switch',
    'DF22' : 'MTA CVM (contact)',
    'DF23' : 'MTA CVM (contactless)',
    'DF25' : 'MTA NoCVM (contact)',
    'DF26' : 'MTA NoCVM (contactless)',
    'DF3F' : 'Read Record Filter (contact)',
    'DF40' : 'Read Record Filter (contactless)',
    'DF3E' : 'Interface Identifier (contactless)',
    'DF3C' : 'CVR Issuer Discretionary Data (contact)',
    'DF3D' : 'CVR Issuer Discretionary Data (contactless)',
    'DF3B' : 'Accumulator 1 Amount',
    'DF13' : 'Accumulator 2 Amount',
    'DF1C' : 'Counter 1 Number',
    'DF20' : 'Counter 2 Number',
    'DF38' : 'ICVC3 TRACK1 (contact)',
    'DC' : 'ICVC3 TRACK1 (contactless)',
    'DF39' : 'ICVC3 TRACK2 (contact)',
    'DD' : 'ICVC3 TRACK2 (contactless)',


    //master data storage
    '9F5C' : 'DS Requested Operator ID',


    // CPA
    'C1' : 'Application Control'

};


Dictionary.setTlv = function (tag) {

};

var toNumber = require('./util').toNumber;
var gpoResp = require('./decoder/Gpo');
var record = require('./decoder/Record');

var func = [];


function Map(tag) {
    tag = toNumber(tag);
    return func[tag];
}

Map.TAG_CARDHOLDER_NAME = 0x5f20;
Map.TAG_CDOL1   = 0x8C;
Map.TAG_CDOL2   = 0x8D;
Map.TAG_CVMLIST = 0x8E;
Map.TAG_ISSUER_COUNTRYT_CODE = 0x5F28;
Map.TAG_SERVICE_CODE = 0x5F30;

Map.TAG_AIP    = 0x82;
Map.TAG_AIP_CL = 0xD8;

func[Map.TAG_CARDHOLDER_NAME] = record.CardHolderName;
func[Map.TAG_CDOL1] = record.CDOL1;
func[Map.TAG_CDOL2] = record.CDOL2;
// func[Map.TAG_CVMLIST] = record.CVMList;
func[Map.TAG_ISSUER_COUNTRYT_CODE] = record.IssuerCountryCode;
func[Map.TAG_SERVICE_CODE] = record.ServiceCode;


func[Map.TAG_AIP]    = gpoResp.ApplicationInterchangeProfile;
func[Map.TAG_AIP_CL] = gpoResp.ApplicationInterchangeProfile;

Dictionary.getName = function(tag) {
    // fixme i need more tags
    return emvDictionary[tag];
};


Dictionary.getInfo = function(tlv) {

    tlv.desc = Map(tlv.getTag());
    tlv.setName(Dictionary.getName());
};


module.exports = Dictionary;
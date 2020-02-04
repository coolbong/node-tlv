// exmaple for build PSE Record
// EMV 4.3 Book 1
// Table 46: Payment System Directory Record Format
// Tag '70'  | Data Length (L) | Tag '61' | Length | Directory entry 1 (ADF)
// EMV 4.3 Book 1 
// Table 47: ADF Directory Entry Format
// '4F'   5–16 ADF Name M
// '50'   1–16 Application Label M
// '9F12' 1–16 Application Preferred Name O
// '87'   1    Application Priority Indicator O
// '73'   var. Directory Discretionary Template O
// CAPDU: 00B2010C00
// RAPDU: 702861264F07A0000000041010870101500A4D4153544552434152449F120B43495449204D4153544552
// 70   28(40) [READ RECORD Response Message Template]
//    61   26(38) [Directory Entry]
//        4F   07( 7) [ADF Name]: A0000000041010
//        87   01( 1) [Application Priority Indicator]: 01
//        50   0A(10) [Application Label]: MASTERCARD
//        9F12 0B(11) [Application Preferred Name]: CITI MASTER

const assert = require('assert');
const TLV = require('../lib/TLV.js');

// step 1 build leaf
const adf_name      = new TLV('4F',   'A0000000041010');        // aid for mastercard
const app_priority  = new TLV('87',   '01'); 
const app_label     = new TLV('50',   '4D415354455243415244'); // MASTERCARD
const app_pref_name = new TLV('9F12', '43495449204D4153544552'); // CITI MASTER

// step 2 build directory entry '61'
const dir_entry = new TLV('61', adf_name + app_priority + app_label + app_pref_name);

// step 3 build read record response message template
const record_template = new TLV('70', dir_entry.getTLV());

assert(record_template.toString() === '702861264F07A0000000041010870101500A4D4153544552434152449F120B43495449204D4153544552');
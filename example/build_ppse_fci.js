// exmaple for build PPSE FCI
// EMV Contactless Book B Entry Point Specification 
// Table 3-2: SELECT Response Message Data Field (FCI) of the PPSE
//'6F' FCI Template M
//    '84' DF Name ('2PAY.SYS.DDF01') O
//    'A5' FCI Proprietary Template M
//        'BF0C' FCI Issuer Discretionary Data M
//        '61' Directory Entry M
//            '4F'   ADF Name M
//            '50'   Application Label O
// example for my credit card real data
// CAPDU: 00A404000E325041592E5359532E4444463031
// RAPDU: 6F2C840E325041592E5359532E4444463031A51ABF0C1761154F07A0000000031010500A56495341435245444954
// 6F  2C(44) [FCI Template]
//     84  0E(14) [DF Name]: 325041592E5359532E4444463031
//     A5  1A(26) [FCI Proprietary Template] 
//         BF0C  17(23) [FCI Issuer Discretionary Data]
//            61  15(21) [Directory Entry]
//                4F  07( 7) [ADF Name]: A0000000031010
//                50  0A(10) [Application Label]: VISACREDIT

const assert = require('assert');
const TLV = require('../lib/TLV.js');

// step 1 build leaf
const df_name = new TLV('84', '325041592E5359532E4444463031'); // DF name for PPSE
const adf_name = new TLV('4F', 'A0000000031010'); // aid for visa
const app_label = new TLV('50', '56495341435245444954'); // VISACREDIT

// step 2 build directory entry '61'
const dir_entry = new TLV('61', adf_name.getTLV()+app_label.getTLV());

// step 3 build FCI Issuer Discretionary data ' BF0C'
const issuer_discretionary_data = new TLV('BF0C', dir_entry.getTLV());

// step 4 build FCI Proprietary Template 'A5'
const fci_proprietary_template = new TLV('A5', issuer_discretionary_data.getTLV());

// step 5 build FCI template '6F'
const fci_template = new TLV('6F',  df_name.getTLV() + fci_proprietary_template.getTLV());

assert(fci_template.getTLV() === '6F2C840E325041592E5359532E4444463031A51ABF0C1761154F07A0000000031010500A56495341435245444954');
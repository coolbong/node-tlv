// EMV CPS V1.0
// DGI '9102' SELECT Command Response (FCI Proprietary Template)
// Annex A – Common EMV Data Groupings
//Table A-14 – Data Content for DGI ‘9102’

// [M] 'A5' FCI Proprietary Template var.
// [M]     '50'   Application Label
// [C]     '87'   Application Priority Indicator
// [C]     '9F38' Processing Option Data Object List (PDOL)
// [O]     '5F2D' Language Preference
// [C]     '9F11' Issuer Code Table Index
// [O]     '9F12' Application Preferred Name
// [O]     'BF0C' FCI Issuer Discretionary Data
// example for my credit card real data
// 6F338407A0000000041010A528500A4D4153544552434152448701019F1101015F2D046B6F656E9F120B43495449204D4153544552
//    A5   28(40) [FCI Proprietary Template]: 500A4D4153544552434152448701019F1101015F2D046B6F656E9F120B43495449204D4153544552
//        50   0A(10) [Application Label]: MASTERCARD
//        87   01( 1) [Application Priority Indicator]: 01
//        9F11 01( 1) [Issuer Code Table Index]: 01
//        5F2D 04( 4) [Language Preference]: koen
//        9F12 0B(11) [Application Preferred Name]: CITI MASTER

const assert = require('assert');
const TLV = require('../lib/TLV.js');

// step 1 build leaf

const tlv_50     = new TLV('50',   '4D415354455243415244');   // MASTERCARD
const tlv_87     = new TLV('87',   '01');                     //
const tlv_9F11   = new TLV('9F11', '01');                     //Issuer Code Table Index
const tlv_5F2D   = new TLV('5F2D', '6B6F656E');               //Language Preference
const tlv_9F12   = new TLV('9F12', '43495449204D4153544552'); // CITI MASTER

// step 2 build FCI Proprietary Template
const tlv_a5 = new TLV('A5', tlv_50 + tlv_87 + tlv_9F11 + tlv_5F2D + tlv_9F12);

// step 3 build DGI 9102
const dgi_9102 = new TLV('9102', tlv_a5, TLV.DGI);

assert(dgi_9102.toString() === '91022AA528500A4D4153544552434152448701019F1101015F2D046B6F656E9F120B43495449204D4153544552');
assert(dgi_9102.getValue() === 'A528500A4D4153544552434152448701019F1101015F2D046B6F656E9F120B43495449204D4153544552');
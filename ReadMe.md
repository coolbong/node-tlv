# node-tlv

This package is forked from node-tlv with some additional features including:

    1. Update a given tag with given value
    2. Add a TLV under a given tag

You can find the npm package here: https://www.npmjs.com/package/node-tlv-upgraded

[![NPM](https://nodei.co/npm/node-tlv.png)](https://nodei.co/npm/node-tlv/)
[![npm version](https://img.shields.io/npm/v/node-tlv.svg?style=flat)](https://www.npmjs.com/package/node-tlv)
[![Build Status](https://travis-ci.org/coolbong/node-tlv.svg?branch=master)](https://travis-ci.org/coolbong/node-tlv)

## Example for parse FCI

```javascript
const TLV = require("node-tlv");
const assert = require("assert");
// 6F20840E315041592E5359532E4444463031A50E8801015F2D046B6F656E9F110101

const resp = "6F20840E315041592E5359532E4444463031A50E8801015F2D046B6F656E9F110101";
const tlv = TLV.parse(resp);

assert(tlv.getTag() === "6F");
assert(tlv.getLength() === 0x20);

// find dedicated file name
const df_name = tlv.find("84");

// find FCI Proprietary Template
const fci_prop_template = tlv.find("A5");
```

## Example for add a tag

```javascript
const TLV = require("node-tlv");
const assert = require("assert");

const tlv = TLV.add("6F1A840E315041592E5359532E4444463031A5088801025F2D02656E", "A5", { tagToAdd: "99", valueToAdd: "99" });
assert(tlv == "6F1D840E315041592E5359532E4444463031A50B9901998801025F2D02656E");
```

## Example for update a tag

```javascript
const TLV = require("node-tlv");
const assert = require("assert");
// 6F20840E315041592E5359532E4444463031A50E8801015F2D046B6F656E9F110101

const resp = "6F20840E315041592E5359532E4444463031A50E8801015F2D046B6F656E9F110101";
const tlv = TLV.update(
	"6F3A8407A0000000041010A52F500A4D6173746572436172649F38069F5C089F4005BF0C179F5E095413339000001513019F5D030101009F4D020B0A",
	"9F5D",
	"999999"
);
assert(tlv.value === "999999");
```

## Example for parse GPO response

```javascript
const TLV = require("node-tlv");
const assert = require("assert");

// parse TLV
const resp = "770E8202580094080801010010010301";
const tlv = TLV.parse(resp);

// response message template
assert(tlv.getTag() === "77");
assert(tlv.getLength() === 14);
assert(tlv.getValue() == "8202580094080801010010010301");

// get TLV array
const child = tlv.getChild();
assert(child.length === 2);

const first = child[0];
assert(first.getTag() === "82");

// find AIP
const aip = tlv.find(0x82);
assert(aip.getTag() === "82");
assert(aip.getLength() === 2);
assert(aip.getValue() === "5800");

// you can also use a string tag value
const afl = tlv.find("94");
assert(afl.getTag() === "94");
assert(afl.getLength() === 0x08);
assert(afl.getValue() === "0801010010010301");
```

## Example for parse PSE Record

```javascript
const TLV = require("node-tlv");
const assert = require("assert");

const resp = "702961134F08A0000000250104025004414D455887010161124F07A00000002910105004414D4558870102";
const tlv = TLV.parse(resp);

// find multiple tags
const directory_enties = tlv.findAll("61");
assert(directory_enties.length() === 2);

const directory_entry_1 = directory_enties[0];
var adf_name = directory_entry_1.find("4f");

assert(adf_name.getTag() === "4F");
assert(adf_name.getLength() > 5);
assert(adf_name.getLength() < 16);

var application_label = directory_entry_1.find("50");

assert(application_label.getTag() === "50");
assert(application_label.getLength() > 1);
assert(application_label.getLength() < 16);
```

## Exmaple for build PPSE FCI

```javascript
// EMV Contactless Book B Entry Point Specification
// Table 3-2: SELECT Response Message Data Field (FCI) of the PPSE
//'6F' FCI Template M
//    '84' DF Name (‘2PAY.SYS.DDF01’) O
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

const TLV = require("node-tlv");
const assert = require("assert");

// step 1 build leaf
const df_name = new TLV("84", "325041592E5359532E4444463031"); // DF name for PPSE
const adf_name = new TLV("4F", "A0000000031010"); // aid for visa
const app_label = new TLV("50", "56495341435245444954"); // VISACREDIT

// step 2 build directory entry '61'
const dir_entry = new TLV("61", adf_name.getTLV() + app_label.getTLV());

// step 3 build FCI Issuer Discretionary data ' BF0C'
const issuer_discretionary_data = new TLV("BF0C", dir_entry.getTLV());

// step 4 build FCI Proprietary Template 'A5'
const fci_proprietary_template = new TLV("A5", issuer_discretionary_data.getTLV());

// step 5 build FCI template '6F'
const fci_template = new TLV("6F", df_name.getTLV() + fci_proprietary_template.getTLV());
assert(fci_template.getTLV() === "6F2C840E325041592E5359532E4444463031A51ABF0C1761154F07A0000000031010500A56495341435245444954");
```

## Exmaple for build PSE record

```javascript
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
const TLV = require("node-tlv");
const assert = require("assert");

// step 1 build leaf
const adf_name = new TLV("4F", "A0000000041010"); // aid for mastercard
const app_priority = new TLV("87", "01");
const app_label = new TLV("50", "4D415354455243415244"); // MASTERCARD
const app_pref_name = new TLV("9F12", "43495449204D4153544552"); // CITI MASTER

// step 2 build directory entry '61'
const dir_entry = new TLV("61", adf_name + app_priority + app_label + app_pref_name);

// step 3 build read record response message template
const record_template = new TLV("70", dir_entry.getTLV());
assert(record_template.toString() === "702861264F07A0000000041010870101500A4D4153544552434152449F120B43495449204D4153544552");
```

## Installation

You can install the latest tag via npm:

    npm install node-tlv

##Use
node-tlv-parser

1. [Github](https://github.com/coolbong/node-tlv-parser/)
2. [Heroku](https://node-tlv-parser.herokuapp.com)

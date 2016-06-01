# node-tlv

node base tlv parser


## Example

	var TLV = require('node-tlv');
	var assert = require('assert');

	//parse TLV
	var response = '6F3A8407A0000000041010A52F500A4D6173746572436172649F38069F5C089F4005BF0C179F5E095413339000001513019F5D030101009F4D020B0A';
	var tlv = TLV.parse(response);

	var tag6F = tlv.getTag();
	assert(tag6F === '6F');

	var tag6FLength = tlv.getLength();
	assert(tag6FLength === 0x3A);

	var tag6FValue = tlv.getValue();
	assert(tag6FValue === '8407A0000000041010A52F500A4D6173746572436172649F38069F5C089F4005BF0C179F5E095413339000001513019F5D030101009F4D020B0A');


	var child = tlv.getChild();
	assert(child.length === 2);
	tlv.print();


	// find API
	var tlv84 = tlv.find(0x84);

	var tag84 = tlv84.getTag();
	assert(tag84 === '84');
	var AppId = tlv84.getValue();
	assert(AppId === 'A0000000041010');



	var tlvA5 = tlv.find('A5');
	var tagA5 = tlvA5.getTag();
	assert(tagA5 === 'A5');


	var tlv50 = tlv.find('50');
	var value = tlv50.getValue();
	var asciiValue = (new Buffer(value, 'hex')).toString();
	assert(asciiValue === 'MasterCard');


	var pdolTlv = tlv.find(0x9f38);
	assert(pdolTlv.getLength() === 6);
	assert(pdolTlv.getValue() === '9F5C089F4005');


## Installation

You can install the latest tag via npm:

	npm install node-tlv

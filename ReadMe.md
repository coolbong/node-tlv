# node-tlv

node base tlv parser

[![NPM](https://nodei.co/npm/node-tlv.png)](https://nodei.co/npm/node-tlv/)
[![npm version](https://img.shields.io/npm/v/node-tlv.svg?style=flat)](https://www.npmjs.com/package/node-tlv)
[![Build Status](https://travis-ci.org/coolbong/node-tlv.svg?branch=master)](https://travis-ci.org/coolbong/node-tlv)


## Example
	var TLV = require('node-tlv');
	var assert = require('assert');

	// parse TLV
	var resp = '770E8202580094080801010010010301';
	var tlv = TLV.parse(resp);

	// response message template 
	assert(tlv.getTag() === '77');
	assert(tlv.getLength() === 14);
	assert(tlv.getValue() == '8202580094080801010010010301');

	// get TLV array
	var child = tlv.getChild();
	assert(child.length === 2);

	var first = child[0];
	assert(first.getTag() === '82');

	// find API
	var aip = tlv.find(0x82);
	assert(aip.getTag() === '82');
	assert(aip.getLength() === 2);
	assert(aip.getValue() === '5800');

	// you can also use a string tag value
	var afl = tlv.find('94');
	assert(afl.getTag() === '94');
	assert(afl.getLength() === 0x08);
	assert(afl.getValue() === '0801010010010301');


## Installation
You can install the latest tag via npm:

	npm install node-tlv


##Use
node-tlv-parser 

1. [Github](https://github.com/coolbong/node-tlv-parser/)
2. [Heroku](https://node-tlv-parser.herokuapp.com)

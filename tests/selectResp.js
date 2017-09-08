/**
 * Created by coolbong on 2017-09-04.
 */

var assert = require('assert');
var TLV = require('../lib/TLV');

exports.selectResp = {

  'select response parse #1': function () {
    var resp = TLV.parse('6F3A8407A0000000041010A52F500A4D6173746572436172649F38069F5C089F4005BF0C179F5E095413339000001513019F5D030101009F4D020B0A9000');

    // get pdol
    var aid = resp.find('84');

    assert(aid.getTag() === '84');
    assert(aid.getLength() === 7);
    assert(aid.getValue() === 'A0000000041010');


    var pdol = resp.find('9f38');

    assert(pdol.getTag('number') === 0x9F38);
    assert(pdol.getLength() === 6);
    assert(pdol.getValue() === '9F5C089F4005');
  }

};
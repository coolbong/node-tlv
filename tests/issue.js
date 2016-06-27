/**
 * Created by coolbong on 2016-06-27.
 */


var assert = require('assert');
var TLV = require('../lib/TLV');

exports.issue = {

    'issue #1': function () {
        var list = TLV.parseList('4F07A00000000310105F2403221231');

        var firstTag = list[0];

        assert(firstTag.getTag() === '4F');
        assert(firstTag.getLength() === 7);
        assert(firstTag.getValue() === 'A0000000031010');

        var secondTag = list[1];
        assert(secondTag.getTag() === '5F24');
        assert(secondTag.getLength() === 3);
        assert(secondTag.getValue() === '221231');
    }
};


/**
 * Created by coolbong on 2017-02-14.
 */

var assert = require('assert');
var TLV = require('../lib/TLV');

exports.static = {

    'adjustTag':  {
        'blank tag #1' : function() {
            var tag = TLV.adjustTag();
            assert(tag === '');
        },
        'blank tag #2' : function() {
            var tag = TLV.adjustTag('');
            assert(tag === '');
        },
        'number tag' : function() {
            var tag = TLV.adjustTag(0x82);
            assert(tag === '82');
        },
        'hex string tag' : function() {
            var tag = TLV.adjustTag('9F1A');
            assert(tag === '9F1A')
        },
        'buffer tag': function() {
            var buf = Buffer.from('DF8120', 'hex');
            var tag = TLV.adjustTag(buf);
            assert (tag === 'DF8120');
        },
        'adjustTag #1 number' : function() {
            var num = 0x80;
            var ret = TLV.adjustTag(num);
            assert(ret === '80');
        },
        'adjustTag #2 string' : function() {
            var str = '8';
            var ret = TLV.adjustTag(str);
            assert(ret === '08');
        },
        'adjustTag #3 zero padding tag' : function() {
            var str = '00C0';
            var ret = TLV.adjustTag(str);
            assert(ret === 'C0');
        },
        'adjustTag #4 buffer #1' : function() {
            var buf = Buffer.from([0x82]);
            var ret = TLV.adjustTag(buf);
            assert(ret === '82');
        },
        'adjustTag #5 buffer #2' : function() {
            var buf = Buffer.from([0xDF, 0x30]);
            var ret = TLV.adjustTag(buf);
            assert(ret === 'DF30');
        },
        'adjustTag #6 buffer zero padding tag' : function() {
            var buf = Buffer.from([0x00, 0xDF, 0x30])
            var ret = TLV.adjustTag(buf);
            assert(ret === 'DF30');
        }
    },
    'adjustLength' : {
        'blank length #1' : function() {
            var len = TLV.adjustLength();
            assert(len === 0);
        },
        'blank length #2' : function() {
            var len = TLV.adjustLength('');
            assert(len === 0);
        },
        'number length' : function() {
            var len = TLV.adjustLength(128);
            assert(len === 128);
        },
        'string length' : function() {
            var len = TLV.adjustLength('80');
            assert(len === 128);
        }
    },
    'adjustValue' : {
        'blank value #1' : function() {
            var value = TLV.adjustValue();
            assert(value === '');
        },
        'blank value #2' : function() {
            var value = TLV.adjustValue('');
            assert(value === '');
        },
        'number value' : function() {
            function plzThrow() {
                TLV.adjustValue(256);
            }
            assert.throws(plzThrow, Error);
        },
        'string value ' : function() {
            var value = TLV.adjustValue('82')
            assert(value === '82')
        }
    }


};
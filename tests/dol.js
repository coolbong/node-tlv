/**
 * Created by coolbong on 2016-05-30.
 */
var assert = require('assert');
var TLV = require('../lib/TLV');
var DOL = TLV.DOL;

exports.dol = {
    'example' : function() {
        var dol = DOL.parse('9F5C089F4005');

        var count = dol.count(); // 2
        assert (count == 2);

        var pDolRelatedData = '';
        dol.list.forEach(function(tl) {
            var tag = tl.getTag();
            var len = tl.getLength();
            var value = Buffer.alloc(len);
            if (tag == '9F5C') {
                value.fill(0x00);
            } else if (tag == '9F40') {
                value[0] = 0x11;
                value[1] = 0x22;
                value[2] = 0x33;
                value[3] = 0x44;
                value[4] = 0x55;
            } else {
                value.fill(0x00);
            }

            pDolRelatedData += value.toString('hex');
        });

        assert(pDolRelatedData == '00000000000000001122334455');

    },
    'DOL.parse()' : function () {
        var cdol1 = '9F02069F03069F1A0295055F2A029A039C019F37049F35019F45029F4C089F34039F21039F7C14';
        var dol = DOL.parse(cdol1);
        //dol.print();
        dol.getList();
    },
    'getDolRelatedDataLength()' :function() {
        var dol = DOL.parse('9F5C089F4005');

        assert(dol.getDolRelatedDataLength() === 13);
    },
    'size()' : function() {
        var cdol1 = '9F02069F03069F1A0295055F2A029A039C019F37049F35019F45029F4C089F34039F21039F7C14';
        var dol = DOL.parse(cdol1);
        assert(dol.count() == 14);
    },
    'toTlv()' : function() {
        var tlv;
        var dol = DOL.parse('9F5C089F4005');
        var list = dol.getList();

        tlv = list[0].toTLV('00 00 00 00 00 00 00 00');
        assert(tlv instanceof TLV);
        assert(tlv.getTag() == '9F5C');
        assert(tlv.getLength() == 8);
        assert(tlv.getValue() == '0000000000000000');

        tlv = list[1].toTLV('1122334455');
        assert(tlv instanceof TLV);
        assert(tlv.getTag() == '9F40');
        assert(tlv.getLength() == 5);
        assert(tlv.getValue() == '1122334455');
    },
    'dol to tlvs 01': function() {
        var dol = DOL.parse('5F2A02');
        var list = dol.setValue('0410');

        var tlv = list[0];
        assert(tlv instanceof TLV);
        assert(tlv.getTag() == '5F2A');
        assert(tlv.getLength() == 2);
        assert(tlv.getValue() == '0410');
    },

    'dol to tlvs 02': function() {
        var dol = DOL.parse('9F02069F03069F1A0295055F2A029A039C019F37049F35019F34039B02');
        var list = dol.setValue('000000001500000000000000041080E00000000410210713004716809B221F00024800');

        // list.forEach(function(tlv) {
        //     assert(tlv instanceof TLV);
        //     //assert(tlv.getTag() == '5F2A');
        //     //assert(tlv.getLength() == 2);
        //     //assert(tlv.getValue() == '0410');
        //     tlv.print();
        // });
        var tlv = list[0];
        assert(tlv instanceof TLV);
        assert(tlv.getTag() == '9F02');
        assert(tlv.getLength() == 6);
        assert(tlv.getValue() == '000000001500');

        tlv = list[1];
        assert(tlv instanceof TLV);
        assert(tlv.getTag() == '9F03');
        assert(tlv.getLength() == 6);
        assert(tlv.getValue() == '000000000000');

        tlv = list[2];
        assert(tlv instanceof TLV);
        assert(tlv.getTag() == '9F1A');
        assert(tlv.getLength() == 2);
        assert(tlv.getValue() == '0410');

        tlv = list[3];
        assert(tlv instanceof TLV);
        assert(tlv.getTag() == '95');
        assert(tlv.getLength() == 5);
        assert(tlv.getValue() == '80E0000000');

        tlv = list[4];
        assert(tlv instanceof TLV);
        assert(tlv.getTag() == '5F2A');
        assert(tlv.getLength() == 2);
        assert(tlv.getValue() == '0410');

        tlv = list[5];
        assert(tlv instanceof TLV);
        assert(tlv.getTag() == '9A');
        assert(tlv.getLength() == 3);
        assert(tlv.getValue() == '210713');

        tlv = list[6];
        assert(tlv instanceof TLV);
        assert(tlv.getTag() == '9C');
        assert(tlv.getLength() == 1);
        assert(tlv.getValue() == '00');

        tlv = list[7];
        assert(tlv instanceof TLV);
        assert(tlv.getTag() == '9F37');
        assert(tlv.getLength() == 4);
        assert(tlv.getValue() == '4716809B');

        tlv = list[8];
        assert(tlv instanceof TLV);
        assert(tlv.getTag() == '9F35');
        assert(tlv.getLength() == 1);
        assert(tlv.getValue() == '22');

        tlv = list[9];
        assert(tlv instanceof TLV);
        assert(tlv.getTag() == '9F34');
        assert(tlv.getLength() == 3);
        assert(tlv.getValue() == '1F0002');

        tlv = list[10];
        assert(tlv instanceof TLV);
        assert(tlv.getTag() == '9B');
        assert(tlv.getLength() == 2);
        assert(tlv.getValue() == '4800');
    }

};
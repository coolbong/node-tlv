/**
 * Created by coolbong on 2016-03-23.
 *
 * reference http://www.openscdp.org/scsh3/tlv.html
 * ISO7816-4 5.2 Data object
 */

// constant

var Dictionary = require('./Dictionary');

function TLV (tag, value) {
    //console.log('tag: ' + tag + ' value: ' + toHexString(value));
    // fixme check parameter validation
    value = value || '';


    this.tag    = TLV.adjustTag(tag);     //string
    this.value  = TLV.adjustValue(value);  //string
    this.length = this.value.length / 2;   //number

    if (Buffer.isBuffer(this.value)) {
        this.bValue = this.value;            //buffer
    } else if (typeof this.value == 'string') {
        this.bValue = new Buffer(this.value, 'hex');
    }

    // buffered data
    this.bTag = new Buffer(this.tag, 'hex');
    this.bLength = TLV.getBufferLength(this.value);


    //info
    this.name = Dictionary.getName(this.tag);
    this.info = {};


    var CLASS_UNIVERSAL             = 0x00; //0000 0000 b
    var CLASS_APPLICATION           = 0x40; //0100 0000 b
    var CLASS_CONTEXT_SPECIFIC      = 0X80; //1000 0000 b
    var CLASS_PRIVATE               = 0xC0; //1100 0000 b

    var ENCODING_PRIMITIVE          = 0x00; //0000 0000 b
    var ENCODING_CONSTRUCTED        = 0x20; //0010 0000 b

    var SUBSEQUENT_BYTE             = 0x1F; //0001 1111 b
    var ANOTHER_SUBSEQUENT_BYTE     = 0x80; //1000 0000 b



    var tlv_class       = this.bTag[0] & CLASS_PRIVATE;
    var tlv_encoding    = this.bTag[0] & ENCODING_CONSTRUCTED;

    switch(tlv_class) {
        case CLASS_UNIVERSAL:
            //console.log('00 indicates a data object of the universal class');
            this.info.clazz = 'universal';
            break;
        case CLASS_APPLICATION:
            //console.log('01 indicates a data object of the application class');
            this.info.clazz = 'application';
            break;
        case CLASS_CONTEXT_SPECIFIC:
            //console.log('10 indicates a data object of the application class');
            this.info.clazz = 'context specific';
            break;
        case CLASS_PRIVATE:
            //console.log('11 indicates a data object of the application class');
            this.info.clazz = 'private';
            break;
    }

    if(tlv_encoding == ENCODING_PRIMITIVE) {
        //console.log('bit 6 value 0 indicates a primitive encoding');
        this.info.encoding = 'primitive';
    } else {
        //console.log('bit 6 value 1 indicates a constructed encoding');
        this.info.encoding = 'constructed';
    }

    //this.totalLength = bTag.length + ;

    this.totalLength = this.bTag.length + this.bLength.length + this.bValue.length;

    if(tlv_encoding == ENCODING_CONSTRUCTED) {
        var offset = 0;
        this.child = [];
        while(offset < this.length) {
            var child = TLV.parse(this.bValue.slice(offset));
            offset += child.totalLength;
            this.child.push(child);
        }
    } else {
        this.child = [];
    }
}

// static api

TLV.parse = function(data, encoding) {

    var buf;
    if (Buffer.isBuffer(data)) {
        buf = data;
    } else {
        buf = new Buffer(data, 'hex');
    }

    var lenTag = 1;
    if((buf[0] & 0x1f) == 0x1f) { // subsequent byte
        var idx = 1;
        do {
            lenTag++;
        }while((buf[idx] & 0x80) == 0x80); // another subsequent byte

        if (idx > 4) {
            console.log('Invalid tag length');
        }
    }

    // handle tag
    var tag = toHexString(buf.slice(0, lenTag));

    var lenOffset = lenTag;
    var len = 1;

    //81, 82, 83, 84
    if((buf[lenOffset] & 0x80) == 0x80) {
        len = (buf[lenOffset] & 0x7F) + 1;
    }

    // handle length
    var length;

    if (len == 1) {
        length = buf[lenOffset];
    } else if (len == 2) {
        length = buf[(lenOffset + 1)];
    } else if (len == 3) {
        length = (buf[(lenOffset+1)] << 8) | buf[(lenOffset+2)];
    } else if (len == 4) {
        length = (buf[(lenOffset+1)] << 16) | (buf[(lenOffset+2)] << 8) | buf[(lenOffset+3)];
    } else if (len == 5) {
        length = (buf[(lenOffset+1)] << 24) | (buf[(lenOffset+2)] << 16) | (buf[(lenOffset+3)] << 8) | (buf[(lenOffset+4)]);
    } else {
        console.log('Invalid length');
    }

    //handle value
    var value = buf.slice(lenTag + len, lenTag+len+length);

    return new TLV(tag, value, encoding);
};

TLV.prototype.getTag =  function() {
    //string
    return this.tag;
};

TLV.prototype.getLength = function() {
    //number
    return this.length;
};

TLV.prototype.getValue = function() {
    //string
    return value;
};

TLV.prototype.getLV = function() {
    return toHexString(this.bLength) + this.value;
};

TLV.prototype.getTV = function() {
    return this.tag + this.value;
};

TLV.prototype.getTLV = function() {
    return this.tag + toHexString(this.bLength) + this.value;
};

TLV.prototype.print = function(indent) {
    var tab = '\t';
    indent = indent || 0;

    var prefix = '';
    for(var i=0; i<indent; i++) {
        prefix += tab;
    }


    var tld = this.tag + ' ' + toHexString(this.bLength) + ' (' + this.length + ')';


    if (this.name !== undefined) {

        tld = tld + ' [' + this.name + ']';
    }

    console.log(prefix + tld);

    //value
    if(this.info.encoding == 'constructed') {
        for(i=0; i<this.child.length; i++) {
            this.child[i].print(indent + 1);
        }
    } else {
        console.log(prefix + tab + this.value);
    }
};



// static api
TLV.getBufferTag = function(buf) {

    // SUBSEQUENT_BYTE              0x1f 0b0001 1111
    // ANOTHER_SUBSEQUENT_BYTE      0x80 0b1000 0000

    //fixme buf length check
    if ((buf === undefined) || (buf.length === 0)) {
        console.log('Invalid data');
    }

    var lenTag = 1;
    if((buf[0] & 0x1f) == 0x1f) { // subsequent byte
        var idx = 1;
        do {
            lenTag++;
        }while((buf[idx] & 0x80) == 0x80); // another subsequent byte

        if (idx > 4) {
            console.log('Invalid tag length');
        }
    }

    return buf.slice(0, lenTag);

};

TLV.getBufferLength = function(data) {

    var buf;

    if (Buffer.isBuffer(data)) {
        buf = data;
    } else {
        //string
        buf = new Buffer(data, 'hex');
    }

    var bLen;

    // refer to Table 8 ? BER-TLV length fields in ISO/IEC 7816
    if(buf.length < 0x80) { //  0x00 ~ 0x7f
        bLen = new Buffer(1);
        bLen[0] = buf.length;
    } else if(buf.length < 0x0100) { //  0x00 ~ 0xff
        bLen = new Buffer(2);
        bLen[0] = 0x81;
        bLen[1] = buf.length;
    } else if (buf.length < 0x010000) { // 0x0000~0xffff
        bLen = new Buffer(3);
        bLen[0] = 0x82;
        bLen[1] = buf.length >>> 8;
        bLen[2] = buf.length;
    } else if (buf.length < 0x01000000) { // 0x00000000 to 0x00ffffff
        bLen = new Buffer(4);
        bLen[0] = 0x83;
        bLen[1] = buf.length >>> 16;
        bLen[2] = buf.length >>> 8;
        bLen[3] = buf.length;
    } else {
        bLen = new Buffer(5);
        bLen[0] = 0x84;
        bLen[1] = buf.length >>> 24;
        bLen[2] = buf.length >>> 16;
        bLen[3] = buf.length >>> 8;
        bLen[3] = buf.length;
    }

    //console.log(toHexString(bLen));
    return bLen;
};

TLV.adjustTag = function (tag) {

    tag = tag || '';

    var ret;

    if (typeof tag === 'number') {
        ret = toHexString(tag);
    } else if (typeof tag === 'string') {
        tag = strip(tag);
        var num = parseInt(tag, 16);
        ret = toHexString(num);
    } else if (Buffer.isBuffer(tag)) {
        ret = tag;
    } else {
        throw Error('Invalid tag type');
    }

    //console.log('adjustTag: ' + ret);

    return ret;
};

TLV.adjustValue = function(value) {
    value = value || '';

    if (Buffer.isBuffer(value)) {
        return toHexString(value);
    } else if (typeof value == 'string') {
        value = strip(value);
        if ((value.length & 0x01) == 0x01) {
            throw Error('Invalid value length');
        }
        return value
    } else {
        throw Error('Invalid value type');
    }
};

function strip(str) {
    str = str || '';
    return str.replace(/\s+/g, '');
}

// number, buffer to hex string
function toHexString(num) {
    num = num || 0;

    if (Buffer.isBuffer(num)) {
        return num.toString('hex').toUpperCase();
    } else {
        var h = num.toString(16).toUpperCase();
        if ((h.length & 1) == 1) {
            h = '0' + h;
        }
        return h;
    }
}

function multibyteLengthTest() {
    //var byte1 = '77020102';
    var byte2 = '7781CE82022000940C08010100180101011002030057134761739001010010D20122015123499999991F9F1007060111039000009F2608E13DB3D65B106EAB9F2701409F360200029F6C0200009F4B818071A88E5BCB44015E3F9D1F5024332FB2E639F7880732E8BB849ABCFC184DA262F0039299BE9B1790970ED0DD7083698BFB22D337850404E629F76736346350D867C7EF1A6B52C698D9BA778EA80E29F5A40A1A5DC2458456FA973E7F52D1F2510A339D8BE1E3961B30824B5B9E975834241C2FF4CBDDE94B5F0FA1FCC22DEFA0';

    var byte3 = '77820123';
    var byte4 = '7783012345';
    var byte5 = '778401234567';

    //TLV.parse(byte1);
    TLV.parse(byte2).print();
    //TLV.parse(byte3);
    //TLV.parse(byte4);
    //TLV.parse(byte5);

}



function main() {
    /*
    var gpo = '77 81 CE 82 02 20 00 94 0C 08 01 01 00 18 01 01 01 10 02 03 00 57 13 47 61 73 90 01 01 00 10 D2 01 22 01 51 23 49 99 99 99 1F 9F 10 07 06 01 11 03 90 00 00 9F 26 08 E1 3D B3 D6 5B 10 6E AB 9F 27 01 40 9F 36 02 00 02 9F 6C 02 00 00 9F 4B 81 80 71 A8 8E 5B CB 44 01 5E 3F 9D 1F 50 24 33 2F B2 E6 39 F7 88 07 32 E8 BB 84 9A BC FC 18 4D A2 62 F0 03 92 99 BE 9B 17 90 97 0E D0 DD 70 83 69 8B FB 22 D3 37 85 04 04 E6 29 F7 67 36 34 63 50 D8 67 C7 EF 1A 6B 52 C6 98 D9 BA 77 8E A8 0E 29 F5 A4 0A 1A 5D C2 45 84 56 FA 97 3E 7F 52 D1 F2 51 0A 33 9D 8B E1 E3 96 1B 30 82 4B 5B 9E 97 58 34 24 1C 2F F4 CB DD E9 4B 5F 0F A1 FC C2 2D EF A0';
    var data = strip(gpo);
    console.log(data);

    var num1 = 0xc;
    console.log(toHexString(num1));

    var buf = new Buffer(data, 'hex');
    console.log(toHexString(buf));
    console.log(TLV.getBufferTag(buf));
    */

    multibyteLengthTest();

    //encodeNumber(127, 1);
    //encodeNumber(128, 1);
    //encodeNumber(129, 2);
    //encodeNumber(255, 2);
}

main();

module.exports = TLV;
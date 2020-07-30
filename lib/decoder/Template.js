var bitOn = require('../util').bitOn;
var getBitOn = require('../util').getBitOn;
var u2 = require('../util').u2;
var toHexString = require('../util').toHexString;


function AccumulatorProfileControl(tlv) {
    var desc = [];
    var oneByte;
    var buf = tlv.getValue('buffer');

    oneByte = buf[0];
    desc.push('Byte 1: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80))  {
        desc.push('\tb8 Allow Accumulation');
    } else {
        desc.push('\tb8 Do Not Allow Accumulation');
    }
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Reset Accumulator with online response');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Send Accumulator in IAD');
    if (bitOn(oneByte, 0x10)) {
        desc.push('\tb5 Send Accumulator x Balance');
    } else {
        desc.push('\tb5 Send Accumulator x value');
    }

    if (bitOn(oneByte, 0x08)) desc.push('\tb4 RFU');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 RFU');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 RFU');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 RFU');

    oneByte = buf[1];
    desc.push('Byte 2: ' + toHexString(oneByte));
    // b876 RFU
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 RFU');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 RFU');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 RFU');

    if (bitOn(oneByte, 0x10)) {
        desc.push('\tb5 Use Limit Set 1');
    } else {
        desc.push('\tb5 Use Limit Set 0');
    }

    if ((oneByte & 0x0f) === 0x0f) {
        desc.push('\tb4321 Currency Conversion Not Allowed');
    } else {
        desc.push('\tb4321 Currency Conversion Table ID: ' + toHexString(oneByte & 0x0f));
    }
    

    return desc;
}

function AccumulatorControl(tlv) {
    var desc = [];

    var oneByte;
    var buf = tlv.getValue('buffer');

    //desc.push('Template: BF32');
    desc.push('byte 1-2: Accumulator Currency Code: ' + tlv.getValue().substring(0, 4));
    
    oneByte = buf[2];
    desc.push('byte 3: Accumulator Parameters: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Include ARQC Transaction in CRM Test');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Include Offline Approvals');

    return desc;
}

function CounterProfileControl(tlv) {
    var desc = [];
    var oneByte;
    var buf = tlv.getValue('buffer');

    oneByte = buf[0];
    desc.push('Template: BF36 byte1: ' + toHexString(oneByte));
    // b876 RFU
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 RFU');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 RFU');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 RFU');
    if (bitOn(oneByte, 0x10)) {
        desc.push('\tb5 Use Limit Set 1');
    } else {
        desc.push('\tb5 Use Limit Set 0');
    }

    if (bitOn(oneByte, 0x08))  {
        desc.push('\tb4 Allow Counting');
    } else {
        desc.push('\tb4 Do Not Allow Counting');
    }
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 Reset Counter with online response');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 Send Counter in IAD');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 RFU');

    return desc;
}

function CounterControl(tlv) {
    var desc = [];
    var oneByte;
    var buf = tlv.getValue('buffer');

    oneByte = buf[0];
    desc.push('byte1: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Include ARQC Transaction in CRM Test');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Include Offline Declines');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Include Offline Approval');
    if (bitOn(oneByte, 0x10)) {
        desc.push('\tb5 include always');
    } else {
        desc.push('\tb5 include only if Not Accumulated');
    }

    if (bitOn(oneByte, 0x08)) {
        desc.push('\tb4 include only if International');
    } else {
        desc.push('\tb4 include always');
    }
    if (bitOn(oneByte, 0x04)) desc.push('\tb1 RFU');
    if (bitOn(oneByte, 0x02)) desc.push('\tb1 RFU');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 RFU');

    return desc;
}

function IssuerOptionsProfileControl(tlv) {
    var desc = [];
    var oneByte;
    var buf = tlv.getValue('buffer');

    oneByte = buf[0];
    desc.push('byte1: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) {
        desc.push('\tb8 Log Transactions');
    } else {
        desc.push('\tb8 Do Not Log Transactions');
    }
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Activate Additional Check Table 1 Check');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Activate Additional Check Table 2 Check');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Activate Maximum Number of Days Offline Check');

    if (bitOn(oneByte, 0x08)) desc.push('\tb4 Reset Maximum Number of Days offline with online response');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 Allow Override of CIAC-Default for Transactions at Terminal Type 26');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 Encipher Counters portion of IAD');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 RFU');

    oneByte = buf[1];
    desc.push('byte2: 1st GAC Length: ' + toHexString(oneByte) + '(' + oneByte + ')');
    
    oneByte = buf[2];
    desc.push('byte3: 2nd GAC Length: ' + toHexString(oneByte) + '(' + oneByte + ')');
    
    oneByte = buf[3];
    desc.push('byte4: Profile CCI: ' + toHexString(oneByte));
    
    oneByte = buf[4];
    desc.push('byte5: Profile DKI: ' + toHexString(oneByte));
    
    oneByte = buf[5];
    desc.push('byte6: RFU: ' + toHexString(oneByte));
    
    oneByte = buf[6];
    desc.push('byte7: RFU for Issuer: ' + toHexString(oneByte));

    return desc;
}

function MtaProfileCotnrol(tlv) {
    var desc = [];
    var oneByte;
    var buf = tlv.getValue('buffer');

    desc.push('byte 1-2: Currency Code for Maximum Transaction Amount: ' + tlv.getValue().substring(0, 4));
    
    oneByte = buf[2];
    desc.push('byte 3: MTA parameters: ' + toHexString(oneByte));
    
    const limit_entry_id = (oneByte & 0xF0) >> 4;
    desc.push('\tb8765: Limits Entry ID: ' + limit_entry_id);

    const currency_conversion_table_id = (oneByte & 0x0F);
    if (currency_conversion_table_id === 0x0f) {
        desc.push('\tb4321: Currency Conversion Not Allowed');
    } else {
        desc.push('\tb4321: Currency Conversion Table ID: ' + currency_conversion_table_id);
    }

    oneByte = buf[3];
    desc.push('byte 4: RFU: ' + toHexString(oneByte));
    
    return desc;
}

function buildCiacBitOnString(num1, num2, num3, bit) {
    return getBitOn(num1, bit) + ' ' + getBitOn(num, bit) + ' ' + getBitOn(num, bit);
}

function Ciacs(tlv) {
    var desc = [];
    var oneByte;
    var buf = tlv.getValue('buffer');

    for (var i=0; i<3; i++) {
        var index = (6 * i);
        if (i === 0) {
            desc.push('CIAC - Decline');
        } else if (i === 1){
            desc.push('CIAC - Default');
        } else if (i === 2) {
            desc.push('CIAC - Online');
        }

        var index_decline = 0;
        var index_default = 6;
        var index_online = 12;

        oneByte = buf[index];
        dec = toHexString(buf[index_decline]);
        def = toHexString(buf[index_default]);
        onl = toHexString(buf[index_online]);
        desc.push('byte 1: decline default online: ' + `${dec} ${def} ${onl}`);
        //desc.push('byte 1: ' + toHexString(oneByte));
        
        tmp = getBitOn(buf[index_decline], 0x80) + ' ' + getBitOn(buf[index_default], 0x80) + ' ' + getBitOn(buf[index_online], 0x80)
        desc.push(tmp + ' b8 Last Online Transaction Not Completed');
        
        tmp = getBitOn(buf[index_decline], 0x40) + ' ' + getBitOn(buf[index_default], 0x40) + ' ' + getBitOn(buf[index_online], 0x40)
        desc.push(tmp + ' b7 Go Online On Next Transaction Was Set');
        
        tmp = getBitOn(buf[index_decline], 0x20) + ' ' + getBitOn(buf[index_default], 0x20) + ' ' + getBitOn(buf[index_online], 0x20)
        desc.push(tmp + ' b6 Issuer Script Processing Failed');

        tmp = getBitOn(buf[index_decline], 0x10) + ' ' + getBitOn(buf[index_default], 0x10) + ' ' + getBitOn(buf[index_online], 0x10)
        desc.push(tmp + ' b5 Issuer Authentication Failed');

        tmp = getBitOn(buf[index_decline], 0x08) + ' ' + getBitOn(buf[index_default], 0x08) + ' ' + getBitOn(buf[index_online], 0x08)
        desc.push(tmp + ' b4 Issuer Authentication Data Not Received in Previous Online Transaction');
        
        tmp = getBitOn(buf[index_decline], 0x04) + ' ' + getBitOn(buf[index_default], 0x04) + ' ' + getBitOn(buf[index_online], 0x04)
        desc.push(tmp + ' b3 PIN Try Limit Exceeded');
        
        tmp = getBitOn(buf[index_decline], 0x02) + ' ' + getBitOn(buf[index_default], 0x02) + ' ' + getBitOn(buf[index_online], 0x02)
        desc.push(tmp + ' b2 Offline PIN Verification Not Performed');

        tmp = getBitOn(buf[index_decline], 0x01) + ' ' + getBitOn(buf[index_default], 0x01) + ' ' + getBitOn(buf[index_online], 0x01)
        desc.push(tmp + ' b1 Offline PIN Verification Failed');

        //if (bitOn(oneByte, 0x80)) desc.push('\tb8 Last Online Transaction Not Completed');
        //if (bitOn(oneByte, 0x40)) desc.push('\tb7 Go Online On Next Transaction Was Set');
        //if (bitOn(oneByte, 0x20)) desc.push('\tb6 Issuer Script Processing Failed');
        //if (bitOn(oneByte, 0x10)) desc.push('\tb5 Issuer Authentication Failed');
        //if (bitOn(oneByte, 0x08)) desc.push('\tb4 Issuer Authentication Data Not Received in Previous Online Transaction');
        //if (bitOn(oneByte, 0x04)) desc.push('\tb3 PIN Try Limit Exceeded');
        //if (bitOn(oneByte, 0x02)) desc.push('\tb2 Offline PIN Verification Not Performed');
        //if (bitOn(oneByte, 0x01)) desc.push('\tb1 Offline PIN Verification Failed');

        oneByte = buf[index+1];
        desc.push('byte 2: ' + toHexString(oneByte));
        if (bitOn(oneByte, 0x80)) desc.push('\tb8 Unable To Go Online');
        if (bitOn(oneByte, 0x40)) desc.push('\tb7 Terminal Erroneously Considers Offline PIN OK');
        if (bitOn(oneByte, 0x20)) desc.push('\tb6 Script Received');
        if (bitOn(oneByte, 0x10)) desc.push('\tb5 Offline Data Authentication Failed on Previous Transaction');
        if (bitOn(oneByte, 0x08)) desc.push('\tb4 Match Found In Additional Check Table 1');
        if (bitOn(oneByte, 0x04)) desc.push('\tb3 No Match Found In Additional Check Table 1');
        if (bitOn(oneByte, 0x02)) desc.push('\tb2 Match Found In Additional Check Table 2');
        if (bitOn(oneByte, 0x01)) desc.push('\tb1 No Match Found In Additional Check Table 2');

        oneByte = buf[index+2];
        desc.push('byte 3: ' + toHexString(oneByte));
        if (bitOn(oneByte, 0x80)) desc.push('\tb8 Accumulator 1 Lower Limit Exceeded');
        if (bitOn(oneByte, 0x40)) desc.push('\tb7 Accumulator 2 Lower Limit Exceeded');
        if (bitOn(oneByte, 0x20)) desc.push('\tb6 Counter 1 Lower Limit Exceeded');
        if (bitOn(oneByte, 0x10)) desc.push('\tb5 Counter 2 Lower Limit Exceeded');
        if (bitOn(oneByte, 0x08)) desc.push('\tb4 Counter 3 Lower Limit Exceeded');
        if (bitOn(oneByte, 0x04)) desc.push('\tb3 Additional Accumulator Lower Limit Excee');
        if (bitOn(oneByte, 0x02)) desc.push('\tb2 Additional Counter Lower Limit Exceeded');
        if (bitOn(oneByte, 0x01)) desc.push('\tb1 Number of Days Offline Limit Exceeded');

        oneByte = buf[index+3];
        desc.push('byte 4: ' + toHexString(oneByte));
        if (bitOn(oneByte, 0x80)) desc.push('\tb8 Accumulator 1 Upper Limit Exceeded');
        if (bitOn(oneByte, 0x40)) desc.push('\tb7 Accumulator 2 Upper Limit Exceeded');
        if (bitOn(oneByte, 0x20)) desc.push('\tb6 Counter 1 Upper Limit Exceeded');
        if (bitOn(oneByte, 0x10)) desc.push('\tb5 Counter 2 Upper Limit Exceeded');
        if (bitOn(oneByte, 0x08)) desc.push('\tb4 Counter 3 Upper Limit Exceeded');
        if (bitOn(oneByte, 0x04)) desc.push('\tb3 Additional Accumulator Upper Limit Exceeded');
        if (bitOn(oneByte, 0x02)) desc.push('\tb2 Additional Counter Upper Limit Exceeded');
        if (bitOn(oneByte, 0x01)) desc.push('\tb1 MTA exceeded');

        oneByte = buf[index+4];
        desc.push('byte 5: ' + toHexString(oneByte));
        if (bitOn(oneByte, 0x80)) desc.push('\tb8 Cyclic Accumulator 1 Limit Exceeded');
        if (bitOn(oneByte, 0x40)) desc.push('\tb7 Cyclic Accumulator 2 Limit Exceeded');
        if (bitOn(oneByte, 0x20)) desc.push('\tb6 Additional Cyclic Accumulator Limit Exceeded');
        if (bitOn(oneByte, 0x10)) desc.push('\tb5 Check Failed');
        if (bitOn(oneByte, 0x08)) desc.push('\tb4 RFU');
        if (bitOn(oneByte, 0x04)) desc.push('\tb3 RFU');
        if (bitOn(oneByte, 0x02)) desc.push('\tb2 RFU');
        if (bitOn(oneByte, 0x01)) desc.push('\tb1 RFU');

        oneByte = buf[index+5];
        desc.push('byte 6: ' + toHexString(oneByte));
        if (bitOn(oneByte, 0x80)) desc.push('\tb8 Reserved for use by issuer');
        if (bitOn(oneByte, 0x40)) desc.push('\tb7 Reserved for use by issuer');
        if (bitOn(oneByte, 0x20)) desc.push('\tb6 Reserved for use by issuer');
        if (bitOn(oneByte, 0x10)) desc.push('\tb5 Reserved for use by issuer');
        if (bitOn(oneByte, 0x08)) desc.push('\tb4 Reserved for use by issuer');
        if (bitOn(oneByte, 0x04)) desc.push('\tb3 Reserved for use by issuer');
        if (bitOn(oneByte, 0x02)) desc.push('\tb2 Reserved for use by issuer');
        if (bitOn(oneByte, 0x01)) desc.push('\tb1 Reserved for use by issuer');
    }
    

    return desc;
}

module.exports = {
    AccumulatorProfileControl: AccumulatorProfileControl,
    AccumulatorControl: AccumulatorControl,
    CounterProfileControl: CounterProfileControl,
    CounterControl: CounterControl,
    IssuerOptionsProfileControl: IssuerOptionsProfileControl,
    MtaProfileCotnrol: MtaProfileCotnrol,
    Ciacs: Ciacs,
};
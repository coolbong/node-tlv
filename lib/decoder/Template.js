var bitOn = require('../util').bitOn;
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


module.exports = {
    AccumulatorProfileControl: AccumulatorProfileControl,
    AccumulatorControl: AccumulatorControl,
    CounterProfileControl: CounterProfileControl,
    CounterControl: CounterControl,
    IssuerOptionsProfileControl: IssuerOptionsProfileControl,
    MtaProfileCotnrol: MtaProfileCotnrol,
};
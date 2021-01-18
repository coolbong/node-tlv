/**
 * Created by coolbong on 2017-02-27.
 */

var bitOn = require('../util').bitOn;
var toHexString = require('../util').toHexString;

/**
 * CIAC (Card Issuer Action Code)
 * tag: 'C3', 'C4', 'C5', 'CD', 'CE', 'CF'
 *
 * @param tlv
 * @return {Array}
 */
function CardIssuerActionCode4Master(tlv) {
    var desc = [];

    var buf = tlv.getValue('buffer');
    var oneByte;

    oneByte = buf[0];
    desc.push('Byte 1: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Last Online Transaction Not Completed');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Unable To Go Online Indicated');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Offline PIN Verification Not Performed');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Offline PIN Verification Failed');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 PTL Exceeded');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 International Transaction');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 Domestic Transaction');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 Terminal Erroneously Considers Offline PIN OK');

    oneByte = buf[1];
    desc.push('Byte 2: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Lower Consecutive Counter 1 Limit Exceeded');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Upper Consecutive Counter 1 Limit Exceeded');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Lower Cumulative Accumulator 1 Limit Exceeded');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Upper Cumulative Accumulator 1 Limit Exceeded');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 Go Online On Next Transaction Was Set');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 Issuer Authentication Failed');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 Script Received');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 Script Failed');

    oneByte = buf[2];
    desc.push('Byte 3: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Lower Consecutive Counter 2 Limit Exceeded');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Upper Consecutive Counter 2 Limit Exceeded');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Lower Cumulative Accumulator 2 Limit Exceeded');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Upper Cumulative Accumulator 2 Limit Exceeded');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 MTA Limit Exceeded');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 Number Of Days Offline Limit Exceeded');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 Match Found In Additional Check Table');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 No Match Found In Additional Check Table');
    return desc;
}

/**
 * CIAC (Issuer Action Code) for CPA
 * tag: 'C3', 'C4', 'C5', 'CD', 'CE', 'CF'
 *
 * @param tlv
 * @return {Array}
 */
function IssuerActionCode(tlv) {
    var desc = [];

    var buf = tlv.getValue('buffer');
    var oneByte;


    oneByte = buf[0];
    desc.push('Byte 1: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Last Online Transaction Not Completed');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Go Online On Next Transaction Was Set');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Issuer Script Processing Failed');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Issuer Authentication Failed');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 Issuer Authentication Data Not Received in Previous Online Transaction');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 PIN Try Limit Exceeded');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 Offline PIN Verification Not Performed');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 Offline PIN Verification Failed');

    oneByte = buf[1];
    desc.push('Byte 2: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Unable To Go Online');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Terminal Erroneously Considers Offline PIN OK');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Script Received');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Offline Data Authentication Failed on Previous Transaction');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 Match Found In Additional Check Table 1');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 No Match Found In Additional Check Table 1');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 Match Found In Additional Check Table 2');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 No Match Found In Additional Check Table 2');

    oneByte = buf[2];
    desc.push('Byte 3: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Accumulator 1 Lower Limit Exceeded');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Accumulator 2 Lower Limit Exceeded');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Counter 1 Lower Limit Exceeded');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Counter 2 Lower Limit Exceeded');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 Counter 3 Lower Limit Exceeded');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 Additional Accumulator Lower Limit Exceeded');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 Additional Counter Lower Limit Exceeded');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 Number of Days Offline Limit Exceeded');

    oneByte = buf[3];
    desc.push('Byte 4: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Accumulator 1 Upper Limit Exceeded');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Accumulator 2 Upper Limit Exceeded');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Counter 1 Upper Limit Exceeded');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Counter 2 Upper Limit Exceeded');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 Counter 3 Upper Limit Exceeded');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 Additional Accumulator Upper Limit Exceeded');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 Additional Counter Upper Limit Exceeded');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 MTA exceeded');

    oneByte = buf[4];
    desc.push('Byte 5: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Cyclic Accumulator 1 Limit Exceeded');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Cyclic Accumulator 2 Limit Exceeded');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Additional Cyclic Accumulator Limit Exceeded');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Check Failed');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 RFU');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 RFU');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 RFU');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 RFU');

    oneByte = buf[5];
    desc.push('Byte 6: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 RFU for Issuer');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 RFU for Issuer');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 RFU for Issuer');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 RFU for Issuer');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 RFU for Issuer');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 RFU for Issuer');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 RFU for Issuer');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 RFU for Issuer');

    return desc;
}

// master application
/**
 * Application Control
 * tag:
 *   'D5'(Contact), 'D7' (Contactless)
 *
 * Description: The Application Control activates or de-activates functions in the application
 * @param tlv
 * @returns {Array}
 */
function ApplicationControl(tlv) {
    var desc = [];
    var buf = tlv.getValue('buffer');
    var oneByte;

    oneByte = buf[0];
    desc.push('byte1: ' + toHexString(oneByte));
    // Byte 1     b8 Accept Online Transactions Without ARPC
    // Byte 1     b7 Skip CIAC-Default On CAT3
    // Byte 1     b6 RFU
    // Byte 1     b5     Key For Offline Encrypted PIN Verification 0: DDA Key
    // Byte 1     b5     Key For Offline Encrypted PIN Verification 1: Dedicated Key
    // Byte 1     b4     Offline Encrypted PIN Verification
    // Byte 1     b3     Offline Plaintext PIN Verification
    // Byte 1     b2     Session Key Derivation 0: MasterCard Proprietary SKD
    // Byte 1     b2     Session Key Derivation 1: EMV CSK
    // Byte 1     b1     Encrypt Offline Counters
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Accept Online Transactions Without ARPC');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Skip CIAC-Default On CAT3');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 RFU');

    if (bitOn(oneByte, 0x10)) {
        desc.push('\tb5 Key For Offline Encrypted PIN Verification 1: Dedicated Key');
    } else {
        desc.push('\tb5 Key For Offline Encrypted PIN Verification 0: DDA Key');
    }

    if (bitOn(oneByte, 0x08)) {
        desc.push('\tb4 Offline Encrypted PIN Verification');
    } else {
        desc.push('\tb4 Offline Encrypted PIN verification is not supported');
    }

    if (bitOn(oneByte, 0x04)) {
        desc.push('\tb3 Offline Plaintext PIN Verification');
    } else {
        desc.push('\tb3 Offline Plaintext PIN verification is not supported');
    }

    if (bitOn(oneByte, 0x02)) {
        desc.push('\tb2 Session Key Derivation 1: EMV CSK');
    } else {
        desc.push('\tb2 Session Key Derivation 0: MasterCard Proprietary SKD');
    }
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 Encrypt Offline Counters');


    oneByte = buf[1];
    desc.push('byte2: ' + toHexString(oneByte));
    // Byte 2     b3     Additional Check Table
    // Byte 2     b2     Allow Retrieval Of Balance
    // Byte 2     b1     Include Counters In AC
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 Additional Check Table');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 Allow Retrieval Of Balance');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 Include Counters In AC');

    oneByte = buf[2];
    desc.push('byte3: ' + toHexString(oneByte));
    // Byte 3     b87     Compute Cryptographic Checksum 00: RFU
    // Byte 3     b87     Compute Cryptographic Checksum 01: Compute Cryptographic Checksum Supported
    // Byte 3     b87     Compute Cryptographic Checksum 10: Compute Cryptographic Checksum Not Supported
    // Byte 3     b87     Compute Cryptographic Checksum 11: RFU
    // Byte 3     b6     Decline If CDA Not Requested And RRP Performed
    // Byte 3     b5     Go Online If RRP Not Performed
    // Byte 3     b4     Decline If Unable To Go Online And RRP Not Performed
    // Byte 3     b3     Use M/Chip 4 CDOL1
    // Byte 3     b2     Enable Alternate Interface After TC Generated
    // Byte 3     b1     Enable Alternate Interface After Successful Verify

    if ((oneByte & 0xc0) === 0x40) {
        desc.push('\tCompute Cryptographic Checksum 01: Compute Cryptographic Checksum Supported');
    } else if ((oneByte & 0xc0) === 0x80) {
        desc.push('\tCompute Cryptographic Checksum 10: Compute Cryptographic Checksum Not Supported');
    } else {
        desc.push('\tCompute Cryptographic Checksum 00 or 11: RFU');
    }

    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Decline If CDA Not Requested And RRP Performed');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Go Online If RRP Not Performed');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 Decline If Unable To Go Online And RRP Not Performed');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 Use M/Chip 4 CDOL1');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 Enable Alternate Interface After TC Generated');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 Enable Alternate Interface After Successful Verify');


    oneByte = buf[3];
    desc.push('byte4: ' + toHexString(oneByte));
    // Byte 4     b8     Include Transaction In CRM If ARQC Is Requested
    // Byte 4     b7     Use CIAC-online To Decide On ARQC Request
    // Byte 4     b6     Generate Only TC Or AAC On TC Request
    // Byte 4     b5     MTA Check
    // Byte 4     b4     Maximum Number Of Days Offline Check
    // Byte 4     b3     Include RRP Data in Counters
    // Byte 4     b2     Plaintext Offline Change PIN
    // Byte 4     b1     Encrypted Offline Change PIN
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Include Transaction In CRM If ARQC Is Requested');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Use CIAC-online To Decide On ARQC Request');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 Generate Only TC Or AAC On TC Request');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 MTA Check');
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 Maximum Number Of Days Offline Check');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 Include RRP Data in Counters');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 Plaintext Offline Change PIN');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 Encrypted Offline Change PIN');

    oneByte = buf[4];
    desc.push('byte5: ' + toHexString(oneByte));
    // Byte 5     b8     AAC Logging
    // Byte 5     b7     TC Logging
    // Byte 5     b6     ARQC Pre-logging
    // Byte 5     b5     Include Last Online ATC in IAD
    // Byte 5     b432   Issuer Host Backwards Compatibility 000: No Host Backwards Compatibility
    // Byte 5     b432   Issuer Host Backwards Compatibility 001: V2.1/V2.2 Host Backwards Compatibility
    // Byte 5     b432   Issuer Host Backwards Compatibility 010: V2.05 Host Backwards Compatibility
    // Byte 5     b432   Issuer Host Backwards Compatibility 011: V1.1/V1.3 Host Backwards Compatibility
    // Byte 5     b432   Issuer Host Backwards Compatibility 1xx: RFU
    // Byte 5     b1     Partial Authorization

    if (bitOn(oneByte, 0x80)) desc.push('\tb8 AAC Logging');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 TC Logging');
    if (bitOn(oneByte, 0x20)) desc.push('\tb6 ARQC Pre-logging');
    if (bitOn(oneByte, 0x10)) desc.push('\tb5 Include Last Online ATC in IAD');


    if ((oneByte & 0x0E) === 0x00) {
        desc.push('\tb432 Issuer Host Backwards Compatibility 000: No Host Backwards Compatibility');
    } else if ((oneByte & 0x0E) === 0x02) {
        desc.push('\tb432 Issuer Host Backwards Compatibility 001: V2.1/V2.2 Host Backwards Compatibility');
    } else if ((oneByte & 0x0E) === 0x04) {
        desc.push('\tb432 Issuer Host Backwards Compatibility 010: V2.05 Host Backwards Compatibility');
    } else if ((oneByte & 0x0E) === 0x06) {
        desc.push('\tb432 Issuer Host Backwards Compatibility 011: V1.1/V1.3 Host Backwards Compatibility');
    }

    if (bitOn(oneByte, 0x01)) desc.push('\tb1 Partial Authorization');

    oneByte = buf[5];
    desc.push('byte6: ' + toHexString(oneByte));
    // Byte 6     b8     Enable Alternate Interface After First Gen AC
    // Byte 6     b7     Save Accumulators And Counters on ARQC Response
    // Byte 6     b6     AC for MAS4C 0: AAC
    // Byte 6     b6     AC for MAS4C 1: ARQC
    // Byte 6     b5     Key for MAS4C Processing Flow 0: AC Master Key
    // Byte 6     b5     Key for MAS4C Processing Flow 1: AC Master Key (MAS4C)
    // Byte 6     b4     Torn Transaction Recovery
    // Byte 6     b3     MAS4C Processing Flow
    // Byte 6     b2     Reset Script Counter With Online Response
    // Byte 6     b1     Allow Retrieval Of Transaction Log Records
    if (bitOn(oneByte, 0x80)) desc.push('\tb8 Enable Alternate Interface After First Gen AC');
    if (bitOn(oneByte, 0x40)) desc.push('\tb7 Save Accumulators And Counters on ARQC Response');
    if (bitOn(oneByte, 0x20)) {
        desc.push('\tb6 AC for MAS4C 0: AAC');
    } else {
        desc.push('\tb6 AC for MAS4C 1: ARQC');
    }
    if (bitOn(oneByte, 0x01)) {
        desc.push('\tb5 Key for MAS4C Processing Flow 1: AC Master Key (MAS4C)');
    } else {
        desc.push('\tb5 Key for MAS4C Processing Flow 0: AC Master Key');
    }
    if (bitOn(oneByte, 0x08)) desc.push('\tb4 Torn Transaction Recovery');
    if (bitOn(oneByte, 0x04)) desc.push('\tb3 MAS4C Processing Flow');
    if (bitOn(oneByte, 0x02)) desc.push('\tb2 Reset Script Counter With Online Response');
    if (bitOn(oneByte, 0x01)) desc.push('\tb1 Allow Retrieval Of Transaction Log Records');

    return desc;
}

function ApplicationControl4Cpa(tlv) {
    var desc = [];
    var buf = tlv.getValue('buffer');
    var oneByte;

    oneByte = buf[0];
    desc.push('byte1: ' + toHexString(oneByte));

    if (bitOn(oneByte, 0x80)) desc.push('\tB1b8 1 Issuer Authentication Required to be performed');
    if (bitOn(oneByte, 0x40)) desc.push('\tB1b7 1 Issuer Authentication Required to Pass when Performed');
    if (bitOn(oneByte, 0x20)) desc.push('\tB1b6 1 Issuer Authentication Requirements apply to Resetting of Non-Velocity-Checking Indicators and Counters)');
    if (bitOn(oneByte, 0x10)) desc.push('\tB1b5 1 Issuer Authentication Requirements apply to Resetting of Velocity-Checking Counters)');
    if (bitOn(oneByte, 0x08)) { 
        desc.push('\tB1b4 1 [Enciphered PIN] Use ICC PIN Encipherment Public/Private key pair');
    } else {
        desc.push('\tB1b4 0 [Enciphered PIN] Use ICC Public/Private key pair');
    }
    if (bitOn(oneByte, 0x04)) desc.push('\tB1b3 1 Offline Enciphered PIN Verification Supported');
    if (bitOn(oneByte, 0x02)) desc.push('\tB1b2 1 Offline Plaintext PIN Verification Supported');
    if (bitOn(oneByte, 0x01)) desc.push('\tB1b1 1 Allow Retrieval of Values and Limits of Accumulators and Counters');
    
    oneByte = buf[1];
    desc.push('byte2: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) { 
        desc.push('\tB2b8  1  Use Default Update Counters if CSU is Generated by Issuer Proxy');
    } else {
        desc.push('\tB2b8  0  Use Update Counters Received in CSU if CSU is Generated by Issuer Proxy'); 
    }
    
    if ((oneByte & 0x60) === 0x00) {
        desc.push('\tB2b76 00 Do Not Update Offline Counters');
    } else if ((oneByte & 0x60) === 0x40) {
        desc.push('\tB2b76 01 Set Offline Counters to Upper Offline Limits');
    } else if ((oneByte & 0x60) === 0x20) {
        desc.push('\tB2b76 10 Reset Offline Counters to Zero');
    } else {
        desc.push('\tB2b76 11 Add Transaction to Offline Counters');
    }

    if (bitOn(oneByte, 0x08)) { desc.push('\tB2b4  1  Activate Profile Selection File'); }
    if (bitOn(oneByte, 0x04)) { desc.push('\tB2b3  1  Amounts Included in CDOL2'); }
    if (bitOn(oneByte, 0x02)) { desc.push('\tRFU'); }
    if (bitOn(oneByte, 0x01)) { desc.push('\tRFU'); }

    oneByte = buf[2];
    desc.push('byte3: ' + toHexString(oneByte));
    if (bitOn(oneByte, 0x80)) { desc.push('\tB3b8 1 Log Declined Transactions'); }
    if (bitOn(oneByte, 0x40)) { desc.push('\tB3b7 1 Log Approved Transactions'); }

    if (bitOn(oneByte, 0x20)) { 
        desc.push('\tB3b6 1 Log Offline Only'); 
    } else {
        desc.push('\tB3b6 0 Log Both Offline and Online');
    }
    if (bitOn(oneByte, 0x10)) { desc.push('\tB3b5 1 Log the ATC'); }
    if (bitOn(oneByte, 0x08)) { desc.push('\tB3b4 1 Log the CID'); }
    if (bitOn(oneByte, 0x04)) { desc.push('\tB3b3 1 Log the CVR'); }
    if (bitOn(oneByte, 0x02)) { desc.push('\tB3b2 1 Log the Profile ID'); }
    if (bitOn(oneByte, 0x01)) { desc.push('\tB3b1 1 RFU'); }

    oneByte = buf[3];
    desc.push('byte4: ' + toHexString(oneByte));
    if ((oneByte & 0xF0) !== 0x00) {
        desc.push('Reserved for use by Payment Systems for optional extensions');
    }

    if ((oneByte & 0x0F) !== 0x00) {
        desc.push('Reserved for use by Issuer');
    }

    return desc;
}

function LogFormat(tlv) {
    var dol = tlv.parseDolValue();

    var desc = [];
    desc.push('LogFormat: 9F4F DOL Related Data length: ' + toHexString(dol.getDolRelatedDataLength()) + ' (' + dol.getDolRelatedDataLength() + ')');
    var dolList = dol.getList();
    dolList.forEach(function (tl) {
        desc.push(tl.getTag() + ' ' + tl.getL() + ' (' + tl.getLength() + ') ' + tl.getName());
    });

    return desc;
}

module.exports = {
    CardIssuerActionCode4Master: CardIssuerActionCode4Master,
    IssuerActionCode: IssuerActionCode,
    ApplicationControl: ApplicationControl,
    LogFormat: LogFormat,
    ApplicationControl4Cpa: ApplicationControl4Cpa,
};
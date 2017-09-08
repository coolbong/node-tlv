/**
 * Created by coolbong on 2017-09-04.
 */


var assert = require('assert');
var TLV = require('../lib/TLV');

exports.gpoResp = {

  'gpo response parse #1': function () {
    var resp = TLV.parse('771A82027900941408010100100104011801050028010301300101009000');
    if (resp.getTag() === '80') {

    } else {
      var aip = resp.find('82');
      var afl = resp.find('94');

      assert(aip.getTag() === '82');
      assert(aip.getLength() === 2);
      assert(aip.getValue() === '7900');

      assert(afl.getTag() === '94');
      assert(afl.getLength() === 0x14);
      assert(afl.getValue() === '0801010010010401180105002801030130010100');
    }
  },
  'gpo response parse #2': function() {
    var resp = TLV.parse('80161C0008010100100102001801020020010100280101019000');
    if (resp.getTag() === '80') {
      // format 1
      var value = resp.getValue('buffer');

      var aipValue = value.slice(0, 2);
      var aflValue = value.slice(2);
      var aip = new TLV('82', aipValue);
      var afl = new TLV('94', aflValue);


      assert(aip.getTag() === '82');
      assert(aip.getLength() === 2);
      assert(aip.getValue() === '1C00');

      assert(afl.getTag() === '94');
      assert(afl.getLength() === 20);
      assert(afl.getValue() === '0801010010010200180102002001010028010101');

      // extra function
      var cmds = afl.getCommand();
      //console.log(cmds);
      assert(cmds.length === 7);
      assert(cmds[0] === '00B2010C00');

    } else {
      // format 2
    }
  }

};

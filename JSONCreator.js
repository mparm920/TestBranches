var fs = require('fs');


var fileName = 'specRFID', byteLength = 5131, inBits = false;
  var file = fs.createWriteStream("./" + fileName + ".json");
  var json = "{bigEndian: 'true', fields: [ ";

  for(var i = 0; i < byteLength; i++) {
     if (inBits) {
       for(var j = 0; j < 8; j++) {
         json += "{name: 'Spare" + i + j + "', start: " + i + ", type: 'bit', position: " + j + "},";
       }
     } else {
       json += "{name: 'Spare" + i + "', start: " + i + ", type: 'uint8', default: 0},";
     }
  }
json.replace(json.lastIndexOf(), "");
json += " ]}"
file.write(JSON.stringify(eval("(" + json + ")"), null, 4));


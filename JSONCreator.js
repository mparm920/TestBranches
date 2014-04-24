var fs = require('fs');
var file = fs.createWriteStream("./701spec.js");
var json = "{bigEndian: 'true', fields: [ ";

for(var i = 0; i < 100; i++) {
  for(var j = 0; j < 8; j++) {
   json += "{name: 'Spare" + i + j + "', start: " + i + ", type: 'bit', position: " + j + "},";
  }
 }
json.replace(json.lastIndexOf(), "");
json += " ]}"

file.write(JSON.stringify(eval("(" + json + ")"), null, 4));

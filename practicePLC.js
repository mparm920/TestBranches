var net = require('net');
var spec = require('./eDiagHeader.json');
var decoderRing = require('decoder-ring');
var decoder = new decoderRing();

var header = new Buffer(18);
header.fill(0);
header.writeInt8(16, 8);
header.writeInt16BE(701, 12);

//console.log(header);
var buff = decoder.encode(header, spec);
var timer;

//console.log(buff);

var server  = net.createServer(function(c) {
  console.log('connected');
    
   timer = setInterval(function() {
     c.write(header)}, 5000);
  c.on('close', function() { 
    clearInterval(timer);
    console.log("Disconnected");
  });
  c.on('error', function() {
    clearInterval(timer)
    console.log('error thrown');
  });
  c.on('data', function(data) {
    console.log(decoder.decode(data, spec));
  });
}).listen(8080);


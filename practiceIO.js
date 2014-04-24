var net = require('net');
var spec = require('./eDiagHeader.json');
var spec701 = require('./701spec.json');
var decoderRing = require('decoder-ring');
var decoder = new decoderRing();
var socket = new net.Socket();
var header = new Buffer(18);
header.fill(0);
header.writeInt8(16, 8);
header.writeInt16BE(702, 12);
//socket = net.createConnection(2008, '172.16.0.205', function() {
socket = net.createConnection({port: 8080}, function() {
  console.log('connected');
});

  var header_from_PLC;
  var data_from_PlC;
  var header;
  var dataToPLC;

socket.on('data', function(data) {
  if (data.length == 18) {  
   header_from_PLC = decoder.decode(data, spec);
  }else if (typeof header_from_PLC != 'undefined') { 
    if (header_from_PLC.TestByte == 16 && header_from_PLC.DB_Num == 701) {
      data_from_PLC = decoder.decode(data, spec701);
      console.log("from PLC " + data_from_PLC.HeartBeat00);
      writeToPLC();
      console.log(header);
      socket.write(header);
      socket.write(dataToPLC);
    }
  }
});
socket.on('error', function(err) {
  socket = net.createConnection(2008, '172.16.0.205');
});
var heartBeat = 1;
var seq = 0;
var writeToPLC = function() {
  console.log("sending to PLC");
  header = new Buffer(17);
  header.fill(0);
  header.writeInt16BE(seq, 2);
  header.writeInt8(16, 8);
  header.writeInt8(2, 9);
  header.writeInt16BE(100, 10);
  header.writeInt16BE(702, 12);
  header.writeUInt8(132, 14);

  seq += 1;

  if (heartBeat == 1) {
    heartBeat = 0;
  } else {
    heartBeat = 1;
  }
  dataToPLC = new Buffer(100);   
  dataToPLC.fill(0);
  dataToPLC.writeInt8(heartBeat, 0)
  console.log("to PLC " + heartBeat);
};

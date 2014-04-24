var net = require('net');
var redis = require('./redisClient');
var spec = require('./eDiagHeader.json');
var spec701 = require('./701spec.json');
var specRFID = require('./specRFID.json');
var decoderRing = require('decoder-ring');
var decoder = new decoderRing();
var socket = new net.Socket();

socket = socket.connect(2008, '172.16.0.205', function() {
//socket = net.createConnection({port: 8080}, function() {
console.log('connected'); });

var header_from_PLC;
var data_from_PLC, data_from_Sta1, data_from_Sta2, data_from_Sta3, data_from_Sta4, RFIDData;
var headerToPLC = new Buffer(17);
var dataToPLC = new Buffer(100);

socket.on('data', function(data) {

  //console.log(data.length);
  if (data.length == 18) {  
   header_from_PLC = decoder.decode(data, spec);
  }else if (typeof header_from_PLC != 'undefined') { 
    if (header_from_PLC.TestByte == 16) {
      switch(header_from_PLC.DB_Num) {
        case 701:
          data_from_PLC = decoder.decode(data, spec701);
          break;
        case 703:
          if (dataSize(data)) {
            data_from_Sta1 = decoder.decode(RFIDData, specRFID);
            RFIDData = 0;
            console.log(data_from_Sta1); 
          }
          break;
        case 705:
          data_from_Sta2 = decoder.decode(data, specRFID);
          break;
        case 707: 
          data_from_Sta3 = decoder.decode(data, specRFID);
          break;
        case 709:
          data_from_Sta4 = decoder.decode(data, specRFID);
          break;
      } 
    }
      //writeToPLC();
  }

});
socket.on('end', function(a) {
	consoe.log("ending");
});
socket.on('close', function(a) {
	console.log("closed");
	console.log(a);
	setTimeout(function() {
  		socket.connect(2008, '172.16.0.205');
	}, 1000);
});
socket.on('error', function(err) {
  console.log("error");
  console.log(err.stack);
  //socket = socket.connect(2008, '172.16.0.205');
});

var dataSize = function(curData) {
  RFIDData += curData;
  console.log(RFIDData.length);
  if (RFIDData.length >= 5122) {
    return true;
  } else {
    return false;
  } 
}

var heartBeat = 1;
var seq = 0;
var writeToPLC = function() {
  console.log("writing");
  headerToPLC.fill(0);
  headerToPLC.writeUInt8(2, 1);
  headerToPLC.writeUInt16BE(seq, 2);
  headerToPLC.writeUInt8(16, 8);
  headerToPLC.writeUInt8(2, 9);
  headerToPLC.writeUInt16BE(100, 10);
  headerToPLC.writeUInt16BE(702, 12);
  headerToPLC.writeUInt8(132, 14);

  seq += 1;

  if (heartBeat == 1) {
    heartBeat = 0;
  } else {
    heartBeat = 1;
  }
  dataToPLC.fill(0); 
  dataToPLC.writeUInt8(parseInt(heartBeat), 0)
 // console.log("to PLC " + heartBeat);
  socket.write(headerToPLC);
  socket.write(dataToPLC);
};

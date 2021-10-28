const udp = require('dgram');
const fs = require('fs');
const functions = require('../functions');
// --------------------creating a udp server --------------------


// creating a client socket
var client = udp.createSocket('udp4');

//buffer msg

var filename = './device_simulation_2.txt'
fs.readFile(filename, function (err, cameradata){
    cameraData = String(cameradata.toString('hex'))
    DataArr = cameraData.split(cameraData.substr(0,22));
    var verifydata= functions.VerifyData(DataArr);
    console.log(verifydata)
    switch( verifydata.Status){	
        case false :		
            console.log("Some Data MISSING!!!!!!!!!!!!");
            

            break;
        case true :
            console.log("資料無缺失");
            functions.ImageData(filename);
            break;
    }
})








        
 

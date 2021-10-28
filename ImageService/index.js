const mongoose = require('mongoose');
const functions = require("../functions")

exports.createService = async(data,filename) =>{
    var RawDataProcess = require('./RawDataProcess');
    var SocketHander = require('./socket');

    RawDataProcess = new RawDataProcess(data);
    SocketHander = new SocketHander();
    
    var uuid = mongoose.Types.ObjectId();

    var decodedata = await RawDataProcess.Decode();

    SocketHander.connect();
    setTimeout(() => {
        SocketHander.storeRawData(decodedata,uuid);
    }, 500);

    functions.UploadImage(filename,uuid.toHexString());

    return "OK"
   
}





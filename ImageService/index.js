exports.createService = async(data) =>{
    var RawDataProcess = require('./RawDataProcess');
    var SocketHander = require('./socket');

    RawDataProcess = new RawDataProcess(data);
    SocketHander = new SocketHander();


    var decodedata = await RawDataProcess.Decode();
    

    SocketHander.connect();
    setTimeout(() => {
        SocketHander.storeRawData(decodedata);
    }, 500);
   

    return "OK"
   
}





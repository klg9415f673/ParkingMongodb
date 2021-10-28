var functions = require("../functions")

exports.createService = async(data,server,remote) =>{
    var DeviceDataProcess = require('./DeviceDataProcess');
    var SocketHander = require('./socket');

    DeviceDataProcess = new DeviceDataProcess(data);
    SocketHander = new SocketHander();


    var decodedata = await DeviceDataProcess.Decode();
    functions.PKS7501_sendmsg(decodedata,server,remote);

    SocketHander.connect();
    setTimeout(() => {
        SocketHander.storeDeviceData(decodedata);
    }, 200);
   
   
}





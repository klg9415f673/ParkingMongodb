exports.createService = async(data) =>{
    var DeviceDataProcess = require('./DeviceDataProcess');
    var SocketHander = require('./socket');

    DeviceDataProcess = new DeviceDataProcess(data);
    SocketHander = new SocketHander();


    var decodedata = await DeviceDataProcess.Decode();
    

    SocketHander.connect();
    setTimeout(() => {
        SocketHander.storeDeviceData(decodedata);
    }, 200);
   

    return "OK"
   
}





const RawData = require('../models/RawData');
const mongoose = require('mongoose');
const moment = require('moment');
const tz = require('moment-timezone');


class SocketHander {

    constructor() {
        this.db;
    }

    connect() {
        this.db = mongoose.connect('mongodb://localhost:27017/ParkingCamera', { useNewUrlParser: true ,useUnifiedTopology: true});
        this.db.Promise = global.Promise;
    }

    getRawData() {
        return RawData.find();
    }

    storeRawData(data) {

        console.log(JSON. stringify(data));
        const newRawData = new RawData({
            context : {
                data:data.context.data,  
                Side:data.context.Side,             
                SN: data.context.SN, 
                ImgPath: data.context.ImgPath,
                Resolution:data.context.Resolution
            }, 
    
            Device : {
                mac:data.Device.mac,
                AMR:{
                    AMR:data.Device.AMR.AMR,
                    AMR_F:data.Device.AMR.AMR_F,
                    AMR_B:data.Device.AMR.AMR_B},
                RSSI:{
                    RSSI_F:data.Device.RSSI.RSSI_F,
                    RSSI_B:data.Device.RSSI.RSSI_B},
                SolarVoltage:data.SolarVoltage,
                Temperature:data.Temperature,     
                status:data.status
            },
            timestamp:moment().valueOf()    
        });

        const doc = newRawData.save();
    }
}

module.exports = SocketHander;
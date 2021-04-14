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

    storeRawData(data,uuid) {

        console.log(JSON. stringify(data));
        var parameter = data.Parkinglot_parameter
        const newRawData = new RawData({
            _id: uuid,
            context : {
                data:data.context.data,            
                SN: data.context.SN, 
                ImgPath: data.context.ImgPath,
                Resolution:data.context.Resolution
            }, 
    
            Parkinglot_parameter = {
                MAC:parameter.MAC,
                Device_paramater:{
                    Front:{
                        AMR_F:parameter.Front.AMR_F,
                        RSSI_F:parameter.Front.RSSI_F,
                        SolarVoltage_F:parameter.Front.SolarVoltage_F,
                        Temperature_F:parameter.Front.Temperature_F,
                    },
                    Back:{
                        AMR_B:parameter.Back.AMR_B,
                        RSSI_B:parameter.Back.RSSI_B,
                        SolarVoltage_B:parameter.Back.SolarVoltage_B,
                        Temperature_B:parameter.Back.Temperature_B,
                    },
        
                },   
                parkinglot = this.data.substr(26, 4),             
                parkinglot_status:status_analysis(this.data.substr(50,2)),
                },
            timestamp:moment().valueOf(),                
            updatetime: moment().tz("Asia/Taipei").format("YYYYMMDDTHH:mm:ss.SSSZ"),
        });

        const doc = newRawData.save();
    }
}

module.exports = SocketHander;
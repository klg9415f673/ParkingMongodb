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

    getDeviceData() {
        return DeviceData.find();
    }

    storeDeviceData(data) {
        console.log(JSON. stringify(data));
        const newDeviceData ={
            _id:data.Node.Mac,
            Node:{
                Mode:{
                    device_type:data.Node.Mode.device_type,
                    conn_method:data.Node.Mode.conn_method,
                    app_place:data.Node.Mode.app_place,
                    context_type:data.Node.Mode.context_type,
                },
                Group:data.Node.Group,
                TIME_MDH:data.Node.TIME_MDH,
                GEO:data.Node.GEO,
                AREA:data.Node.AREA,
                parkinglot_code:data.Node.parkinglot_code,
                parkinglot:data.Node.parkinglot,
                Status:{
                    status:data.Node.Status.status,
                    AMR:data.Node.Status.AMR,
                    solar:data.Node.Status.solar,
                    IR:data.Node.Status.IR
                },
                AMR:data.Node.AMR,
                IR_Voltage:data.Node.IR_Voltage,
                Solar_Voltage:data.Node.Solar_Voltage,
                Power:data.Node.Power,
                Temperature:data.Node.Temperature,
                Mac:data.Node.Mac,
                
            },
            Router:{
                TIME_MS:data.Router.TIME_MS,
                GEO:data.Router.GEO,
                Solar_Voltage:data.Router.Solar_Voltage,
                Power:data.Router.Power,
                Temperature:data.Router.Temperature,
                Mac:data.Router.Mac,
                SN:data.Router.SN,
                
            },
            NB_IoT:{
                IMSI:data.NB_IoT.IMSI,
                Signal:data.NB_IoT.Signal,
            },                      
            timestamp: moment().valueOf()
        };
        
        console.log(newDeviceData.timestamp)

        mongoose.set('useFindAndModify', false);
        const doc = RawData.findOneAndUpdate({_id:data.Node.Mac}, newDeviceData,{new:true,upsert:true},
            function(err,doc) {
                if (err) { throw err; }
                else { console.log(`MongoDB ${data.Node.Mac} Updated`); }
            });  
    }
}

module.exports = SocketHander;
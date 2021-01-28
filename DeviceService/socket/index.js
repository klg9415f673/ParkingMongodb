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
            _id:data.mac.mac,
            mac:{
                mac: data.mac.mac,
                mac_F: data.mac.mac_F ,
                mac_B: data.mac.mac_B }, 
            Device:{
                Longitude:data.Device.Longitude ,
                Latitude:data.Device.Latitude ,
                Height:data.Device.Height ,
                Power:data.Device.Power ,
                IMEI:data.Device.IMEI ,
                IMSI:data.Device.IMSI ,                
                CSQ:data.Device.CSQ },   
            Version:{
                DeviceType:data.Version.DeviceType ,   
                HardwareVersion:data.Version.HardwareVersion ,   
                BLEVersion:data.Version.BLEVersion ,    
                Firmware:data.Version.Firmware },                
            timestamp: moment().valueOf()
        };
        
        console.log(newDeviceData.timestamp)

        mongoose.set('useFindAndModify', false);
        const doc = RawData.findOneAndUpdate({_id:data.mac.mac}, newDeviceData,{new:true,upsert:true},
            function(err,doc) {
                if (err) { throw err; }
                else { console.log(`MongoDB ${data.mac.mac} Updated`); }
            });  
    }
}

module.exports = SocketHander;
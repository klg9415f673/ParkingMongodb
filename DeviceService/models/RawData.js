const mongoose = require('mongoose');

const DeviceDataSchema = mongoose.Schema({
        _id:String,
        mac:{
            mac:String,
            mac_F:String,
            mac_B:String}, 
        Device:{
            Longitude:String,
            Latitude:String,
            Height:String,
            Power:String,
            IMEI:String,
            IMSI:String,                
            CSQ:String},   
        Version:{
            DeviceType:String,   
            HardwareVersion:String,   
            BLEVersion:String,    
            Firmware:String},                
        timestamp:String
})

module.exports = mongoose.model('Device', DeviceDataSchema)




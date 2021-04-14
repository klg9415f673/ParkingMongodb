const { Timestamp } = require('bson');
const { time } = require('console');
const mongoose = require('mongoose');

const RawDataSchema = mongoose.Schema({
    _id:mongoose.ObjectId,
    context : {
        data:String,  
        Side: String,      
        ImgPath: String,
        Resolution: String
    },    
    Parkinglot_parameter:{
        MAC:String,
        Device_paramater:{
            Front:{
                AMR_F:Number,
                RSSI_F:Number,
                SolarVoltage_F:Number,
                Temperature_F:Number,
            },
            Back:{
                AMR_B:Number,
                RSSI_B:Number,
                SolarVoltage_B:Number,
                Temperature_B:Number,
            },

        },   
        parkinglot:String,             
        parkinglot_status:String,
    },
    timestamp:Timestamp,
    updatetime:String,
})



module.exports = mongoose.model('RawData', RawDataSchema)




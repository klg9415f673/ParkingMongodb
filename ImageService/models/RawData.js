const mongoose = require('mongoose');

const RawDataSchema = mongoose.Schema({
    context : {
        data:String,  
        Side: String,             
        SN: String, 
        ImgPath: String,
        Resolution: String
    },    
    Device : {
        mac:String,
        AMR:{
            AMR:String,
            AMR_F:String,
            AMR_B:String},
        RSSI:{
            RSSI_F:String,
            RSSI_B:String},
        SolarVoltage:Number,
        Temperature:String,     
        status:String
    },
    timestamp:String,
})



module.exports = mongoose.model('RawData', RawDataSchema)




const mongoose = require('mongoose');

const DeviceDataSchema = mongoose.Schema({
        _id:String,
        Node:{
            Mode:{
                device_type:String,
                conn_method:String,
                app_place:String,
                context_type:String
            },
            Group:String,
            TIME_MDH:String,
            GEO:String,
            AREA:String,
            parkinglot_code:String,
            parkinglot:String,
            Status:{
                status:String,
                AMR:String,
                Solar:String,
                IR:String
            },
            AMR:String,
            IR_Voltage:Number,
            Solar_Voltage:Number,
            Power:Number,
            Temperature:Number,
            Mac:String,
           
        },
        Router:{
            TIME_MS:String,
            GEO:String,
            Solar_Voltage:String,//應該要Number，有人搞事
            Power:String,//應該要Number，有人搞事
            Temperature:String,//應該要Number，有人搞事
            Mac:String,
            SN:String,
            
        },
        NB_IoT:{
            IMSI:String,
            Signal:String,
        },                           
        timestamp:String
})

module.exports = mongoose.model('Device', DeviceDataSchema)




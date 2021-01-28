var transform = require('../transform');
var fs = require('fs')
var moment = require('moment');
const tz = require('moment-timezone');

class DeviceDataProcess {


    constructor(data) {
        this.data = String(data);
      }
 

    async Decode() {

        var Device = {
            mac:{
                mac: this.data.substr(6, 12) ,
                mac_F: this.data.substr(18, 12) ,
                mac_B: this.data.substr(30, 12) }, 
            Device:{
                Longitude:this.data.substr(42,10) ,
                Latitude:this.data.substr(52,8) ,
                Height:transform.hex2int8(this.data.substr(60,2)) ,
                Power:this.data.substr(62,2) ,
                IMEI:this.data.substr(64,16) ,
                IMSI:this.data.substr(80,16) ,                
                CSQ:this.data.substr(96,2) },   
            Version:{
                DeviceType:transform.hex2string(this.data.substr(98,16)) ,   
                HardwareVersion:transform.hex2string(this.data.substr(114,6)) ,   
                BLEVersion:transform.hex2string(this.data.substr(120,6)) ,    
                Firmware:transform.hex2string(this.data.substr(126,8)) }
        }
    
        return Device
            
    }


}

module.exports = DeviceDataProcess;



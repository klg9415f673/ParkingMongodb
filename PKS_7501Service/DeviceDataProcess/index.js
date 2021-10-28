var transform = require('../transform');
var fs = require('fs')
var moment = require('moment');
const tz = require('moment-timezone');

class DeviceDataProcess {


    constructor(data) {
        this.data = String(data);
      }
 

    async Decode() {   

        var PKS = {
            Node:{
                Mode:{
                    device_type:this.device_type(this.data.substr(2,2)),
                    conn_method:this.conn_method(this.data.substr(4,2)),
                    app_place:this.app_place(this.data.substr(6,2)),
                    context_type:this.context_type(this.data.substr(8,2)),
                },
                Group:this.data.substr(10, 2),
                TIME_MDH:this.data.substr(12, 6),
                GEO:this.data.substr(32, 8),
                AREA:this.data.substr(40, 2),
                parkinglot_code:this.data.substr(42, 2),
                parkinglot:this.data.substr(44, 4),
                Status:{
                    status:this.parking_status(this.data.substr(48, 1)),
                    AMR:this.AMR_status(this.data.substr(49, 1)),
                    solar:this.solar_status(this.data.substr(50, 1)),
                    IR:this.IR_status(this.data.substr(51, 1))
                },
                AMR:transform.hex2Decimal(this.data.substr(66, 4)),//整體(54,16)
                IR_Voltage:`${this.data.substr(70, 1)}.${this.data.substr(71, 1)}`,
                Solar_Voltage:`${this.data.substr(72, 1)}.${this.data.substr(73, 1)}`,
                Power:`${this.data.substr(74, 1)}.${this.data.substr(75, 1)}`,
                Temperature:this.data.substr(76, 2),
                Mac:this.data.substr(78, 12),
                
            },
            Router:{
                TIME_MS:this.data.substr(18, 4),
                GEO:this.data.substr(22, 10),
                Solar_Voltage:`${this.data.substr(90, 1)}.${this.data.substr(91, 1)}`,
                Power:`${this.data.substr(92, 1)}.${this.data.substr(93, 1)}`,
                Temperature:`${this.data.substr(94, 1)}.${this.data.substr(95, 1)}`,
                Mac:this.data.substr(96, 12),
                SN:this.data.substr(126, 4),
                
            },
            NB_IoT:{
                IMSI:this.data.substr(108, 16),
                Signal:this.data.substr(124, 2),
            }                   
                
        }
                            
        
    
        return PKS
            
    }

    parking_status(raw_data){
        let status = ""
        switch(raw_data){
            case "1":
                status = "有車";
                break;
            case "2":
                status = "無車";
                break;
            case "3":
                status = "未知";
                break;
            case "4":
                status = "強磁";
                break;
            case "5":
                status = "報平安";
                break;
          
        }
        
        return status;
    }

    AMR_status(raw_data){
        let status = ""
        switch(raw_data){
            case "1":
                status = "有車";
                break;
            case "2":
                status = "無車";
                break;
            case "3":
                status = "未知";
                break;
            case "4":
                status = "強磁";
                break;          
        }
        
        return status;
    }

    solar_status(raw_data){
        let status = ""
        switch(raw_data){
            case "1":
                status = "有車";
                break;
            case "2":
                status = "無車";
                break;
            case "3":
                status = "未知";
                break;     
        }
        
        return status;
    }

    IR_status(raw_data){
        let status = ""
        switch(raw_data){
            case "1":
                status = "有車";
                break;
            case "2":
                status = "無車";
                break;
            case "3":
                status = "未知";
                break;     
        }
        
        return status;
    }

    device_type(raw_data){
        let device_type = ""
        switch(raw_data){
            case "00":
                device_type = "Fix_Tag";
                break;
            case "01":
                device_type = "Mobile_Tag";
                break;
            case "02":
                device_type = "Node";
                break;
            case "03":
                device_type = "Router";
                break;
            case "04":
                device_type = "GateWay";
                break;
          
        }
        
        return device_type;
    }

    conn_method(raw_data){
        let conn_method = ""
        switch(raw_data){
            case "00":
                conn_method = "BLE_to_BLE";
                break;
            case "01":
                conn_method = "BLE_to_NBIoT";
                break;
            case "02":
                conn_method = "BLE_to_WiFi";
                break;
            case "03":
                conn_method = "NBIot_to_Net";
                break;
            case "04":
                conn_method = "LoRa_to_Net";
                break;
            case "05":
                conn_method = "WiFi_to_Net ";
                break;
          
        }
        return conn_method
    }

    app_place(raw_data){
        let app_place = ""
        switch(raw_data){
            case "00":
                app_place = "Parking";
                break;
            case "01":
                app_place = "License";
                break;
            case "02":
                app_place = "Trashcan";          
        }
        return app_place
    }

    context_type(raw_data){
        let context_type = ""
        switch(raw_data){
            case "00":
                context_type = "BLE";
                break;
            case "01":
                context_type = "QoS_Low_UDP_Without_HandShake";
                break;
            case "02":
                context_type = "QoS_Medium_UDP_With_HandShake";
                break;
            case "03":
                context_type = "QoS_High_TCP";
                break;
            case "04":
                context_type = "HTTP";
                break;
            case "05":
                context_type = "MQTT";
                break;
            case "06":
                context_type = "CoAP";
                break;
          
        }
        return context_type
    }




}



module.exports = DeviceDataProcess;



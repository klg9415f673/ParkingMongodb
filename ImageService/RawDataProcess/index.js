const transform = require('../transform');
const fs = require('fs')
const moment = require('moment');
const tz = require('moment-timezone');

class RawDataProcess {


    constructor(data) {
        this.data = String(data);
      }
 

    Decode() {      
        var mac = this.data.substr(6, 12)
        var SN = this.data.substr(18, 4)
        var MACDirPath = `E:\\ParkingUploadPicture\\${mac}\\`
        this.mkdir(MACDirPath);

        var SNDirPath = `E:\\ParkingUploadPicture\\${mac}\\${SN}\\`
        this.mkdir(SNDirPath);    
        var datainfo = this.data.split('ffc0')[1]
        var context = {
            data:this.data,       
            SN: this.data.substr(18, 4), 
            ImgPath: this.ComposePicture(),
            Resolution:`${transform.hex2uint16(datainfo.substr(10, 4))}x${transform.hex2uint16(datainfo.substr(6, 4))}`
        } 

        var Parkinglot_parameter = {
                MAC:mac,
                Device_paramater:{
                    Front:{
                        AMR_F:transform.hex2uint16(this.data.substr(30,4)),
                        RSSI_F:transform.hex2int8(this.data.substr(38,2)),
                        SolarVoltage_F:this.data.substr(42,2)/10,
                        Temperature_F:this.data.substr(46,2),
                    },
                    Back:{
                        AMR_B:transform.hex2uint16(this.data.substr(34,4)),
                        RSSI_B:transform.hex2int8(this.data.substr(40,2)),
                        SolarVoltage_B:this.data.substr(44,2)/10,
                        Temperature_B:this.data.substr(48,2),
                    },
        
                },   
                parkinglot : this.data.substr(26, 4),             
                parkinglot_status:this.status_analysis(this.data.substr(50,2)),
                }

        var imform={
                    context:context,
                    Parkinglot_parameter:Parkinglot_parameter
                }

        return imform
            
    }

    status_analysis(raw_data){
        this.raw_data = raw_data
        switch(raw_data){
            case "00":
                this.status = "初始化";
                break;
            case "01":
                this.status = "占用";
                break;
            case "02":
                this.status = "空位";
                break;  
            case "03":
                this.status = "未知";
                break;
            case "04":
                this.status = "磁場溢出";
                break;
            case "05":
                this.status = "報平安";
                break;

        }

        return this.status;

    }

    ComposePicture(){
       
        var allrawdata = ""
        var Image = this.data.split(this.data.substr(0, 22));
        Image.forEach((temp) => {
                        if (temp != "") {
                            allrawdata = allrawdata + temp.substr(30); // 8是順序碼的長度
                        }
                    })
        var mac = this.data.substr(6, 12);
        var SN = this.data.substr(18, 4);
        var path = `E:\\ParkingUploadPicture\\${mac}\\${SN}\\${moment().tz("Asia/Taipei").format("YYYYMMDD-HHmmss")}.jpg`
        var Image_buffer = Buffer.from(transform.stringToHex(allrawdata));
        setTimeout(() => {
            fs.writeFile(path, Image_buffer, function(err) {
                if(err){
                console.log(err);
                }else{
                console.log(`影像:${path} 寫入成功`);
                }
                });
        }, 500);
       
        
        return path
    }


    mkdir(path){
        fs.access(path, function(exists) {
            if(exists){
                fs.mkdirSync(path)
                console.log(`已建立新資料夾${path}`)
                
            }
        });
    }



}

module.exports = RawDataProcess;



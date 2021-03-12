var transform = require('../transform');
var fs = require('fs')
var moment = require('moment');
const tz = require('moment-timezone');

class RawDataProcess {


    constructor(data) {
        this.data = String(data);
      }
 

    Decode() {      
        var mac = this.data.substr(6, 12)
        var SN = this.data.substr(20, 4)
        var MACDirPath = `E:\\ParkingUploadPicture\\${mac}\\`
        this.mkdir(MACDirPath);

        var SNDirPath = `E:\\ParkingUploadPicture\\${mac}\\${SN}\\`
        this.mkdir(SNDirPath);    
        var datainfo = this.data.split('ffc0')[1]
        var context = {
            data:this.data,  
            Side: transform.hex2string(this.data.substr(18, 2)),             
            SN: this.data.substr(20, 4), 
            ImgPath: this.ComposePicture(),
            Resolution:`${transform.hex2uint16(datainfo.substr(10, 4))}x${transform.hex2uint16(datainfo.substr(6, 4))}`
        } 

        var Device = {
                    mac:this.data.substr(6, 12),
                    AMR:{
                        AMR:transform.hex2uint16(this.data.substr(28, 4)),
                        AMR_F:transform.hex2uint16(this.data.substr(32, 4)),
                        AMR_B:transform.hex2uint16(this.data.substr(36, 4))},
                    RSSI:{
                        RSSI_F:transform.hex2int8(this.data.substr(40, 2)),
                        RSSI_B:transform.hex2int8(this.data.substr(42, 2))},
                    SolarVoltage:this.data.substr(44, 2)/10,
                    Temperature:this.data.substr(46, 2),     
                    status:this.status_analysis(this.data.substr(48, 4))
                }

        var imform={
                    context:context,
                    Device:Device
                }

        return imform
            
    }

    status_analysis(raw_data){
        this.raw_data = raw_data
        switch(raw_data){
            case "0100":
                this.status = "初始化";
                break;
            case "0200":
                this.status = "占用";
                break;
            case "0300":
                this.status = "空位";
                break;
            case "0400":
                this.status = "磁場溢出";
                break;
            case "0500":
                this.status = "報平安";
                break;

        }

        return this.status;


    }

    ComposePicture(){
       
        var allrawdata = ""
        var Image = this.data.split(this.data.substr(0, 24));
        Image.forEach((temp) => {
                        if (temp != "") {
                            allrawdata = allrawdata + temp.substr(28); // 8是順序碼的長度
                        }
                    })
        var mac = this.data.substr(6, 12);
        var SN = this.data.substr(20, 4);
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
        fs.exists(path, function(exists) {
            if(!exists){
                fs.mkdirSync(path)
                console.log(`已建立新資料夾${path}`)
                
            }
        });
    }



}

module.exports = RawDataProcess;



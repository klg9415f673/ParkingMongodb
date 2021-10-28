var axios = require("axios");
var fs=require('fs');
var setup = require("./setup")
const firestoreServiceURL = setup.picuploadURL
var transform = require('./ImageService/transform')
var Imageservice = require("./ImageService")
var Deviceservice = require("./DeviceService")
var PKS7501_service = require("./PKS_7501Service")
var moment = require('moment');
var tz = require('moment-timezone');
const { serverIP } = require("./setup");


exports.VerifyData=(DataArray)=> {
	console.log("驗證資料!!!!!")	
	let WishNumber = 1;
	let Status = true;
	let lostlist = [];
	DataArray.forEach(element => { 
		
		if(element!=""){
			let NowNumber = transform.hex2int16(element.substr(0,2))
			
			if(NowNumber != WishNumber){lostlist.push(NowNumber);Status = false;}
			WishNumber++;
		}

	});

	return {Status:Status,lostlist:lostlist}

}
exports.Delete=(filename)=> {
	fs.unlink(filename, function(err) {
		if (err) {
			return console.error('Delete',err);
		}
		console.log( filename +"Deleted！");
		});
}

exports.ImageData = (filename)=> {
	
	fs.readFile(filename, function (err, cameradata) {
		if (err) {
			return console.error('readFile',err);
		}
        console.log("ImageData(MongoDB) start");
		Imageservice.createService(cameradata.toString('hex'),filename)
	

	});	

}


exports.Devicedata = (Device)=>{

	console.log("DeviceData(MongoDB) start");
	Deviceservice.createService(Device.toString('hex'))

}

exports.PKS7501_data = (Device,server,remote)=>{

	console.log("PKS7501(MongoDB) start");
	PKS7501_service.createService(Device.toString('hex'),server,remote)
	

}

exports.UploadPKS = (PKSdata)=>{

	console.log("PKS Upload start");
	cameraData = { cameraData: PKSdata.toString('hex') }
	axios.post(firestoreServiceURL, { cameraData: cameraData }).then(console.log("PKS upload OK")).catch(error => {
	console.log("upload ERROR : ", error)
	return null
	});
		
}


exports.PKS7501_sendmsg = async(decode,server,remote)=>{	
	var time = moment().tz("Asia/Taipei").format("MMDDHHmmss")

	if(decode.Router.SN == "0000"){
		let msg = Buffer.from(' ' + moment().tz("Asia/Taipei").format("MMDDHHmmss")) //0x20 = 空白
		//let msg = Buffer.from([0x20,`0x${time.substr(0,2)}`,`0x${time.substr(2,2)}`,`0x${time.substr(4,2)}`,`0x${time.substr(6,2)}`,`0x${time.substr(8,2)}`,`0x${decode.Router.SN.substr(0,2)}`,`0x${decode.Router.SN.substr(2,2)}`])
		server.send(msg,remote.port,remote.address)
		return ""
	}	

	if(time.substr(4,2) == 6){
		let msg
		if(time.substr(4,2)>30){
			msg = Buffer.from([0x20,`0x${time.substr(0,2)}`,`0x${time.substr(2,2)}`,`0x${time.substr(4,2)}`,`0x${time.substr(6,2)}`,`0x${time.substr(8,2)}`,`0x${decode.Router.SN.substr(0,2)}`,`0x${decode.Router.SN.substr(2,2)}`])
			
		}else{
			msg = Buffer.from([0x23,0x14,0x64,0x01,0xF4,0x14,0x0A,0x19,0x0A,0x19,0x0A,0x05,0x02,0x14,0x64,0x1E,0x0A,0x0A,0x0C,0x05,0x05,0x60
			`0x${decode.Router.SN.substr(0,2)}`,`0x${decode.Router.SN.substr(2,2)}`])
		}
		server.send(msg,remote.port,remote.address)
		return ""
	}

	//用Group下指令
	// switch(decode.Node.Group){
	// 	case 01:
	// 		break;
	// 	default:

	// }

	//用MAC去下指令
	// switch(decode.Node.Mac){
	// 	case 01:
	// 		break;
	// 	default:

	// }
	var msg = Buffer.from(' ' + moment().tz("Asia/Taipei").format("MMDDHHmmss")) //0x20 = 空白
	//var msg = Buffer.from([0x20,`0x${time.substr(0,2)}`,`0x${time.substr(2,2)}`,`0x${time.substr(4,2)}`,`0x${time.substr(6,2)}`,`0x${time.substr(8,2)}`,`0x${decode.Router.SN.substr(0,2)}`,`0x${decode.Router.SN.substr(2,2)}`])
	server.send(msg,remote.port,remote.address)
	return ""
}


exports.UploadImage = (filename,uuid)=>{
	fs.readFile(filename, function (err, cameradata) {
		if (err) {
			return console.error('readFile',err);
		}
		console.log("UploadGCP start");
		console.log(cameradata);
		cameraData = { cameraData: cameradata.toString('hex') }
		axios.post(firestoreServiceURL, { cameraData: cameraData,UUID:uuid }).then(console.log(filename + "upload OK")).catch(error => {
		console.log("upload ERROR : ", error)
		return null
		});
			
	});	

    setTimeout(() => {
        this.Delete(filename);
    }, 5000);

}

exports.UploadDevice = (Device)=> {
	
		console.log("UploadDevice start");
		console.log(Device);
		cameraData = { cameraData: Device.toString('hex') }
		axios.post(firestoreServiceURL, { cameraData: cameraData }).then(console.log("Device upload OK")).catch(error => {
		console.log("upload ERROR : ", error)
		return null
		});
   

}
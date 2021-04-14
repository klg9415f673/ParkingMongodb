var axios = require("axios");
var fs=require('fs');
var setup = require("./setup")
const firestoreServiceURL = setup.picuploadURL
var transform = require('./ImageService/transform')


exports.VerifyData=(DataArray)=> {
	console.log("驗證資料!!!!!")	
	let WishNumber = 1;
	let Status = true;
	let lostlist = []
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
		Imageservice.createService(cameradata.toString('hex'))
	

	});	

}


exports.Devicedata = (Device)=>{

	console.log("DeviceData(MongoDB) start");
	Deviceservice.createService(Device.toString('hex'))

}

exports.UploadPKS = (PKSdata)=>{

	console.log("PKS Upload start");
	cameraData = { cameraData: PKSdata.toString('hex') }
	axios.post(firestoreServiceURL, { cameraData: cameraData }).then(console.log(filename + "upload OK")).catch(error => {
	console.log("upload ERROR : ", error)
	return null
	});
		
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
        Delete(filename);
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
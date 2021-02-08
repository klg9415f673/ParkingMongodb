var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var axios = require("axios");
var fs=require('fs');
var setup = require("./setup")
const IP = setup.IP
const firestoreServiceURL = setup.picuploadURL
var filename;
var transform = require('./ImageService/transform')
var Imageservice = require("./ImageService")
var Deviceservice = require("./DeviceService")
var moment = require('moment');
var tz = require('moment-timezone');

server.bind('8888',IP);

function VerifyData(DataArray) {
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
function Delete(filename) {
	fs.unlink(filename, function(err) {
		if (err) {
			return console.error('Delete',err);
		}
		console.log( filename +"Deleted！");
		});
}

function ImageData(filename) {
	
	fs.readFile(filename, function (err, cameradata) {
		if (err) {
			return console.error('readFile',err);
		}
        console.log("ImageData(MongoDB) start");
		Imageservice.createService(cameradata.toString('hex'))
		setTimeout(() => {
			Delete(filename);
		}, 5000);

	});	

}


function Devicedata(Device) {
	

	console.log("DeviceData(MongoDB) start");
	Deviceservice.createService(Device.toString('hex'))

}



function UploadImage(filename) {
	fs.readFile(filename, function (err, cameradata) {
		if (err) {
			return console.error('readFile',err);
		}
		console.log("UploadGCP start");
		console.log(cameradata);
		cameraData = { cameraData: cameradata.toString('hex') }
		axios.post(firestoreServiceURL, { cameraData: cameraData }).then(console.log(filename + "upload OK")).catch(error => {
		console.log("upload ERROR : ", error)
		return null
		});
			
	});	

}

function UploadDevice(Device) {
	
		console.log("UploadDevice start");
		console.log(Device);
		cameraData = { cameraData: Device.toString('hex') }
		axios.post(firestoreServiceURL, { cameraData: cameraData }).then(console.log("Device upload OK")).catch(error => {
		console.log("upload ERROR : ", error)
		return null
		});
			


}


server.on('message', async function (message, remote) {
	console.log(`cilent address is:${remote.address}-${remote.port}`);
	console.log("Now time :", moment().tz("Asia/Taipei").format("MM/DD HH:mm:ss"))
	// console.log(transform.hex2string(message.toString('hex')))  //PC client測試用
	// message = transform.hex2string(message.toString('hex'))	   //PC client測試用

	var format = message.toString('hex').substr(0,4)
	if (message.toString('hex') =='636c69656e74'){//client ASCII
		format = String(message)
	}

	//創建txt &寫入資料
	var filename = './RawData/'+ remote.address +'-'+ remote.port +'.txt' ;

	switch(format){
		case "eeee":
			
			if(message.toString('hex').indexOf('ffd8')!=-1){
				fs.access(filename, function(exists) {
					if(!exists){
						Delete(filename);
						
					}
				});
			}
			console.log(message.toString('hex'));
			console.log("recognize ",format)

			

			fs.appendFile(filename, message,function(error){
				if(error){
					console.log('appendFile',error);
				}else{
					console.log('Write image data successful');
					action = message.toString('hex').substr(4,2);
					switch(action){
						case "00":
							fs.readFile(filename, function (err, cameradata) {
								if (err) {
									return console.error('readFile',err);
								}
								Data = cameradata.toString('hex')
								var DataArr = Data.split(Data.substr(0,24));
								var newarr =[]
								
								DataArr.forEach(element => { 
									if(element!=""){
										
										let msg = Buffer.from(transform.stringToHex(Data.substr(0,24) + element))
										let NowNumber = transform.hex2int16(element.substr(0,2))
										newarr.splice(NowNumber-1, 0, (msg.toString('hex')));
									}
							
								});
								
								newdata = newarr.join('')
								fs.writeFile(filename,newdata)
							});
							verifydata= VerifyData(DataArr);
							Status = verifydata.Status
							lostlist = verifydata.lostlist
							if(Status === true){
								server.send('okresend',remote.port,remote.address);
								UploadImage(filename);
								ImageData(filename);
							}
						break;
						case "ee":
							if(message.toString('hex').indexOf('ffd9')!=-1){
								fs.readFile(filename, function (err, cameradata){
									cameraData = String(cameradata.toString('hex'))
									DataArr = cameraData.split(cameraData.substr(0,24));
									var verifydata= VerifyData(DataArr);
							
		
									switch( verifydata.Status){	
										case false :		
											//server.send(String(verifydata.lostlist),remote.port,remote.address);
											server.send('resend',remote.port,remote.address);//若要啟用回傳特定筆則需註解
											console.log("Some Data MISSING!!!!!!!!!!!!");
											errormsg = `MAC:${cameraData.substr(6,12)}\r\nTIME:${moment().tz("Asia/Taipei").format("MM/DD HH:mm:ss")}\r\nlostlist:${String(verifydata.lostlist)}\r\n`
											fs.appendFile('error_log', errormsg,function(error){
												if(err) throw err ;
											})
											Delete(filename);//若要啟用回傳特定筆則需註解

											break;
										case true :
											server.send('oksend',remote.port,remote.address);
											UploadImage(filename);
											ImageData(filename);
											break;
									}
								
								})
		
							}
						break;
					}
				
			
				}

			})

			break;

		case "ffff":			
			
			console.log(message.toString('hex'));
			var msg = Buffer.from('!' + moment().tz("Asia/Taipei").format("MMDDHHmmss"))
			console.log("recognize ",format)
			server.send(msg,remote.port,remote.address)

			UploadDevice(message);
			Devicedata(message);
			break;
		case "client":
			console.log(transform.hex2string(message.toString('hex')));
			console.log("Server活著，可喜可賀~可喜可賀~")
			server.send("OK",remote.port,remote.address)
			break;
		default:
			console.log("Unknown Connection have Disconnected!!!");
			server.send('Unknown format',remote.port,remote.address)
			break;
	}


})


server.on('listening',()=>{
	console.log('UDP監聽中...');
	});

server.on("error", function (err) {
    console.log("error!", err);
})


var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var axios = require("axios");
var fs=require('fs');
var functions = require("./functions")
var setup = require("./setup")
const IP = setup.IP
var transform = require('./ImageService/transform')
var Imageservice = require("./ImageService")
var Deviceservice = require("./DeviceService")
var moment = require('moment');
var tz = require('moment-timezone');

server.bind('1111',IP);

server.on('message', async function (message, remote) {
	
	console.log(`cilent address is:${remote.address}-${remote.port}`);
	console.log("Now time :", moment().tz("Asia/Taipei").format("MM/DD HH:mm:ss"))
	console.log(message)
	// console.log(transform.hex2string(message.toString('hex')))  //PC client測試用
	// message = transform.hex2string(message.toString('hex'))	   //PC client測試用

	var format = message.toString('hex').substr(0,4)
	if (message.toString('hex') =='636c69656e74'){//client ASCII
		format = String(message)
	}
	if (message.toString('hex').substr(0,2) =='40'){//PKS7501
		format = "@"
	}

	//創建txt &寫入資料
	var filename = './RawData/'+ remote.address + '-'+ remote.port +'.txt' ;

	switch(format){
		case "eeee":
			
			if(message.toString('hex').indexOf('ffd8')!=-1){
				fs.access(filename, function(exists) {
					if(!exists){
						functions.Delete(filename);
						
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
								var DataArr = Data.split(Data.substr(0,22));
								var newarr =[]
								
								DataArr.forEach(element => { 
									if(element!=""){
										
										let msg = Buffer.from(transform.stringToHex(Data.substr(0,22) + element))
										let NowNumber = transform.hex2int16(element.substr(0,2))
										newarr.splice(NowNumber-1, 0, (msg.toString('hex')));
									}
							
								});
								
								newdata = newarr.join('')
								fs.writeFile(filename,newdata)
							});
							verifydata= functions.VerifyData(DataArr);
							Status = verifydata.Status;
							lostlist = verifydata.lostlist;
							if(Status === true){
								server.send('okresend',remote.port,remote.address);
								functions.ImageData(filename);
							}
						break;
						case "ee":
							if(message.toString('hex').indexOf('ffd9')!=-1){
								fs.readFile(filename, function (err, cameradata){
									cameraData = String(cameradata.toString('hex'))
									DataArr = cameraData.split(cameraData.substr(0,22));
									var verifydata= functions.VerifyData(DataArr);
							
		
									switch( verifydata.Status){	
										case false :		
											//server.send(String(verifydata.lostlist),remote.port,remote.address);
											server.send('resend',remote.port,remote.address);//若要啟用回傳特定筆則需註解
											console.log("Some Data MISSING!!!!!!!!!!!!");
											errormsg = `MAC:${cameraData.substr(6,12)}\r\nTIME:${moment().tz("Asia/Taipei").format("MM/DD HH:mm:ss")}\r\nlostlist:${String(verifydata.lostlist)}\r\n`
											fs.appendFile('error_log', errormsg,function(error){
												if(err) throw err ;
											})
											functions.Delete(filename);//若要啟用回傳特定筆則需註解

											break;
										case true :
											server.send('oksend',remote.port,remote.address);
											functions.ImageData(filename);
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
			console.log("send deive time check",msg)
			server.send(msg,remote.port,remote.address)

			functions.UploadDevice(message);//要加進去DEVICE DATA裡面
			//functions.Devicedata(message); 
			break;
		case "client":
			console.log("recognize ",format)
			console.log("Server活著，可喜可賀~可喜可賀~")
			server.send("OK",remote.port,remote.address)
			break;
		case "@"://PKS7501

			console.log("recognize ",format)
			functions.UploadPKS(message)
			functions.PKS7501_data(message,server,remote)

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


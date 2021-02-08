var transform = require('./ImageService/transform');
var fs=require('fs');
fs.readFile('./test.txt', function (err, cameradata) {
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
    console.log(newdata);


});





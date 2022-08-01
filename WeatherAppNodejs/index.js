const http = require("http");
const fs= require("fs");
const path=require("path");
var requests= require("requests");
const homefile = fs.readFileSync("home.html","utf-8");
const replaceval=(tempval,orgval)=>{
 let temperature=tempval.replace("{%tempval%}",orgval.main.temp);
 temperature = temperature.replace("{%tempmin%}", orgval.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgval.main.temp_max);
  temperature = temperature.replace("{%city%}", orgval.name);
  temperature = temperature.replace("{%country%}", orgval.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgval.weather[0].main);
  return temperature;
};
const server=http.createServer((req,res)=>{
  if(req.url=="/weather"){
    requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=d2a67dcf670c442225c5149c041b5ce7")
.on('data',  (chunk)=> {
    const objdata=JSON.parse(chunk);
    const arraydata=[objdata];
  console.log(arraydata[0].main.temp);
  // res.write(homefile)
  const realdata=arraydata.map(function (val) {
    return replaceval(homefile, val);
  })
  .join("");
  res.write(realdata);
  // res.sendFile('home.html');
  
  console.log(realdata);
})
.on('end',  (err) =>{
  if (err) return console.log('connection closed due to errors', err);
  res.end();
});
  }
  else{
    res.end("File not found");
  }
});

server.listen(7001 ,"127.0.0.1",function(){
  console.log("server is listening");
})

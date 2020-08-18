const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require("path");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const docker = require("./dockerapi");
const stream = require("stream");
const morgan = require("morgan");
const Docker = require('dockerode');
var exec = require ('child_process').exec ;
const fs = require('fs');
const responsedelay = 50;   // miliseconds
const rootPath = `files`;
const rootPath2 = `Micro`;





const PORT = 6789;

const openLogStreams = new Map();
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());





app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));


server.listen(PORT, () => console.log(`Server started on port ${PORT}`));




///////:///////////////DATA//////////////////////////////////////

// upload handler
var uploadStorage = multer.diskStorage(
  {
      destination: function (req, file, cb)
      {
          // cb(null, filespath);
          cb(null, rootPath);
      },
      filename: function (req, file, cb)
      {
          cb(null, file.originalname);    // file name must be verified before upload and if the file name is repeatitive then rename it
      }
  });

  var upload = multer({ storage: uploadStorage });

app.post('/upload', upload.any(), function(req, res)
{
    res.status(200).send();
    console.log(req.files);
    console.log('file upload...');
});


// all type of files except images will explored here
app.get('/files-list', function(req, res)
{
    let folder = rootPath;
    let response = [];

    if(req.query.path)
        folder = req.query.path;
    
    if(!fs.existsSync(folder))
        folder = rootPath;
    
    fs.readdir(folder, function(err, files)
    {
        if(err)
        {
            console.log(err);
            res.send('').status(200);
        }
        else if(files.length > 0)
        {
            files.forEach(function(value, index, array)
            {
                fs.stat(`${folder}/${value}` , function(err, stats)
                {  

                    let filesize;
                    try { filesize = ConvertSize(stats.size); }
                    catch(err) { filesize = 0; }
                    
                    response.push(
                    {
                        name: value,
                        path: folder,
                        size: filesize,
                        filetype: stats.isFile() ? 'file' : 'folder',
                        uploadDate: stats.birthtime ,
                       



                    });

                    
                    if(index == (array.length - 1))
                        setTimeout(function() {res.send(JSON.stringify(response)).status(200);}, responsedelay);
                });
            });
        }
        else
        {
            // when directory is empty
            response.push(
            {
                path: folder,
                filetype: 'folder',
            });

            res.send(JSON.stringify(response)).status(200);
        }
    });
});
///////////////////Microservice//////////////////
// upload handler
var uploadStorage2 = multer.diskStorage(
  {
      destination: function (req, file, cb)
      {
          // cb(null, filespath);
          cb(null, rootPath2);
      },
      filename: function (req, file, cb)
      {
          cb(null, file.originalname);    // file name must be verified before upload and if the file name is repeatitive then rename it
      }
  });

  var upload = multer({ storage: uploadStorage2 });

app.post('/upload2', upload.any(), function(req, res)
{
    res.status(200).send();
    console.log(req.files);
    console.log('file upload...');
});

app.get('/Micro-list', function(req, res)
{
    let folder = rootPath2;
    let response = [];

    if(req.query.path)
        folder = req.query.path;
    
    if(!fs.existsSync(folder))
        folder = rootPath;
    
    fs.readdir(folder, function(err, files)
    {
        if(err)
        {
            console.log(err);
            res.send('').status(200);
        }
        else if(files.length > 0)
        {
            files.forEach(function(value, index, array)
            {
                fs.stat(`${folder}/${value}` , function(err, stats)
                {  

                    let filesize;
                    try { filesize = ConvertSize(stats.size); }
                    catch(err) { filesize = 0; }
                    
                    response.push(
                    {
                        name: value,
                        path: folder,
                        size: filesize,
                        filetype: stats.isFile() ? 'file' : 'folder',
                        uploadDate: stats.birthtime ,
                       



                    });

                    
                    if(index == (array.length - 1))
                        setTimeout(function() {res.send(JSON.stringify(response)).status(200);}, responsedelay);
                });
            });
        }
        else
        {
            // when directory is empty
            response.push(
            {
                path: folder,
                filetype: 'folder',
            });

            res.send(JSON.stringify(response)).status(200);
        }
    });
});
////////////////////Trainning////////////////////////
// all type of files except images will explored here
app.get('/files', function(req, res)
{
    let folder = rootPath;
    let response = [];

    if(req.query.path)
        folder = req.query.path;
    
    if(!fs.existsSync(folder))
        folder = rootPath;
    
    fs.readdir(folder, function(err, files)
    {
        if(err)
        {
            console.log(err);
            res.send('').status(200);
        }
        else if(files.length > 0)
        {
            files.forEach(function(value, index, array)
            {
                fs.stat(`${folder}/${value}` , function(err, stats)
                {
                    let filesize;
                    try { filesize = ConvertSize(stats.size); }
                    catch(err) { filesize = 0; }
                    
                    response.push(
                    {
                        name: value,
                        path: folder,
                        size: filesize,
                        filetype: stats.isFile() ? 'file' : 'folder',
                        uploadDate: stats.birthtime
                    });
                    
                    if(index == (array.length - 1))
                        setTimeout(function() {res.send(JSON.stringify(response)).status(200);}, responsedelay);
                });
            });
        }
        else
        {
            // when directory is empty
            response.push(
            {
                path: folder,
                filetype: 'folder',
            });

            res.send(JSON.stringify(response)).status(200);
        }
    });
});

app.delete('/filedir/', function(req, res)
{
    console.log(req.query);
});

function ConvertSize(number)
{
    if(number <= 1024) { return (`${number} Byte`); }
    else if(number > 1024 && number <= 1048576) { return ((number / 1024).toPrecision(3) + ' KB'); }
    else if(number > 1048576 && number <= 1073741824) { return ((number / 1048576).toPrecision(3) + ' MB'); }
    else if(number > 1073741824 && number <= 1099511627776) { return ((number / 1073741824).toPrecision(3) + ' GB'); }
}
























app.post('/rund', function(request, response){
 
  var str1 = "sh ./files/";
  var str2 = request.body.user.name ;
 
 
var res = str1.concat(str2);
  
  exec(res, (error, stdout, stderr) => { console.log(stdout); })
})
 
app.post('/runM', function(request, response){
 
  var str1 = "sh ./Micro/";
  var str2 = request.body.user.name ;
 
 
var res = str1.concat(str2);
  
  exec(res, (error, stdout, stderr) => { console.log(stdout); })
})
   



app.post('/deleteD', function(request, response){
 
  var str1 = "./files/";
  var str2 = request.body.user.name ;
  var res = str1.concat(str2);

  fs.unlink(res, function(err) {
    
    if (err) throw err;
  
    console.log('file deleted');
    
  });


})


app.post('/deleteM', function(request, response){
 
  var str1 = "./Micro/";
  var str2 = request.body.user.name ;
  var res = str1.concat(str2);

  fs.unlink(res, function(err) {
    
    if (err) throw err;
  
    console.log('file deleted');
    
  });


})

 
   



const refreshContainers = () => {
  docker.listContainers({ all: true }, (err, containers) => {
    io.emit("containers.list", containers);
  });
};

io.on("connection", socket => {
  socket.on("containers.list", () => {
    refreshContainers();
  });

  socket.on("container.start", args => {
    const container = docker.getContainer(args.id);

    if (container) {
      container.start((err, data) => refreshContainers());
    }
  });

  socket.on("container.stop", args => {
    const container = docker.getContainer(args.id);

    if (container) {
      container.stop((err, data) => refreshContainers());
    }
  });

  socket.on("container.pipe_logs", args => {
    const container = docker.getContainer(args.id);

    if (container) {
      // create a single stream for stdin and stdout
      const logStream = new stream.PassThrough();
      let results = [];
      logStream.on("data", chunk => {
        results.push(chunk.toString("utf8"));
        if (results.length > 100) {
          socket.emit(`container.return_piped_logs.${args.id}`, { results });
          results = [];
        }
      });
      container.logs(
        {
          follow: true,
          stdout: true,
          stderr: true
        },
        (err, stream) => {
          if (err) {
            return logger.error(err.message);
          }
          openLogStreams.set(args.id, stream);
          container.modem.demuxStream(stream, logStream, logStream);
          stream.on("end", () => {
            logStream.end("!stop!");
            socket.emit(`container.return_piped_logs.${args.id}`, { results });
          });
        }
      );
    }
  });

  socket.on("container.stop_pipe_logs", args => {
    const stream = openLogStreams.get(args.id);
    if (stream) {
      stream.destroy();
    }
  });

  socket.on("container.remove", args => {
    const container = docker.getContainer(args.id);

    if (container) {
      container.remove((err, data) => {
        if (err) io.emit("container.removed_fail", { err });
        io.emit("container.removed_success", { data });
      });
      return;
    }
    io.emit("container.removed_fail", { err: "No Container with that Id" });
  });

  socket.on("image.run", args => {
    docker.createContainer({ Image: args.name }, (err, container) => {
      if (!err)
        container.start((err, data) => {
          if (err) socket.emit("image.error", { message: err });
        });
      else socket.emit("image.error", { message: err });
    });
  });
});

setInterval(refreshContainers, 2000);
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');

const path = require("path");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const docker = require("./dockerapi");
const stream = require("stream");
const morgan = require("morgan");
const Docker = require('dockerode');
var exec = require ('child_process').exec ;
var readDirectory = require('./readDirectory');

const fs = require('fs');
const testFolder = './up/';



const PORT = 5642;

const openLogStreams = new Map();
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());





app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));


server.listen(PORT, () => console.log(`Server started on port ${PORT}`));


































app.post('/zaab', function(request, response){
 
  var test = request.body.user.name ;
  console.log (test);
  exec(test, (error, stdout, stderr) => { console.log(stdout); })
})
 
   

     
      
     
       
     
      
      
  
  
    


app.post('/form',function(req, res) {


  console.log(req.body.cmd)
   name = "sh tt.sh";
  
  exec(name,function(err,stdout,stderr){

    console.log(stdout);
    
      })
      res.send('done')
    })
    
    
















app.post('/files-list', function(req, res)
{
    let folder = './up/';
    let contents = '';

    let readingdirectory = `./userfiles/${folder}`;

    fs.readdir(readingdirectory, function(err, files)
    {
        if(err) { console.log(err); }
        else if(files.length > 0)
        {
            files.forEach(function(value, index, array)
            {
                fs.stat(`${readingdirectory}/${value}`, function(err, stats)
                {
                    let filesize = ConvertSize(stats.size);
                    contents += '<tr><td><a href="/' + folder + '/' + encodeURI(value) + '">' + value + '</a></td><td>' + filesize + '</td><td>/' + folder + '/' + value + '</td></tr>' + '\n';
                    
                    if(index == (array.length - 1)) { setTimeout(function() {res.send(contents);}, responsedelay); }
                });
            });
        }
        else
        {
            setTimeout(function() {res.send(contents);}, responsedelay);
            console.log(res.send(contents))
        }
    });
 
});

//
app.get('/script', function (req, res,next) {

  exec('sh tt.sh',function(err,stdout,stderr){

console.log(stdout);

  })
  res.send('done')
})


function getDirectoryContent(req, res, next) {
  fs.readdir(testFolder , function (err, images) {
    if (err) { return next(err); }
    res.locals.filenames = images;
    next();
  });
}
app.get('/api/test', getDirectoryContent, function(req, res) {

  res.json(res.locals.filenames);
});


app.get('/api/logs',function(req,res){
  readDirectory.readDirectory(function(logFiles){
     res.json({files : logFiles});
 });
});
app.get('/api/nodes', function(req, res) {
    
  var docker = new Docker();
 
  docker.listNodes(function(err, nodes) {
      res.json(nodes);
  });
});
/*
fs.readdir('./up/', function (err, files) {
 if (err)
    throw err;
 for (var index in files) {
    console.log(files[index]);
 }
 });
 */
app.get('/api/hello', (req, res, next) => {
  
       res.json('test');
   
 
});


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

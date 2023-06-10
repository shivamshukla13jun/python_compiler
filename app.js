const fs = require("fs");
var spawn = require("child_process").spawn;
const { v4: uuidv4 } = require('uuid');
const Port = 7000;
var http = require('http').createServer((req,res)=>{
  res.writeHead(200,{'Content-Type':'text/html'});
  res.write("hello")
  res.end()
});
var io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
// This is the important stuff
http.keepAliveTimeout = (60 * 1000) + 1000;
http.headersTimeout = (60 * 1000) + 2000;
io.on('connection', (socket) => {
  socket.emit("justconnect",`⚡: ${socket.id} user just connected!`)
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on('message', (data) => {
    var code = data.code;
    try {
      const pythonnormal = spawn("python", ["-u", "-c", code], {
        stdio: ["pipe"]
      });
      socket.on('input', (data) => {
       pythonnormal.stdin.write(`${data}\n`)
      })
     const data= pythonnormal.stdin.write("shivam")
     console.log({data})
      var resultString = "";
      pythonnormal.stdout.on("data", function (data) {
        resultString += data;
        // pythonnormal.stdin.write("shivam")
        socket.emit('messageResponse', resultString);
      });
      pythonnormal.stderr.on("data", function (data) {
        resultString += data;
        socket.emit('messageResponse', resultString);
      });
      pythonnormal.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        socket.emit("closepython", code);
      });
      //  Jupiter 
      // Execute Notebook Script and get Output
      const uuidfile = __dirname + "/temp/" + uuidv4() + ".py"
      const cuidfile = uuidv4() + "-input"
      const test_notebook = cuidfile + ".ipynb"
      const testpy = __dirname + "/temp/" + cuidfile + ".py"
      const testnotebook = __dirname + "/temp/" + test_notebook
      fs.writeFile(testpy, code, (err) => {
        if (err) console.log(err)
      })
      // Convert Python Script To NoteBook
    // try {
    //   const convertToPytoipynb = spawn("p2j", [testpy])
    //   convertToPytoipynb.stdout.on("data", (data) => {
    //     console.log({ data: data.toString() })
    //   })
    //   convertToPytoipynb.stderr.on("data", (data) => {
    //     console.log({ data: data.toString() })
    //   })
    //   convertToPytoipynb.on("close", (code) => {
    //     console.log(code)
    //     // Get Output from Notebook 
    //     const outputfile = cuid.slug() + "-output" + '.ipynb'
    //     const output = __dirname + "/temp/" + outputfile
    //     //  const executenotebook = spawn("papermill", [testnotebook, output])
    //     var  executenotebook
    // try {
    //    executenotebook = spawn("jupyter", ["nbconvert","--execute","--to",testnotebook,"--inplace",testnotebook])
    //   executenotebook.stdout.on("data", (data) => {
    //     console.log({ data: data.toString() })
    //   })
    //   executenotebook.stderr.on("data", (data) => {
    //     console.log({ data: data.toString() })
    //   })
    // } catch (error) {
    //   console.log(error)
    // }
    //     executenotebook.on("close", (code) => {
    //       socket.emit("closeoutput",code)
    //       fs.readFile(testnotebook, 'utf8', function (err, data) {
    //        // console.log({consoledata:JSON.parse(data).cells})
    //        let output = JSON.parse(data).cells
    //        //console.log({output})
    //       for(let i=0;i<output.length;i++){
    //        const SliceOutput= output[i]['outputs']
    //       // console.log({SliceOutput})
    //        var text
    //        if (typeof SliceOutput === "undefined") {
    //          text = "SliceOutput is undefined";
    //          console.log(text)
    //        } else {
    //          text =SliceOutput ;
    //          console.log({slice:SliceOutput})
    //          socket.emit("notebook", SliceOutput)
    //        }
    //      //  if (SliceOutput.length === 0) 
    //      //  { console.log("Array is empty!") 
    //      //   }else{
    //      //     console.log("Array is full!") 
    //      //     }
    //       }
    //         // var lastItem = output.slice(-1)[0]
    //         // const latsOutput = lastItem.outputs
    //         // socket.emit("notebook", latsOutput)
    //       });
    //     })
    //     // End Get Output from Notebook 
    //   })
    // } catch (error) {
    //   console.log(error)
    // }
      // End Convert Python Script To NoteBook 

      socket.on('error', (err) => {
        console.log('received socket error:');
        console.log(err);
      });
    } catch (error) {
      console.log(error)
    }
  });
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');

  });
});
http.listen(Port, () => {
  console.log(`listening on *:${Port}`);
});


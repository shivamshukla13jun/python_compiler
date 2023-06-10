import { useEffect, useState} from "react";
import "./App.css";
import Editor from "@monaco-editor/react";
import socketClient  from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// var socket = socketClient.connect('wss://educobothit.handsintechnology.in/');
var socket = socketClient.connect('http://localhost:7000/');
function EditorPython() {
  const navigate = useNavigate();

const refreshPage = () => {
    navigate(0);
}
  // State variable to set users source code
  const [userCode, setUserCode] = useState(``);
  // State variable to set editors default language
  const [userLang, setUserLang] = useState("python");
  // State variable to set editors default theme
  const [userTheme, setUserTheme] = useState("vs-dark");
  // State variable to set editors default font size
  const [fontSize, setFontSize] = useState(20);
  const [userOutput, setUserOutput] = useState("");
  const [DefaultUserCode, setDefaultUserCode] = useState(``);
  const [kernel, setKernel] = useState(``);
  const [PromptData, setPromptData] = useState('')
  const [loading, setLoading] = useState("");
  const options = {
    fontSize: fontSize,
  };
    
   useEffect(()=>{
    LocalData()
    handlechange()
   },[])
  
  const LocalData=()=>{
    var OutputData= JSON.parse(localStorage.getItem('userGoals'));
    var Data= JSON.parse(localStorage.getItem('Data'));
    var LocalUserCode= JSON.parse(localStorage.getItem('userCode'))
    console.log({OutputData})
    console.log({LocalUserCode})
    setDefaultUserCode(LocalUserCode)
    setUserOutput(OutputData)
    setKernel(Data)
  }
  var LocalCode= JSON.parse(localStorage.getItem('userCode'))
 const handlechange=(value) => {
              setUserCode(value||LocalCode);
            }
  const compile= () => {
    try {
      socket.on('connection', function () {
        console.log('connect  client event....');
     });
     localStorage.setItem('userCode', JSON.stringify(userCode));
     socket.emit('message', {
       code: userCode,
       id: `${socket.id}${Math.random()}`,
       socketID: socket.id,
      });
      
      socket.on('notebook',(output)=>{
         console.log(output)
        for(let i=0;i<output.length;i++){
         var outputdata=  output[i]['data']
       //  console.log(outputdata)
         //console.log(outputdata["image/png"])
         const typeofdata= output[i]['output_type']
         if(typeofdata=="display_data"){
          setKernel(outputdata["image/png"])
          localStorage.setItem('Data', JSON.stringify(outputdata["image/png"]));
           refreshPage()
         }
        }
        
      })
      
      socket.on("messageResponse", (arg) => {
        socket.on('closepython',(data)=>{
         refreshPage()
        })
        setKernel("")
        localStorage.setItem('Data', JSON.stringify(""));
        setUserOutput(arg)
        localStorage.setItem('userGoals', JSON.stringify((arg)));
        try {
          if(userCode.includes('input'))
        {
          var abc = arg;
          const myArray = abc.split("\r\n");
          var asdfg = myArray.slice(-1)[0]
          if(asdfg != "")
          {
             socket.emit('input', prompt(asdfg))
          }
          else
          {
            return false;
          } 
        }
        } catch (error) {
          console.log(error)
        }
      });
      socket.on('output',(data)=>{
        setUserOutput(data)
        console.log({output:data})
      })
   
    
        socket.on('disconnect', function () {
          console.log('disconnect client event....');
         
       });
        socket.on('error', function (e) {
          console.log('close client event....',e);
       });
   } catch (error) {
    console.log(error)
   }
  };
  function clearOutput() {
    setUserOutput("");
  }
  return (
    <div className="App">
      <div className="main">
        <div className="left-container">
          <Editor
            options={options}
            height="calc(100vh - 50px)"
            width="100%"
            theme={userTheme}
            language={userLang}
            defaultLanguage="python"
            defaultValue={DefaultUserCode}
            onChange={handlechange}
          />
          <button className="run-btn" onClick={() => compile()}>
            Run
          </button>
        </div>
        <div className="right-container">
         <img src={`data:image/png;base64,${kernel}`} alt="Red dot" />
          <h4>Output:</h4>
          {loading ? (
            <div className="spinner-box">
              <span>Loading..</span>
            </div>
          ) : (
            <div className="output-box">
              <pre> <div id="command-line">
                   {userOutput}
                </div>
             </pre>
              <button
                onClick={() => {
                  clearOutput();
                }}
                className="clear-btn"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditorPython;

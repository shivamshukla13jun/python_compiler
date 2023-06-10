import "./window.scss";
import { React, useState } from "react";
import { useParams } from "react-router-dom";
import Select from 'react-select'

const PythonTerminal = () => {
  const [Output, setOutput] = useState("");
  const [inputField, setInputField] = useState('');
  const [commandInput, setcommandInput] = useState('');
  const url = `http://localhost:7000/api/excel/pythonshell?packages=${commandInput}`
  const handleSubmit = () => {
    try {
      let source = new EventSource(url)
      source.onmessage = (m) =>{ 
        setOutput(m.data)
        setcommandInput(m.data)
        }
      source.onerror = () => source.close()
    } catch (error) {
      console.log(error);
    }
  };
  const ADD = (event) => {
    console.log(event.charCode)
    if (event.charCode == 13) {
      alert("Submit...")
      handleSubmit()

    }
  }

  return (
    <div>
      <div id="terminal-otput">
        {/* <!-- First Screen --> */}
        <div className="mac-window active">
          <div className="title-bar">
            <div className="buttons">
              <div className="close"></div>
              <div className="minimize"></div>
              <div className="maximize"></div>
            </div>
            <div className="title">
              Terminal
            </div>
          </div>
          <div className="window">
            <div id="command-line" className="command-line">
              <textarea value={commandInput} className="command-line" type="textarea" rows="30" cols="40" id="terminal-text" onKeyPress={ADD} onChange={(e) => setcommandInput(e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonTerminal;

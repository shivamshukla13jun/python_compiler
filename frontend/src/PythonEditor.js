import axios from 'axios'
import {React,useState} from 'react'
import EditorPython from './EditorPython'
import PythonTerminal from './Terminal'
const PythonEditor = () => {
  return (
    <div>
      <EditorPython/>
    </div>
  )
}

export default PythonEditor
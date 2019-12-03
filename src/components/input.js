import React, {useRef} from "react";
import './css/input.css'

function Input(props){
  let defaultOptions = {
    id:'',
    title:'',
    type:'text',
    onFuncs:{},
  }
  const titleEl = useRef()
  props = Object.assign(defaultOptions,props)
  return (
    <div className= "field-container">
      <label ref={titleEl} className= "field-title">{props.title}</label>
      <div className= "input-container">
        <input id={props.id} type={props.type} className="field-input" autoComplete="off" tabIndex='0' 
               {...props.onFuncs} defaultValue={props.defaultValue?props.defaultValue:''}
               onFocus={()=>{titleEl.current.classList.add('focused')}}
               onBlur={()=>{titleEl.current.classList.remove('focused')}}/>
        <div className="input-underline"></div>
      </div>
    </div>
  )
}

export default Input
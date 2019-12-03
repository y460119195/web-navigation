import React, {useEffect} from "react";
import ReactDOM from 'react-dom';
import './css/modal.css'

function Modal(props){
  let defaultProps = {
    modalClass:'modal-temp',
    modal:DefaultModal,
    options:{

    },
  }
  props = Object.assign(defaultProps,props)

  let modalRoot = document.body.getElementsByClassName('modal-root')[0];
  if(!modalRoot){
    modalRoot = document.createElement('div')
    modalRoot.setAttribute('class','modal-root')
    document.body.appendChild(modalRoot)
  }
  let modalEl = document.createElement('div')
  modalEl.setAttribute('class',props.modalClass)
  useEffect(() => {
    console.log('modal loaded')
    modalRoot.appendChild(modalEl)
    return () => {
      modalRoot.removeChild(modalEl)
    };
  })
  let modalProps = {...props.options,...props.funcs}
  if(props.children){
    modalProps.__children = props.children
  }
  return ReactDOM.createPortal(
    props.modal(modalProps),
    modalEl
  )
}

function DefaultModal(props){
  return(
    <div className ="default-modal-container">
      <div className ="default-modal">
        {
          props.content?
          props.content:false
        }
      </div>
    </div>
  )
}

export default Modal
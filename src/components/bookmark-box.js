import { produce } from 'immer';
import React, { useRef,useEffect, useState,forwardRef,useImperativeHandle} from "react";
import "./css/bookmark-box.css";
import Modal from "./modal";
import Input from "./input";

function BookMarkBox (){
  const defaultIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PGcgZmlsbD0iIzIwMjEyNCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNNyAyaDJ2MTJIN3oiLz48cGF0aCBkPSJNMiA5VjdoMTJ2MnoiLz48L2c+PC9zdmc+"
  let defaultUrls = {url:'',icon:'',title:'添加快捷方式'}
  const loadStorge = ()=>{
    let bookmarksTemp = localStorage.getItem('bookmarks')
    console.log(bookmarksTemp)
    if(bookmarksTemp){
      return JSON.parse(bookmarksTemp)
    }else{
      return []
    }
  }
  const [bookmarks, setBookmarks] = useState(loadStorge())
  const [hasShowModal, setHasShowModal] = useState(false)
  const [options, setOptions] = useState({addType:1,idx:0})
  const setUrls =()=>{ 
    if(!bookmarks.length){
      setBookmarks([defaultUrls])
    }
  }
  const editBookmark =(action,content)=>{
    //action 1:添加 2:删除 3:修改
    if(action === 1){
      setBookmarks(
        (produce((draft,action)=>{
          let newBookmark = {url:action.url,icon:`https://favicon.link/v3/?url=${action.url}`,title:action.name}
          if(draft.length > 9){
            draft[9]=newBookmark
          }else{
            draft.splice(draft.length-1,0,newBookmark)
          }
        }))(bookmarks,content)
      )
    }else if(action === 2){
      setBookmarks(
        (produce((draft,action)=>{
          if(draft.length === 10){
            draft.pop(defaultUrls)
          }
          draft.splice(action.idx,1)
        }))(bookmarks,content)
      )
    }else if(action === 3){
      setBookmarks(
        (produce((draft,action)=>{
          let newBookmark = {url:action.url,icon:`https://favicon.link/v3/?url=${action.url}`,title:action.name}
          draft.splice(action.idx,1,newBookmark)
        }))(bookmarks,content)
      )
    }
  }
  
  let showModal = (idx,e)=>{
    setOptions((produce((draft)=>{
      if(bookmarks.length-1 === idx){
        draft.addType = 1
      }else{
        draft.addType = 2
        draft.content ={name:bookmarks[idx].title,url:bookmarks[idx].url}
      }
      draft.idx = idx
    }))(options))
    
    setHasShowModal(!hasShowModal)
    if(e){
      e.preventDefault()
    }
  }
  useEffect(() => {
    localStorage.removeItem('bookmarks')
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks))
  },[bookmarks])
  setUrls()
  return (
    <div className="bookmark-box-container">
      <div className="bookmark-box">
      {
        bookmarks.map((it,idx)=>
          <div className="bookmark-container" key={'bm-'+idx}>
            <a className="bookmark-link" href={'http://'+it.url} onClick={it.url?()=>{}:showModal.bind(null,idx)}>
              {
                it.url?<div className="bookmark-config" onClick={showModal.bind(null,idx)}></div>:false
              }
              <div className="bookmark">
                <img src={it.icon?it.icon:defaultIcon} alt=""/>            
              </div>
              <span className="bookmark-title">{it.title}</span>
            </a>     
          </div>
          )
      }
      </div>
      {
        hasShowModal?
        <Modal modalClass ="add-bookmark-modal"
               modal={AddBookmarkModal}
               options ={options}
               funcs={{
                 editBookmark:editBookmark,
                 setShow:setHasShowModal,
               }}>    
        </Modal>:false
      }
      
    </div>
  )
}



function AddBookmarkModal(props){
  let name = ""
  let url = ""
  let hasContent = !!!(url)
  const completeBtn = useRef()
  const addBookmark =()=>{
    props.editBookmark(1,{name:name,url:url})
    props.setShow(false)
  }
  const deleteBookmark =()=>{
    props.editBookmark(2,{idx:props.idx})
    props.setShow(false)
  }
  const editBookmark =()=>{
    props.editBookmark(3,{name:name,url:url,idx:props.idx})
    props.setShow(false)
  }
  const handleName =(e)=>{
    name = e.target.value
    hasContent = !!!(url)
    completeBtn.current.setHasContent(hasContent)
    e.preventDefault()
  }
  const handleUrl =(e)=>{
    url = e.target.value
    hasContent = !!!(url)
    completeBtn.current.setHasContent(hasContent)
  }
  const enterBind =(e)=>{
    if(hasContent) return
    if(e.which === 13){
      addBookmark()
    }
  }
  if(props.addType === 2){//edit
    name = props.content.name
    url = props.content.url
  }
  useEffect(() => {
    document.getElementById('name').focus()
  })
  
  return (
    <div className ="bookmark-modal-container" onKeyDown={enterBind}>
      <div className ="bookmark-modal">
        <div className ="bookmark-title">
          {
            (props.addType===1?'添加':'修改')+'快捷方式'
          }
        </div>
        <Input id="name" title="名称" defaultValue={name} onFuncs={{onChange:handleName}}/>
        <Input title="网址" defaultValue={url} onFuncs={{onChange:handleUrl}}/>
        <div className ="bookmark-btns-container">
          <span>
            <button className="secondary delete" onClick={deleteBookmark} disabled = {props.addType===1?true:false}>删除</button>
          </span>
          <span>
            <button className="secondary cancel" onClick={()=>{props.setShow(false)}}>取消</button>
            <CompleteBtn ref={completeBtn} hasContent={hasContent} onClickFunc={props.addType===1?addBookmark:editBookmark}></CompleteBtn>
          </span>
        </div>
      </div>
    </div>
  )
}


const CompleteBtn = forwardRef((props,ref)=>{
  const [hasContent, setHasContent] = useState(props.hasContent)
  useImperativeHandle(
    ref,
    () => ({
      setHasContent:setHasContent
    })
  )
  return (
    <button className="primary submit"  disabled ={hasContent} onClick={props.onClickFunc}>
      完成
    </button>
  )
})

export default BookMarkBox
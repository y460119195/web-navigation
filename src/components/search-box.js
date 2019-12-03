import React, { useRef, useState } from "react";
import "./css/search-box.css";
import JsonP from './js/jsonp';
import md5 from 'md5'

function SearchBox(props){
  
  const [placeholder, setPlaceholder] = useState('Input your search')
  const [sug, setSug] = useState(null)
  //const [preWord, setPreWord] = useState('')
  const [nowWord, setNowWord] = useState('')
  const [tip, setTip] = useState(null)
  const sugEl = useRef(null)
  const inputEl = useRef(null)
  const [tipTimeOut, setTipTimeOut] = useState('')
  const [selectIdx, setSelectIdx] = useState(0)
  const keyHandle = (e)=>{
    if(e.which===38){
      changeSelect('+')
    }else if(e.which===40){
      changeSelect('-')
    }else if(e.which===13){
      goSearch()
    }else{
      return
    }
    e.preventDefault()
    return
  }
  const goSearch = ()=>{
    let text = nowWord
    if(selectIdx){
      text = sug[selectIdx-1].q
    }
    window.location = `https://www.baidu.com/s?ie=utf8&cl=3&wd=${text}`
  }
  const changeSelect = (action,type=true)=>{
    let old_n = selectIdx
    let sugTemp = sug
    if(!sugTemp) return false
    //console.log('sugTemp',sugTemp)
    if(old_n){
      sugTemp[old_n-1].type = "sug"
    }
    let n = old_n
    if(action ==='+')n--
    else if(action === '-')n++
    else n = action 
    if(n>5) n = 0
    if(n<0) n = 5
    setSelectIdx(n)
    
    if(n){
      //console.log('n',n)
      sugTemp[n-1].type = "sugSelect"
      if(type){
        tipCheck(sugTemp[n-1].q)
        inputEl.current.value = sugTemp[n-1].q
      }
    }else{
      if(type){
        inputEl.current.value =nowWord
      }
    }
    setSug(sugTemp)
  }
  const getAutoComplete = (e)=>{
    let text = e.target.value
    //console.log(tip)
    if(!text){
      init()
      setNowWord('')
      return
    }
    //console.log('text',text)
    //setPreWord(nowWord)
    setNowWord(text)
    tipCheck(text)
    JsonP(`https://www.baidu.com/sugrec?p=3&ie=utf-8&json=1&prod=pc&wd=${encodeURI(text)}&pwd=${encodeURI(nowWord)}`,
          '',{param:'cb'})
        .then(
        response=>{
          setSelectIdx(0)
          if(response.g){
            setSug(response.g.splice(0,5))
          }else{
            setSug(null)
          }
          //console.log('sug',sug)
        }
    )
  }
  const mouseEnter= (e)=>{
    e.persist();
    let idx = e.target.attributes['data-idx']
    if(idx){
      setSelectIdx(idx.value)
      changeSelect(idx.value,false)
    }
  }
  const judgeType = (text)=>{
    var numberExp = /[^0-9-+/()%*.]/g
    if(!numberExp.exec(text)){
      return 2
    }

    return 1
    //1:string 2:number
  }

  const tipCheck = (text)=>{
    
    if(judgeType(text)===2){
      if(tipTimeOut){
        clearTimeout(tipTimeOut)
      }
      let calc
      try{
        calc = eval(text)    
      }catch(e){
        calc = 'check format' 
      }
      setTip({type:2,content:calc})
    }else if(judgeType(text)===1){
      transRst(text)
    }
  }

  const transRst= (text)=>{
    console.log('readytrans')
    if(tip&&tip.type === 1){
      clearTimeout(tipTimeOut)
    }else{
      setTip({type:1,content:null})
    }
    setTipTimeOut(setTimeout(()=>{
      JsonP(`https://fanyi-api.baidu.com/api/trans/vip/translate?q=${text}&from=auto&to=zh&appid=20191213000365595&salt=1&sign=${md5('20191213000365595'+text+'18dki4fzT_CYpJ95uHsF1')}`,
      '',{param:'callback'})
      .then(response=>{
        setTip({type:1,content:response.trans_result[0].dst})
        setTipTimeOut(null)
      })
      // console.log('trans')
      // setTip({type:1,content:'ss'})
      // setTipTimeOut(null)
    },1000))
  }

  const init = ()=>{
    setSug(null)
    setTip(null)
    clearTimeout(tipTimeOut)
  }
  return (
    <div className="search-box-container">
      <div className ="search-box">
        <div className ="search-text">
          <div className="search-icon"/>
          <input className="search-input" 
                 ref={inputEl}
                 autoComplete="off" 
                 type="text" 
                 tabIndex="-1" 
                 aria-hidden="true" 
                 placeholder={placeholder}
                 onChange={getAutoComplete}
                 onFocus={(e)=>{setPlaceholder('');if(!sug)getAutoComplete(e)}}
                //  onBlur={()=>{setPlaceholder('Input your search');}}
                 onBlur={()=>{setPlaceholder('Input your search');init()}}
                 onKeyDown={keyHandle}/>
        </div>
        <div ref={sugEl}>
          {
            sug||tip?
            <ul className="search-sugs" >
              {
                tip?
                <li className="search-tip">
                  <div className={"search-tip-"+tip.type}/>
                  {
                    !tipTimeOut?tip.content:
                    'loading...'
                  }
                </li>:false
              }
              { sug?
                sug.map((it,idx)=>
                  <li key ={it.sa} data-idx = {idx+1}
                      className={it.type==="sug"?"search-sug":"search-sug selected"}
                      onMouseEnter={mouseEnter}>
                    <div className="search-icon"/>
                    {it.q}
                  </li>
                  ):false
              }
              </ul>:false
          }
        </div>
      </div>
    </div>
  )
}


export default SearchBox
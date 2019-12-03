
import React, { useState , useEffect } from "react";
import "./css/time-box.css"

function TimeBox (props){
  const getTime =()=>{
    let nowDate = new Date()
    let hour = nowDate.getHours().toString()
    let minutes = nowDate.getMinutes().toString()
    if(hour<10) hour="0"+hour
    if(minutes<10) minutes="0"+minutes
    return {hour:hour,minutes:minutes}
  }
  const [time, setTime] = useState(getTime())
  
  useEffect(() => {
    let timeout = setTimeout(
      ()=>{setTime(getTime())}
    ,1000)
    return () => {
      clearTimeout(timeout)
    };
  })
  return (
    <div className ="time-box-container">
      <div className="time-box">
      {
        time.hour+":"+time.minutes
      }
      </div>
    </div> 
  )
}

// const Time = React.memo(
//   (props)=>{
//     console.log(1)
//     return(
//       <div className ="time-box-container">
//         <div className="time-box">
//         {
//           props.time.hour+":"+props.time.minutes
//         }
//         </div>
//       </div>
//     )
//   }
// ,(prevProps, nextProps)=>{
//  if(prevProps.time.minutes === nextProps.time.minutes&&prevProps.time.hour === nextProps.time.hour){
//     return true
//   }else{
//     return false
//   }
// })


export default TimeBox
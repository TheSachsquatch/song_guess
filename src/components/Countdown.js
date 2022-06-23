import React, { useEffect} from 'react'
import {editPause, editTime} from '../store'
import {useSelector, useDispatch} from 'react-redux';
import {motion} from "framer-motion"

export default function Countdown() {

    const dispatch = useDispatch();
    const current = useSelector(state => state.player.time);
    const freeze = useSelector(state => state.player.freeze)
    const player = useSelector(state=> state.player.player)
    const device = useSelector(state=> state.player.device)
    const infinite = useSelector(state=> state.player.infinite)
    useEffect( () => {
        if(current===0 && device !=="" && !infinite){
            player.togglePlay();
            dispatch(editPause(true));
        }
        if(current>0 && !freeze){
            const newTime = current-1;
            setTimeout(() => {
                dispatch(editTime(newTime))
            }, 1000)
            
        }
    }, [current, device, dispatch, freeze, infinite, player])

  return (
    <div className = "text-[80px] py-4 px-4 overflow-hidden bg-slate-800 rounded-lg shadow-md text-white text-center h-40">
        <motion.div key = {current} initial = {{y:0}} animate = {{y:[-100,5,0]}} transition= {{ ease: "easeOut", duration: 0.2}} className = {(current<10 && !infinite) ? "!text-red-400" : ""}>
            {current}
        </motion.div>
    </div>
   
  )
}

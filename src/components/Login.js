import React, { useEffect } from 'react'
import {BsSpotify} from 'react-icons/bs'
import {useDispatch, useSelector} from 'react-redux';
import { editLoginAlert } from '../store';

export default function Login() {
  const login = useSelector(state => state.options.login_alert);
  const back_url = process.env.REACT_APP_URL;
  const dispatch = useDispatch();
  useEffect( () =>{
    if(login){
      setTimeout(() =>{dispatch(editLoginAlert(false)) }, 3000);
    }
  }, [login, dispatch])

  return (
    <div>
        <a href = {`${back_url}/auth/login`}>
          <div className = "btn flex flex-row shadow-lg" >
            <BsSpotify size = {20}/>
            <div className = "ml-2 tracking-wide">
              log in with spotify
            </div>
          </div>
        </a>
        <div className = {login ? "btn alert mt-3" : "opacity-0 alert btn mt-3"}>
            login to play
        </div>
    </div>
  )
}

import './App.css';
import React, {useEffect, useState} from 'react';
import Selectors from "./components/Selectors" 
import Axios from 'axios'
import {useDispatch, useSelector} from 'react-redux';
import {editToken, editGenreList, editClientToken, editUser, editUserProf} from './store';
import { Buffer } from "buffer";
import qs from 'qs';
import raw from './genres.txt';
import SongCard from "./components/song_card";
import Login from "./components/Login";
import { BsSpotify } from 'react-icons/bs';
import {RiGithubFill} from "react-icons/ri"


function App() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.player.clientToken)
  const img = useSelector(state=>state.options.img);
  const user = useSelector(state=>state.options.user);
  const back_url = process.env.REACT_APP_URL;
  useEffect(()=>{
    async function getToken(){
      const response = await fetch(`${back_url}/auth/token`, {
        method: "GET",
        'credentials' : 'include'
      });
      const json = await response.json();
      dispatch(editClientToken(json.access_token));
    }

    getToken();
  }, [dispatch, back_url])

  useEffect(()=>{
    fetch(raw)
      .then(r=>r.text())
      .then(text=>{
        const genreList = text;
        const genreArray = genreList.split("\n")
        dispatch(editGenreList(genreArray));
      })
    
    async function getToken(){
      var client_id = process.env.REACT_APP_CLIENT_ID;
      var client_secret = process.env.REACT_APP_CLIENT_SECRET;
      var auth_token = Buffer(client_id + ':' + client_secret).toString('base64')
      try{
          const token_url = 'https://accounts.spotify.com/api/token';
          const data = qs.stringify({'grant_type':'client_credentials'});
  
          const response = await Axios.post(token_url, data, {
              headers:{
                  'Authorization': `Basic ${auth_token}`,
                  'Content-Type' : 'application/x-www-form-urlencoded'
              }
          })
          dispatch(editToken(response.data.access_token));
      } catch(error){
          console.log(error);
      }
    }
    getToken()
  }, [dispatch])

  const [mobile, setMobile] = useState(false);
  useEffect(()=>{
      function detectMob() {
          const toMatch = [
              /Android/i,
              /webOS/i,
              /iPhone/i,
              /iPad/i,
              /iPod/i,
              /BlackBerry/i,
              /Windows Phone/i
          ];
          
          return toMatch.some((toMatchItem) => {
              return navigator.userAgent.match(toMatchItem);
          });
      }
      if(detectMob()){
          setMobile(true);
      }
  }, [])

  useEffect( () =>{
    const url = "https://api.spotify.com/v1/me"
    if(token!== ''){
      Axios.get(url, { headers:{
        'Authorization' : `Bearer ${token}`,
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
      } }).then((response, error)=>{
          if(error){
            console.log(error);
          }
          else{
            dispatch(editUser(response.data.id));
            if(response.data.images.length>0){
              dispatch(editUserProf(response.data.images[0].url))
            }
          }
      })
    }
  }, [token, dispatch])

  const logUserOut = async (e)=>{
    e.preventDefault();
    dispatch(editClientToken(""));
    await fetch(`${back_url}/auth/logout`, {
      method: "GET",
      'credentials' : 'include'
    });
  }
  const LoggedIn = () =>{
      return(
        <div>
            <div className = "btn flex flex-row h-10 !rounded-bl-none"  >
              <div className = "ml-2">
                {user}
              </div>
              <div className = "ml-2">
                {
                (img===undefined) ? <img src = {img} alt = "prof" className = "rounded-lg h-10 py-2 px-2"/> :
                <BsSpotify size = {20}/>
                }
              </div>
            </div>
            <button className = "btn logout !rounded-t-none !rounded-xl" onClick = {logUserOut}> 
                logout
            </button>
        </div>
      
      )
  }

  return (
    <div>
      <div className="grid justify-center">
        <div className = {!mobile ? "grid grid-cols-2 justify-items-center mb-10" : ""}>
          <header className="text-8xl mt-12">
            guess the song
          </header>
          <div className = {!mobile ? "mt-24 ml-10 justify-self-end" : "mt-2 ml-10 justify-self-center"}>
            { (token==='') ? <Login/> : <LoggedIn />}
          </div>
        </div>
        <div className = {!mobile ? "flex flex-row" : ""}>
          <Selectors mobile = {mobile}/>
          <div className = "mt-5">
            <SongCard/>
          </div>
        </div>
      </div>
      <div className = "h-14 w-full fixed bottom-0 bg-slate-200">
        <div className = "grid grid-flow-col auto-cols-max text-xl mt-3">
          <div className = "justify-self-center ml-5">
                  thesachsquatch&nbsp;
              </div>
              <a href ="https://github.com/TheSachsquatch" target = "_blank" rel = "noreferrer">
                  <RiGithubFill size= {30} className = "hover:text-gray-500 my-auto"/>
              </a>
        </div>
      </div>
    </div>
    
  );
}

export default App;

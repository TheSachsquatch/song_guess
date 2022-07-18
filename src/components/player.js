import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux';
import {editPlayer, editTrack, editPause, editDevice, editPoints, editGuess, editFreeze, editVolume} from '../store'
import {MdPlayCircleFilled, MdPauseCircleFilled} from 'react-icons/md'
import {BsFillSkipEndFill} from 'react-icons/bs'
import Axios from 'axios'
import ReactSlider from 'react-slider'
import {HiVolumeUp, HiVolumeOff} from 'react-icons/hi'

function Player({start}) {
    const dispatch = useDispatch();
    const points = useSelector(state=>state.player.points)
    const guess = useSelector(state=>state.player.guess)
    const track = useSelector(state=>state.player.current_track)
    const player= useSelector(state=>state.player.player)
    const token = useSelector(state=>state.player.clientToken);
    const paused = useSelector(state=>state.player.is_paused);
    const freeze = useSelector(state=>state.player.freeze);
    const device = useSelector(state=>state.player.device);
    const artistSelect = useSelector(state=>state.options.artist);
    const albumSelect = useSelector(state=>state.options.album);
    const [instanceExists, setInstanceExists] = useState(false);
    const [trackG, setTrackG] = useState("");
    const [albumG, setAlbumG] = useState("");
    const [artistG, setArtistG] = useState("");
    const [playingSong, setPlayingSong] = useState(false);
    const [oldVol, setOldVol] = useState(0);
    useEffect(()=>{
        dispatch(editGuess(false));
    }, [track, dispatch])
  useEffect(()=>{
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js"
    script.async = true;

    const device_url = "https://api.spotify.com/v1/me/player/devices"
    if(token!== ""){
        Axios.get(device_url, {
            headers:{
                'Authorization' : `Bearer ${token}`,
                'Content-Type' : 'application/json',
                'Accept' : 'application/json'
            }
        }).then((response, error)=>{
            if(error){
                console.log(error)
            }
            else{
                if(response.data.devices.length>0){
                    for(const device of response.data.devices){
                        if(device.name === "Web Playback SDK"){
                            console.log("instance")
                            dispatch(editDevice(device.id));
                            setInstanceExists(true);
                        }
                    }
                }
            }
        }).then(()=>{
            if(!instanceExists){
                document.body.appendChild(script);
                window.onSpotifyWebPlaybackSDKReady = () =>{
                    const player = new window.Spotify.Player({
                        name: 'Web Playback SDK',
                        getOAuthToken: cb => { cb(token); },
                        volume: 0.5
                    });
            
                    dispatch(editPlayer(player));
            
                    player.addListener('ready', ({ device_id }) => {
                        console.log('Ready with Device ID', device_id);
                        dispatch(editDevice(device_id));
                    });
            
                    player.addListener('not_ready', ({ device_id }) => {
                        console.log('Device ID has gone offline', device_id);
                    });
            
                    player.addListener('player_state_changed', (state=>{
                        if(!state){
                            return;
                        }
                        if(state.track_window.current_track===null){
                            setPlayingSong(false);
                            dispatch(editTrack({name: "",
                            album: {
                                images: [
                                    { url: "" }
                                ], 
                                name: ""
                            },
                            artists: [
                                { name: "" }
                            ] }));
                        }
                        else{
                            setPlayingSong(true);
                            dispatch(editTrack(state.track_window.current_track));
                        }
                        dispatch(editPause(state.paused));
                    }))
                    player.connect();
            
                }
            }
        })
    }
  }, [token, dispatch, instanceExists])

  const setPlayback = (e) =>{
    e.preventDefault();
    freeze ? dispatch(editFreeze(false)) :dispatch(editFreeze(true))
    player.togglePlay();
    paused ? dispatch(editPause(false)) :
    dispatch(editPause(true))
  }

  const makeGuess = (e) =>{
    e.preventDefault();
    let pts = points;
    if(track.name.toLowerCase()===trackG.toLowerCase()){
        pts++;
    }
    if(track.artists[0].name.toLowerCase()===artistG.toLowerCase()){
        pts++;
    }
    if(track.album.name.toLowerCase() === albumG.toLowerCase()){
        pts++;
    }
    dispatch(editPoints(pts));
    dispatch(editGuess(true));
  }

  const GuessTemp = ({gs, ans}) =>{
    if(gs.toLowerCase()===ans.toLowerCase()){
        return(
            <div className = "text-green-600 font-semibold ml-1">
                {ans}
            </div>
        )
    }
    else{
        return(
            <div>
                <span className = "line-through text-red-500 ml-1">
                    {gs}&nbsp;
                </span>
                <span className = "text-green-600 font-semibold ml-1">
                    {ans}
                </span>
            </div>
        )
    }
   
  }

  const nextSong = (e)=>{
    setTrackG("");
    setAlbumG("");
    setArtistG("")
    start(e);
  }

  const volume = useSelector(state => state.player.volume);

  const changeVolume = (e) =>{
    dispatch(editVolume(e));
  }
  const mute = (e) =>{
    e.preventDefault();
    setOldVol(volume);
    changeVolume(0);
  }
  const unmute = (e) =>{
    e.preventDefault();
    changeVolume(oldVol);
  }

  const setGuess = ({e, type}) =>{
    if(type==="artist"){
        setArtistG(e.target.value);
    }
    else if(type==="album"){
        setAlbumG(e.target.value);
    }
    else{
        setTrackG(e.target.value);
    }
  }
  const Info = ({type}) =>{
    let ansL = track.artists[0].name;
    let select = artistSelect;
    let gsu = artistG;
    if(type==="album"){
        ansL = track.album.name;
        select = albumSelect;
        gsu = albumG;
    }
    else if(type==="track"){
        ansL = track.name;
        gsu = trackG;
    }

    if((type==="artist" && artistSelect!=="" )||(type==="album" && albumSelect!=="") ){
        return(
            <div className = "playertext flex mb-2 flex-row">
                <div>
                    {type}&nbsp;:&nbsp;{select}
                </div>
            </div>
        )
    }
    else{
        return (
            <div className = "playertext flex mb-2 flex-row">
                    <div>
                        {type}: 
                    </div>
                    {guess ? <div> <GuessTemp gs = {gsu} ans = {ansL}/> </div> : 
                        <form className = "ml-4 rounded-lg mr-4"> 
                            <input name = {`${type}`} className = {playingSong ? "pl-2 active rounded-md text-black" : "rounded-md text-black" } onChange= {(e) => {setGuess(e={e}, type={type})}} />
                        </form>
                    }
            </div>
        )
    }
  }

  useEffect(() =>{
    if(track.name !=="" && !paused  && token!==""){
        var connect_url = `https://api.spotify.com/v1/me/player/volume?device_id=${device}&volume_percent=${volume}`
        const data = {};
        Axios.put(connect_url, data, {
            headers:{
                'Authorization' : `Bearer ${token}`,
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
            }
        } ).then((response, error)=>{
            if(error){
                console.log(error);
            }
        })
    }
  }, [volume, device, track, paused, token])
  return (

    <div className = "grid grid-cols-1 bg-gray-800 rounded-lg shadow-xl">
        <img src = {track.album.images[0].url} alt = "alt"
            className= {guess ? "rounded-md justify-self-center mt-3 max-h-32" : "rounded-md justify-self-center mt-3 blur-3xl max-h-40"}/>
        <div className = "flex flex-row justify-center">
            {paused ? <button onClick= {setPlayback} className = "hover:brightness-75">
            <MdPlayCircleFilled size = {80} color = {"white"}/>
            </button> :
            <button onClick = {setPlayback} className = "hover:brightness-75">
                <MdPauseCircleFilled size = {80} color = {"white"}/>
            </button>}
            <button onClick = {nextSong} className = "hover:brightness-75">
                <BsFillSkipEndFill size = {80} color = {"white"} />
            </button>
        </div>
        <div className = "flex flex-rows justify-self-center mr-2">
            {(volume!==0) ? <button className = "mx-2" onClick = {mute}>
                <HiVolumeUp size = {30} color = "white"/>
            </button> : <button className ="mx-2" onClick = {unmute}> <HiVolumeOff size = {30} color = "white"/></button>
            }
            
            <ReactSlider 
                className = "horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                onChange = {changeVolume}
                max = {100}
                min = {0}
                value = {volume}
            />
        </div>
        <div>
            <Info type = "track" />

            <Info type = "album" />

            <Info type = "artist" />

            <div className = "grid justify-items-center mb-3">
                <button className = {playingSong ? "btn !bg-white !text-gray-800 overflow-hidden h-100" : "btn !bg-white !text-gray-800 !h-0 hidden transition-[height] ease-in-out duration-300 overflow-hidden"} onClick = {makeGuess}>
                        submit guess
                </button>
            </div>
        </div>
    </div>
  )
}

export default Player;

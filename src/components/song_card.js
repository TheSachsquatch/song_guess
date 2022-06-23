import React, {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux';
import {editPause, editTime, editFreeze, editGuess, editInfinite, editLoginAlert} from '../store'
import Axios from 'axios';
import Player from './player';
import Countdown from './Countdown';
import ReactSlider from 'react-slider'

function SongCard() {
    const dispatch = useDispatch();
    const [playSong, setPlaySong] = useState(false);
    const artist = useSelector(state => state.options.artist)
    const album = useSelector(state=> state.options.album)
    const genre = useSelector(state=>state.options.genre)
    const access_token = useSelector(state=>state.options.access_token)
    const client_token = useSelector(state=>state.player.clientToken)
    const device = useSelector(state=>state.player.device)
    const player= useSelector(state=>state.player.player)
    const points = useSelector(state=>state.player.points)
    const artistID = useSelector(state=>state.options.artist_id)
    const albumID = useSelector(state=>state.options.album_id)
    const [timeLim, setTimeLim] = useState(0);
    const playlist = useSelector(state=>state.options.playlist)
    const playlist_id = useSelector(state=>state.options.playlist_id)

    const playSongDevice = (currentSong) =>{
        var connect_url = `https://api.spotify.com/v1/me/player/play?device_id=${device}`

        let data = {}
        if(playlist===""){
            const uris = [currentSong.uri]
            data = {
                "uris":uris
            }
        }
        else{
            data = {
                "context_uri": `spotify:playlist:${currentSong}`
            }
        }
       
        Axios.put(connect_url, data, {
            headers:{
                'Authorization' : `Bearer ${client_token}`,
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
            }} ).then((response, error)=>{
            if(error){
                console.log(error);
            }
            else{
                dispatch(editPause(false));
                dispatch(editGuess(false));
                dispatch(editFreeze(false));
                if(timeLim===0){
                    dispatch(editInfinite(true));
                }
                else{
                    dispatch(editInfinite(false));
                }
                dispatch(editTime(timeLim));
                player.togglePlay();
            }
        }).then(()=>{
            let state = false;
            if(playlist!==""){
                state = true;
            }
            let url = `https://api.spotify.com/v1/me/player/shuffle?device_id=${device}&state=${state}`
            Axios.put(url, {}, {
                headers:{
                    'Authorization' : `Bearer ${client_token}`
                }
            }).then((response, error)=>{
                if(error){
                    console.log(error);
                }
            })
        })
    }

    let getSong = async () => {
        setPlaySong(false);
        var currentSong = {};
        const randomOffset = Math.floor(Math.random() * 200);
        const randomArtistOffset = Math.floor(Math.random() * 10);
        let getRandArtist = () =>{
            const characters = "abcdefghijklmnopqrstuvwxyz";
            return characters.charAt(Math.floor(Math.random() * characters.length))
        }
        var art = getRandArtist();
        let url = `https://api.spotify.com/v1/search?type=track&include_external=audio&q=artist:${art}&offset=${randomOffset}&limit=1`;
        if(playlist!== ""){
            return playlist_id;
        }
        else if(album!==""){
            url = `https://api.spotify.com/v1/albums/${albumID}`
        }
        else if(artist!==""){
            const artUrl = `https://api.spotify.com/v1/artists/${artistID}/albums?offset=${randomArtistOffset}&limit=1`
            await Axios.get(artUrl, {
                headers:{
                    'Authorization': `Bearer ${access_token}`
                }
            }).then((response, error)=>{
                if(error){
                    console.log(error);
                }
                else{
                    const album = response.data.items[0].id;
                    url = `https://api.spotify.com/v1/albums/${album}`
                }
            })
        }
        else if(genre!== ""){
            url = `https://api.spotify.com/v1/search?type=track&include_external=audio&q=genre:${genre}&offset=${randomOffset}&limit=1`
        }
        let output = await Axios.get(url, {
            headers:{
                'Authorization': `Bearer ${access_token}`
            }
        }).then((response, error)=>{
            if(error){
                console.log(error);
            }
            else{
                if(album!=="" || artist!==""){
                    const numTracks = response.data.tracks.items.length;
                    const randomTrackOffset = Math.floor(Math.random()*numTracks);
                    currentSong = response.data.tracks.items[randomTrackOffset];
                }
                else{
                    currentSong = response.data.tracks.items[0];
                }
                return currentSong;
            }
        })
        return output;
    }

    const start = (e) =>{
        e.preventDefault();
        if(client_token===""){
            dispatch(editLoginAlert(true));
        }
        else{
            playSong ? setPlaySong(false) : setPlaySong(true);
            if(!playSong){
                getSong().then((currentSong)=>{
                    playSongDevice(currentSong);
                })
            }
        }
    }

    const getSelection = () =>{
        if(playlist!==""){
            return "selection: playlist"
        }
        if(album!=="" ){
            return "selection: album"
        }
        if(artist!==""){
            return "selection: artist"
        }
        if(genre!==""){
            return "selection: genre"
        }
        return "selection: random"
    }

    const setTime = (e) =>{
        setTimeLim(e);
    }

    const time = useSelector(state => state.player.time)
  return (
    <div className = "bg-slate-100 px-5 py-5 rounded-md shadow-md mb-20">
        <div className = "flex flex-row">
            <div className = "btn !bg-gray-900 text-white w-fit flex flex-row items-center">
                {getSelection()}
            </div>
            <div className = "ml-1 btn !bg-gray-900 text-white w-fit flex flex-row items-center">
                <div>
                    time limit
                </div>
                <ReactSlider 
                className = "horizontal-slider !ml-2 !w-20"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                onChange = {setTime}
                max = {60}
                min = {1}
                />
                <div className = "ml-2">
                    {timeLim}
                </div>
            </div>
        </div>
        
        <button className = {!playSong ? "btn mt-2 mb-2" : "btn mt-2 mb-2 !bg-red-600"} onClick = {start}>
            {!playSong  ? "start guessing" : "stop guessing"}
        </button>
        <div className = "grid grid-cols-2">   
                <div>
                    <Player start = {start} />
                </div>
                <div className = "justify-self-center flex flex-col">
                    <div className = "bg-slate-800 text-white text-xl text-semibold py-2 rounded-full mb-5 text-center px-4">
                        &nbsp;score: {points}
                    </div>
                    <Countdown time = {!playSong ? 1 : time+1}/>
                </div>
        </div>
    </div>
  )
}

export default SongCard;

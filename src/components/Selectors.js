import React, { useEffect } from 'react'
import {HiChevronDown} from "react-icons/hi"
import {HiChevronUp} from "react-icons/hi"
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {editGenre, editAlbum, editArtist, editArtistList, editAlbumList, editPlaylist, editPlaylistID, editPlaylistUser} from '../store';
import GenreSearch from './GenreSearch'
import Search from './Search'
import Axios from 'axios'
import PlaylistSearch from "./PlaylistSearch"

function Selectors({mobile}) {
    const client_token = useSelector(state=>state.player.clientToken);
    const dispatch = useDispatch();
    const [genreSelected, setGenreSelected] = useState(false);
    const genre = useSelector(state => state.options.genre);
    const genres = useSelector(state => state.lists.genres);
    const artist = useSelector(state =>state.options.artist);
    const album = useSelector(state=> state.options.album);
    const [genreDrop, setGenreDrop] = useState(false)
    const [albumSearch, setAlbumSearch] = useState(false)
    const [artistSearch, setArtistSearch] = useState(false)
    const [artistChange, setArtistChange] = useState(false)
    const [albumChange, setAlbumChange] = useState(false)
    const [playlistSearch, setPlaylistSearch]  = useState(false);
    const [genreFill, setGenreFill]  = useState("");
    const playlist = useSelector(state=>state.lists.playlist_user)
    const play = useSelector(state=>state.options.playlist);
    const setGenreDropdown = (e) =>{
        e.preventDefault();
        if(!genreDrop){
            dispatch(editGenre(""))
        }
        genreDrop ? setGenreDrop(false) : setGenreDrop(true);
    }
    const setAlbumDropdown = (e) =>{
        e.preventDefault();
        if(!albumSearch){
            dispatch(editAlbum(""))
            dispatch(editAlbumList([]))
        }
        albumSearch ? setAlbumSearch(false) : setAlbumSearch(true);
    }
    const setArtistDropdown = (e) =>{
        e.preventDefault();
        if(!artistSearch){
            dispatch(editArtist(""))
            dispatch(editArtistList([]))
        }
        artistSearch ? setArtistSearch(false) : setArtistSearch(true);
    }

    const setPlaylistDropdown = (e) =>{
        e.preventDefault();
        if(!playlistSearch){
            dispatch(editPlaylist(""))
            dispatch(editPlaylistID(""))
        }
        playlistSearch ? setPlaylistSearch(false) : setPlaylistSearch(true);
    }

    const Dropdown = ({drop, setDrop, type}) =>{
        return (
            <button className = {drop ? "btn mr-5 !rounded-b-none h-12" : "btn mr-5 h-12"} onClick = {setDrop}>
                <div className = "flex items-center justify-center">
                    <span className = "mr-2">{type}
                    </span>
                    <span>
                        {drop ? <HiChevronUp size= {20}/> : <HiChevronDown size = {20}/> }
                    </span>
                </div> 
            </button>
        )
    }

    const onArtistChange = (e) =>{
        setArtistChange(true)
        dispatch(editArtist(e.target.value))
    }

    const onAlbumChange = (e) =>{
        setAlbumChange(true)
        dispatch(editAlbum(e.target.value))
    }

    const onGenreChange = (e) =>{
        setGenreSelected(false);
        setGenreFill(e.target.value);
        dispatch(editGenre(e.target.value));
    }

    const genreSelect = (e) =>{
        setGenreSelected(true);
        dispatch(editGenre(e.target.value));
    }

    const playlistSelect = (e) =>{
        dispatch(editPlaylist(e.target.innerText));
        dispatch(editPlaylistID(e.target.id))
        let newPlaylist = [...playlist];
        for(let i =0; i<newPlaylist.length; i++){
            if(newPlaylist[i].name===e.target.innerText){
                let item = newPlaylist[i];
                newPlaylist.splice(i, 1);
                newPlaylist.unshift(item);
                break;
            }
        }
        dispatch(editPlaylistUser(newPlaylist))
    }

    useEffect(()=>{
        const url = "https://api.spotify.com/v1/me/playlists"
        if(client_token!=="" && playlist.length===0)
        {
            Axios.get(url, {
                headers : {
                    'Authorization': `Bearer ${client_token}}`,
                    'Content-Type' : "application/json"
                }
            }).then((response, error)=>{
                if(error){
                    console.log(error);
                }
                else{
                    dispatch(editPlaylistUser(response.data.items));
                }
            })
        }
    }, [playlistSearch, client_token, playlist, dispatch])

  return (
    <div className = "flex flex-col bg-slate-100 rounded-lg shadow-md">
         <div className = {mobile? "flex flex-row mt-5" : "flex flex-row mt-5" }>
          <div className = "flex flex-col ml-5">
            <Dropdown drop = {genreDrop} setDrop = {setGenreDropdown} type = "genre" />
            <div className = "flex flex-col grow mr-5">
                <form>
                    <input className = {genreDrop ? "active pl-2 pr-1 w-full" : "pl-2 pr-1 w-full"} type = "text" id = "genre" name = "genre" value = {genre} onChange = {onGenreChange}/>
                </form>
                <GenreSearch genreDrop={genreDrop} genreSelected = {genreSelected} genres = {genres} genreSelect = {genreSelect} genreFill = {genreFill}/>
            </div>
          </div>
          <div className = "flex flex-col">
            <Dropdown drop = {artistSearch} setDrop = {setArtistDropdown} type = "artist"/>
            <div className = "flex flex-col justify-items-center grow mr-5">
                <form>
                    <input className = {artistSearch ? "active pl-2 pr-1 w-full" : "pl-2 w-full"} type = "text" id = "artist" name = "artist" onChange = {onArtistChange} value = {artist}/>
                </form>
                <Search type = "artist" search = {artistSearch} artistChange = {artistChange} setArtistChange= {setArtistChange}/>
            </div>
          </div>
          <div className = "flex flex-col">
            <Dropdown drop = {albumSearch} setDrop = {setAlbumDropdown} type = "album"/>
            <div className = "flex flex-col justify-items-center grow mr-5">
                <form >
                    <input className = {albumSearch ? "active pl-2 pr-1 w-full" : "pl-2 w-full"} type = "text" id = "album" name = "album" onChange = {onAlbumChange} value = {album}/>
                </form>
                <Search type = "album" search = {albumSearch} albumChange = {albumChange} setAlbumChange = {setAlbumChange}/>
            </div>
          </div>
      </div>

        <div className = "text-2xl text-center mr-5 font-semibold mb-3">
            or
        </div>

        <div className = "grid grid-cols-3 justify-items-center">
            <div className = "flex flex-col col-start-2 justify-items-center">
                <Dropdown drop = {playlistSearch} setDrop = {setPlaylistDropdown} type = "playlist"/>
                <div className = "flex flex-col justify-items-center grow mr-5">
                    <PlaylistSearch playlistSearch = {playlistSearch} playlist = {playlist} playlistSelect = {playlistSelect} play = {play}/>
                </div>
            </div>
            
        </div>

    </div>
   
  )
}

export default Selectors;

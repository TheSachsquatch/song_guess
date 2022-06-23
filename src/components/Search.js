import Axios from 'axios'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {editArtistList, editAlbumList, editArtist, editAlbum, editArtistID, editAlbumID} from '../store';

function Search({type, search, artistChange, setArtistChange, albumChange, setAlbumChange}) {
    const access_token = useSelector(state=> state.options.access_token);
    const album = useSelector(state=> state.options.album);
    const artist = useSelector(state=>state.options.artist);
    const genre = useSelector(state=>state.options.genre);
    const albumList = useSelector(state=>state.lists.albumList);
    var artistList = useSelector(state=>state.lists.artistList);
    const [selected, setSelected] = useState(false);
    const dispatch = useDispatch();
    useEffect(() =>{
        if(search && ( (artistChange && (type=== "artist" && artist!=="") )|| (albumChange && ( type==="album" && album!=="" ) ) )){
            setSelected(false)
            var api_url = "";
            var gen = ""
            var art = ""
            if(genre!== ""){
                gen = `+genre:${genre}`
            }
            if(artist!==""){
                art = `+artist:${artist}`
            }
            if(type==="album"){
                setAlbumChange(false)
                api_url = `https://api.spotify.com/v1/search?type=album&include_external=audio&q=album:${album}${art}`
            }
            else{
                setArtistChange(false)
                api_url = `https://api.spotify.com/v1/search?type=artist&include_external=audio&q=artist:${artist}${gen}`;
            }
            Axios.get(api_url, {
                headers:{
                    'Authorization': `Bearer ${access_token}`
                }
            }).then((response, error)=>{
                if(error){
                    console.log(error);
                }
                else{
                    if(type==="album"){
                        dispatch(editAlbumList(response.data.albums.items));
                    }
                    else{
                        dispatch(editArtistList(response.data.artists.items));
                    }
                }
            })
        }
      }, [search, artistChange, type, artist, albumChange, album, access_token, setAlbumChange, setArtistChange, dispatch, genre])
      const ArtistImage = ({item}) =>{
        if(item.images.length>0){
            return (
                <img className = "ml-2 h-8 rounded-full mr-2" src = {item.images[0].url}  alt = "" />
            )
        }
      }

      const setArtist = (e) =>{
        setSelected(true)
        dispatch(editArtistID(e.target.id));
        dispatch(editArtist(e.target.innerText));
      }

      const setAlbum = (e) =>{
        setSelected(true)
        dispatch(editAlbumID(e.target.id));
        dispatch(editAlbum(e.target.innerText));
      }

      return (
        <div>
            <ul className = {search&&!selected ? "active !rounded-b-none shadow-md" : "!rounded-b-none shadow-md"}>
                {type==="artist" ? artistList.map((item)=>(
                    <li key = {item.id}>
                        <button value = {item.id} onClick = {(e) =>setArtist(e)} className = "flex items-center justify-center mt-1 mb-1">
                            <div className = "ml-2" id = {item.id}>
                                {item.name}
                            </div>
                            <ArtistImage item = {item}/>
                        </button>
                    </li>)) : albumList.map((item)=>(
                    <li key = {item.id}>
                        <button value = {item.id} onClick = {setAlbum} className = "flex items-center justify-center mt-1 mb-1">
                            <div className = "ml-2" id = {item.id}>
                                {item.name}
                            </div>
                            <ArtistImage item = {item}/>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Search;

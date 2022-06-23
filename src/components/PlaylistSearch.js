import React from 'react'

export default function PlaylistSearch({playlistSearch, playlist, playlistSelect, play}) {
  return (
    <div>
        <ul className = {playlistSearch ? "active shadow-md rounded-b-none" :  "shadow-md rounded-b-none"}>
            {playlist.map((item)=> (
            <li key = {item.id} className = {(item.name===play) ? "bg-slate-300 py-1" : "py-1"}>
                <button value = {item.id} onClick = {playlistSelect}>
                    <div className =  "flex flex-row" id = {item.id}>
                        <div id = {item.id} className = {(item.name===play) ? "bold" : ""}>
                            {item.name}
                        </div>
                        {
                            (item.images.length>0)?
                            <img src = {item.images[0].url} className = "ml-3 h-8 rounded-full" alt = "alt"/> :null
                        }
                    </div>
                </button> 
            </li>
            ))}
        </ul>
    </div>
  )
}

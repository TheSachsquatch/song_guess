import React from 'react'

export default function GenreSearch({genreSelected, genreFill, genres, genreDrop, genreSelect}) {
    if(!genreSelected && genreFill!== ""){
        var matchList = [];
        for(const gen of genres){
            if(gen.toLowerCase().startsWith(genreFill.toLowerCase())){
                matchList.push(gen);
            }
        }
        return(
            <ul className = {genreDrop ? "active shadow-md rounded-b-none" :  "rounded-b-none"}>
                {matchList.map((item)=> (
                <li key = {item}>
                    <button value = {item} onClick = {genreSelect}>
                        {item}
                    </button> 
                </li>
                ))}
            </ul>
        )
    }
   
}

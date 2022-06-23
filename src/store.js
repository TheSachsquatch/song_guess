import {combineReducers} from 'redux';

const EDIT_GENRE = 'EDIT_GENRE';
const EDIT_ARTIST = 'EDIT_ARTIST';
const EDIT_ALBUM = 'EDIT_ALBUM';
const EDIT_TOKEN = 'EDIT_TOKEN';
const ALB_LIST = 'ALB_LIST';
const ART_LIST = 'ART_LIST';
const GEN_LIST = 'GEN_LIST';
const EDIT_PLAYER = 'EDIT_PLAYER'
const EDIT_PAUSE = 'EDIT_PAUSE'
const EDIT_ACTIVE = 'EDIT_ACTIVE'
const EDIT_TRACK = 'EDIT_TRACK'
const EDIT_GUESS = 'EDIT_GUESS'
const EDIT_CLIENT_TOKEN = 'EDIT_CLIENT_TOKEN'
const EDIT_DEVICE ='EDIT_DEVICE'
const EDIT_POINTS = 'EDIT_POINTS'
const EDIT_HIGH_SCORE = 'EDIT_HIGH_SCORE'
const EDIT_FREEZE = 'EDIT_FREEZE'
const EDIT_TIME = 'EDIT_TIME'
const EDIT_VOLUME = 'EDIT_VOLUME'
const EDIT_INF = 'EDIT_INF'
const EDIT_ARTIST_ID = 'EDIT_ARTIST_ID';
const EDIT_ALBUM_ID = 'EDIT_ALBUM_ID';
const EDIT_USER = 'EDIT_USER';
const EDIT_USER_PROF = 'EDIT_USER_PROF';
const EDIT_PLAYLIST = 'EDIT_PLAYLIST';
const EDIT_PLAYLIST_ID = 'EDIT_PLAYLIST_ID';
const EDIT_LOGIN_ALERT = 'EDIT_LOGIN_ALERT'
const EDIT_PLAYLIST_USER = 'EDIT_PLAYLIST_USER'

const defaultState = {
    genre: "",
    artist: "",
    album: "",
    access_token: "",
    artist_id: "",
    album_id: "",
    user: "",
    img: "",
    playlist:"",
    playlist_id: "", 
    login_alert: false
}

const defaultPlayerState = {
    is_paused: true,
    is_active: true,
    current_track: {name: "",
    album: {
        images: [
            { url: "" }
        ], 
        name: ""
    },
    artists: [
        { name: "" }
    ] },
    player: undefined,
    hasGuessed: false,
    clientToken: "",
    device: "",
    points: 0,
    highScore: 0,
    freeze : false,
    time: 1,
    volume: 0,
    infinite: true
}

const defaultListState = {
    genres: [
        "j-pop",
        "r&b",
        "lo-fi"
    ], 
    albumList : [],
    artistList: [],
    playlist_user: []
}

export function editPlaylistUser(playlist){
    return{
        type:'EDIT_PLAYLIST_USER',
        playlist
    }
}
export function editLoginAlert(login){
    return {
        type:'EDIT_LOGIN_ALERT',
        login
    }
}
export function editPlaylistID(id){
    return{
        type:'EDIT_PLAYLIST_ID',
        id
    }
}

export function editPlaylist(playlist){
    return{
        type:'EDIT_PLAYLIST',
        playlist
    }
}

export function editUser(id){
    return{
        type:'EDIT_USER',
        id
    }
}
export function editUserProf(prof){
    return{
        type:'EDIT_USER_PROF',
        prof
    }
}
export function editArtistID(id){
    return{
        type: 'EDIT_ARTIST_ID',
        id
    }
}
export function editAlbumID(id){
    return{
        type: 'EDIT_ALBUM_ID',
        id
    }
}
export function editInfinite(infinite){
    return{
        type: 'EDIT_INF',
        infinite
    }
}
export function editScore(score){
    return{
        type:'EDIT_SCORE',
        score
    }
}
export function editVolume(volume){
    return{
        type:'EDIT_VOLUME',
        volume
    }
}

export function editTime(time){
    return{
        type:'EDIT_TIME',
        time
    }
}
export function editFreeze(freeze){
    return{
        type:'EDIT_FREEZE',
        freeze
    }
}
export function editPoints(points){
    return{
        type:'EDIT_POINTS',
        points
    }
}

export function editHighScore(points){
    return{
        type:'EDIT_HIGH_SCORE',
        points
    }
}

export function editDevice(device){
    return{
        type:'EDIT_DEVICE',
        device
    }
}
export function editClientToken(token){
    return{
        type:'EDIT_CLIENT_TOKEN',
        token
    }
}
export function editGuess(guess){
    return{
        type:'EDIT_GUESS',
        guess
    }
}
export function editPause(pause){
    return{
        type:'EDIT_PAUSE',
        pause
    }
}
export function editActive(active){
    return{
        type:'EDIT_ACTIVE',
        active
    }
}
export function editTrack(track){
    return{
        type:'EDIT_TRACK',
        track
    }
}
export function editPlayer(player){
    return{
        type:'EDIT_PLAYER',
        player
    }
}
export function editGenreList(genList){
    return {
        type: 'GEN_LIST',
        genList
    }
}
export function editArtist(artist){
    return{
        type:'EDIT_ARTIST',
        artist
    }
}
export function editGenre(genre){
    return{
        type: 'EDIT_GENRE',
        genre,
    }
}
export function editAlbum(album){
    return{
        type: 'EDIT_ALBUM', 
        album
    }
}
export function editToken(token){
    return{
        type:'EDIT_TOKEN',
        token
    }
}
export function editAlbumList(list){
    return{
        type:'ALB_LIST', 
        list
    }
}
export function editArtistList(list){
    return{
        type:'ART_LIST', 
        list
    }
}

function player(state = defaultPlayerState, action){
    switch(action.type){
        case EDIT_INF:
            return{
                ...state,
                infinite: action.infinite
            }
        case EDIT_VOLUME:
            return{
                ...state,
                volume: action.volume
            }
        case EDIT_TIME:
            return{
                ...state,
                time: action.time
            }
        case EDIT_FREEZE:
            return{
                ...state,
                freeze: action.freeze
            }
        case EDIT_POINTS:
            return{
                ...state,
                points: action.points
            }
        case EDIT_HIGH_SCORE:
            return{
                ...state,
                highScore: action.points
            }
        case EDIT_DEVICE:
            return{
                ...state,
                device: action.device
            }
        case EDIT_CLIENT_TOKEN:
            return{
                ...state,
                clientToken: action.token
            }
        case EDIT_GUESS:
            return{
                ...state,
                guess: action.guess
            }
        case EDIT_PLAYER:
            return{
                ...state,
                player: action.player
            }
        case EDIT_PAUSE:
            return{
                ...state,
                is_paused: action.pause
            }
        case EDIT_ACTIVE:
            return{
                ...state,
                active: action.active
            }
        case EDIT_TRACK:
            return{
                ...state, 
                current_track: action.track
            }
        default:
            return state
    }
}
function options(state=defaultState, action){
    switch(action.type){
        case EDIT_LOGIN_ALERT:
            return{
                ...state,
                login_alert: action.login
            }
        case EDIT_PLAYLIST_ID:
            return{
                ...state,
                playlist_id: action.id
            }
        case EDIT_PLAYLIST:
            return{
                ...state,
                playlist: action.playlist
            }
        case EDIT_USER:
            return{
                ...state,
                user: action.id
            }
        case EDIT_USER_PROF:
            return{
                ...state,
                img: action.prof
            }
        case EDIT_ARTIST_ID:
            return{
                ...state,
                artist_id: action.id
            }
        case EDIT_ALBUM_ID:
            return{
                ...state,
                album_id: action.id
            }
        case EDIT_ARTIST:
            return{
                ...state,
                artist : action.artist
            }
        case EDIT_GENRE:
            return{
                ...state,
                genre : action.genre
            }
        case EDIT_ALBUM:
            return{
                ...state,
                album : action.album
            }
        case EDIT_TOKEN:
            return{
                ...state,
                access_token: action.token
            }
        case ALB_LIST:
            state.albumList = action.list
            return {...state}
        case ART_LIST:
            state.artistList = action.list
            return {...state}
        default:
            return state;
    }
}

function lists(state = defaultListState, action){
    switch(action.type){
        case EDIT_PLAYLIST_USER:
            return{
                ...state,
                playlist_user : action.playlist
            }
        case ALB_LIST:
            return{
                ...state, 
                albumList : action.list
            }
        case ART_LIST:
            return{
                ...state, 
                artistList : action.list
            }
        case GEN_LIST:
            return{
                ...state,
                genres : action.genList
            }
        default:
            return state;
    }
}

const storeApp = combineReducers({
    options, lists, player
})

export default storeApp;
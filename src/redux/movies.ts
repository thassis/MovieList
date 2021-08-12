import { AnyAction } from 'redux'

//keys
export const SET_MOVIE = 'SET_MOVIE'

export interface MovieState {
    Poster: String,
    Title: String,
    Year: String
}

export function setMovie(movie: MovieState) {
    console.log("chegou no action", movie);
    return {
        type: SET_MOVIE,
        movie
    }
}

const initialState: MovieState = {
    Poster: "",
    Title: "",
    Year: ""
};


function moviesReducer(state = initialState, action: AnyAction) {
    console.log("chegou no reduces", action);
    switch (action.type) {
        case SET_MOVIE:
            return {
                ...state,
                Poster: action.movie.Poster,
                Title: action.movie.Title,
                Year: action.movie.Year
            }
        default:
            return state
    }
}

export default moviesReducer
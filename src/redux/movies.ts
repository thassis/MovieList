import { AnyAction } from 'redux'

//keys
export const SET_MOVIE = 'SET_MOVIE'

interface Rate {
    Source: string,
    Value: string
}
export interface MovieState {
    Poster: string,
    Title: string,
    Year: string,
    imdbID: string,
    Ratings: Array<Rate>,
    RateAvg: number,
    Actors: string,
    Genre: string,
    Country: string
}

export function setMovie(movie: MovieState) {
    return {
        type: SET_MOVIE,
        movie
    }
}

const initialState: MovieState = {
    Poster: "",
    Title: "",
    Year: "",
    imdbID: "",
    Ratings: [],
    RateAvg: 0,
    Actors: "",
    Genre: "",
    Country: ""
};


//Function to calculate the average rating
export function getRateAvg(ratings: Array<Rate>) {
    var rateAvg: number = 0;
    if (ratings.length > 0) {
        for (var rate of ratings) {
            if (rate.Value.includes("%"))
                rateAvg += parseFloat(rate.Value);
            else if (rate.Value.includes("/")) {
                //if the rate value has a '/', so is necessary to calculate the percentage
                let splitRate: Array<string> = rate.Value.split('/');
                rateAvg += (parseFloat(splitRate[0]) / parseFloat(splitRate[1])) * 100;
            }
        }
        return (rateAvg / ratings.length).toFixed(2) + "%";
    }
    return "0%"
}

function moviesReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case SET_MOVIE:
            return {
                ...state,
                Poster: action.movie.Poster,
                Title: action.movie.Title,
                Year: action.movie.Year,
                Ratings: action.movie.Ratings,
                RateAvg: getRateAvg(action.movie.Ratings),
                imdbID: action.movie.imdbID,
                Actors: action.movie.Actors,
                Genre: action.movie.Genre,
                Country: action.movie.Country
            }
        default:
            return state
    }
}

export default moviesReducer
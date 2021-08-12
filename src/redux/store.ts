import { createStore } from 'redux'
import movieReducer from './movies'

const store = createStore(movieReducer)

export default store;
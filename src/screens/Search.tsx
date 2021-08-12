import React from 'react';

import { Text, View, StyleSheet, TextInput, Alert, FlatList, TouchableOpacity } from 'react-native';
import { Searchbar, List } from 'react-native-paper';

import { useSelector, useDispatch } from 'react-redux';
import { setMovie, MovieState } from '../redux/movies';

import axios from 'axios';

type Props = {
    route: "",
    navigation: ""
}

const Search = ({ navigation }: Props) => {
    const selectMovie = (state: MovieState) => state
    const movie = useSelector(selectMovie);
    console.log("movie redux", movie)
    const dispatch = useDispatch();
    const setMovieState = (movie: MovieState) => dispatch(setMovie(movie));

    const [movieToSearch, onChangeMovie] = React.useState("");
    const [movies, setMovies] = React.useState<MovieState[]>([]);

    const getMovies = () => {
        console.log("get movies", movieToSearch);
        axios.get("http://www.omdbapi.com/?apikey=191be97a&type=movie&s=" + movieToSearch).then(response => {
            console.log("axios", response.data);
            var data = response.data;
            if (data.Response == "True")
                setMovies(data.Search);
            else
                Alert.alert("Não encontrou filmes");
        }).catch(error => {
            console.log("deu ruim", error);
        })
    }

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Pesquisar filmes"
                onChangeText={onChangeMovie}
                value={movieToSearch}
                onIconPress={getMovies}
                onEndEditing={getMovies}
            />
            <FlatList
                data={movies}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => setMovieState(item)}>
                        <View>
                            <Text>{item.Title}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => `${index}`}
            />
            <Text>texto padrao redux {movie.Title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 20
    },
})

export default Search;
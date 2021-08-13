import React, { useState } from 'react';

import { ActivityIndicator, Text, View, StyleSheet, Alert, FlatList, TouchableOpacity, TouchableWithoutFeedback, Image, TextInput, Picker, Keyboard } from 'react-native';
import { Searchbar, List, DefaultTheme } from 'react-native-paper';

import { useSelector, useDispatch } from 'react-redux';
import { setMovie, MovieState, getRateAvg } from '../redux/movies';

import axios from 'axios';
import { GET_MOVIES } from '../constants/apis';
import { omdbApiKey } from '../constants/config';
import colors from '../constants/colors';

import Icon from 'react-native-vector-icons/dist/FontAwesome';

import { NavigationScreenProp } from 'react-navigation';

type Props = {
    route: "",
    navigation: NavigationScreenProp<any, any>
}

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.secondaryFont,
        text: colors.primaryFont

    },
};


const Search = ({ navigation }: Props) => {
    const selectMovie = (state: MovieState) => state
    const movie = useSelector(selectMovie);
    const dispatch = useDispatch();
    const setMovieState = (movie: MovieState) => dispatch(setMovie(movie));

    const [movieToSearch, onChangeMovie] = useState("");
    const [yearToSearch, onChangeYear] = useState("");
    const [loading, setLoading] = useState(false);
    const [orderMoviesBy, onChangeOrder] = useState("Ordenar");

    const [movies, setMovies] = useState<MovieState[]>([]);

    const getMovies = async () => {
        setLoading(true);
        Keyboard.dismiss();
        var year: string | null = yearToSearch;
        axios.get(GET_MOVIES, { params: { apikey: omdbApiKey, type: "movie", s: movieToSearch, y: year } }).then(async response => {
            var data = response.data;
            var movies = data.Search;
            if (data.Response == "True") {
                if (movies.length > 10)
                    movies.length = 10;
                for (const [index, movie] of movies.entries()) {
                    let response = await axios.get(GET_MOVIES, { params: { apiKey: omdbApiKey, i: movie.imdbID } });
                    var dataMovie = response.data;
                    movies[index].Ratings = dataMovie.Ratings;
                    movies[index].RateAvg = getRateAvg(dataMovie.Ratings);
                    movies[index].Actors = dataMovie.Actors;
                    movies[index].Genre = dataMovie.Genre;
                    movies[index].Country = dataMovie.Country;
                }
                setLoading(false);
                setMovies(movies);
            } else {
                setLoading(false);
                onChangeYear("");
                setMovies([]);
                Alert.alert("Filme não encontrado", "Tente buscar com outra palavra chave ou Ano");
            }
        }).catch(error => {
            console.log("error", error);
        })
    }

    const sortMoviesByKey = (orderMoviesBy: string) => {
        onChangeOrder(orderMoviesBy);
        if (movies.length > 0) {
            if (orderMoviesBy == "al_asc")
                movies.sort(function (a, b) {
                    if (a.Title < b.Title) { return -1; }
                    if (a.Title > b.Title) { return 1; }
                    return 0;
                });
            else if (orderMoviesBy == "al_desc")
                movies.sort(function (a, b) {
                    if (a.Title < b.Title) { return 1; }
                    if (a.Title > b.Title) { return -1; }
                    return 0;
                });
            else if (orderMoviesBy == "rate_asc")
                movies.sort(function (a, b) {
                    if (a.RateAvg < b.RateAvg) { return -1; }
                    if (a.RateAvg > b.RateAvg) { return 1; }
                    return 0;
                });
            else if (orderMoviesBy == "rate_desc")
                movies.sort(function (a, b) {
                    if (a.RateAvg < b.RateAvg) { return 1; }
                    if (a.RateAvg > b.RateAvg) { return -1; }
                    return 0;
                });
        }
    }

    const renderMovies = () => {
        if (movies.length > 0)
            return
        else
            return <Image source={require('../assets/movie_image.png')} style={styles.posterSize} />
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Searchbar
                    placeholder="Pesquisar filmes"
                    onChangeText={onChangeMovie}
                    value={movieToSearch}
                    onIconPress={getMovies}
                    onEndEditing={getMovies}
                />

                <View style={styles.centerRow}>

                    <Picker

                        style={[{ flex: 2 }, styles.textAge]}
                        selectedValue={orderMoviesBy}
                        onValueChange={(itemValue, itemIndex) => sortMoviesByKey(itemValue)}
                    >
                        <Picker.Item label="Ordenar" value="orderby" />
                        <Picker.Item label="Alfabética Crescente" value="al_asc" />
                        <Picker.Item label="Alfabética Decrescente" value="al_desc" />
                        <Picker.Item label="Avaliação Crescente" value="rate_asc" />
                        <Picker.Item label="Avaliação Decrescente" value="rate_desc" />

                    </Picker>

                    <TextInput
                        keyboardType={"numeric"}
                        placeholder={"Ano"}
                        placeholderTextColor={colors.primaryFont}
                        style={[{ flex: 1 }, styles.textAge]}
                        value={yearToSearch}
                        onChangeText={yearToSearch => onChangeYear(yearToSearch)}
                        onEndEditing={getMovies}
                    />

                    <Icon name={"filter"} size={25} color={colors.secondaryFont} />

                </View>

                {loading ?

                    //show indicator just if is loading
                    <ActivityIndicator style={{ marginTop: 20 }} size="large" color={colors.secondaryFont} />

                    : //if is not loading
                    <View>

                        <FlatList
                            data={movies}
                            extraData={movies}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => { setMovieState(item); navigation.navigate("Details") }}>
                                    <View style={styles.card}>
                                        {item.Poster != "N/A" ?
                                            <Image resizeMode={"stretch"} source={{ uri: item.Poster }} style={styles.posterSize} />
                                            :
                                            <Image resizeMode={"contain"} source={require("../assets/no_movie_image.jpg")} style={styles.posterSize} />
                                        }
                                        <View style={{ flex: 1, justifyContent: "center" }}>
                                            <Text style={styles.movieTitle}>{item.Title}</Text>
                                            {item.Ratings && item.Ratings.length > 0 ?
                                                <FlatList
                                                    data={item.Ratings}
                                                    extraData={item.Ratings}
                                                    renderItem={({ item }) => (
                                                        <View style={styles.centerRow}>
                                                            <Text style={styles.rateTitle}>{item.Source}: </Text>
                                                            <Text style={styles.rateValue}>{item.Value} </Text>
                                                        </View>
                                                    )}
                                                    keyExtractor={(item, index) => `${item.Value}`}
                                                /> : null
                                            }
                                            <View style={styles.centerRow}>
                                                <Text style={styles.rateTitle}>{"Avaliação média: "}</Text>
                                                <Text style={styles.rateValue}>{item.RateAvg} </Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => `${item.imdbID}`}
                        />
                        {!movies.length ?
                            <View style={{ marginTop: 50, alignItems: "center" }}>
                                <Image resizeMode={"contain"} source={require('../assets/movie_image.png')} style={{ width: 250, height: 250 }} />
                                <Text style={styles.movieTitle}>Pesquise um filme acima!</Text>
                            </View>
                            : null}
                    </View>
                }
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    card: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: colors.cardPoster,
        marginVertical: 15,
        borderRadius: 20,
        alignItems: "center"
    },
    movieTitle: {
        color: colors.primaryFont,
        fontSize: 14,
        flexWrap: 'wrap',
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 15
    },
    posterSize: {
        width: 100,
        height: 140,
        margin: 15
    },
    centerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    rateTitle: {
        flex: 2,
        fontSize: 12,
        color: colors.primaryFont,
        fontWeight: "bold",
        flexWrap: 'wrap',
    },
    rateValue: {
        flex: 1,
        fontSize: 12,
        color: colors.primaryFont,
        flexWrap: 'wrap',
    },
    defaultText: {
        color: colors.primaryFont
    },
    filterView: {
        paddingHorizontal: 15,
        flexDirection: "row"
    },
    textFilter: {
        color: colors.primaryFont,
        fontSize: 18
    },
    textAge: {
        color: colors.primaryFont,
        fontSize: 16
    }
})

export default Search;
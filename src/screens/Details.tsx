import React, { useState } from 'react';

import { ActivityIndicator, ScrollView, Text, View, StyleSheet, Alert, FlatList, TouchableOpacity, TouchableWithoutFeedback, Image, TextInput, Picker, Keyboard } from 'react-native';
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


const Details = ({ navigation }: Props) => {
    const selectMovie = (state: MovieState) => state
    const movie = useSelector(selectMovie);
    console.log("movie deeeedeeeedeeee", movie.Title);

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>{movie.Title}</Text>
                {movie.Poster != "N/A" ?
                    <Image resizeMode={"stretch"} source={{ uri: movie.Poster }} style={styles.posterSize} />
                    :
                    <Image resizeMode={"contain"} source={require("../assets/no_movie_image.jpg")} style={styles.posterSize} />
                }
                <View style={styles.row}>
                    <Text style={styles.attributeTitle}>Atores: </Text>
                    <Text style={styles.attributeValue}>{movie.Actors}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.attributeTitle}>Gênero: </Text>
                    <Text style={styles.attributeValue}>{movie.Genre}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.attributeTitle}>Country: </Text>
                    <Text style={styles.attributeValue}>{movie.Country}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.attributeTitle}>Avaliação Média: </Text>
                    <Text style={styles.attributeValue}>{movie.RateAvg}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.attributeTitle}>Ano: </Text>
                    <Text style={styles.attributeValue}>{movie.Year}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.attributeTitle}>ID do IMDB: </Text>
                    <Text style={styles.attributeValue}>{movie.imdbID}</Text>
                </View>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 15
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        color: colors.secondaryFont
    },
    posterSize: {
        width: 200,
        height: 280,
        margin: 15
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    attributeTitle: {
        textAlign: "center",
        color: colors.primaryFont,
        fontWeight: "bold",
        fontSize: 18,
    },
    attributeValue: {
        flex: 1,
        color: colors.primaryFont,
        fontSize: 18,
    },
});
export default Details;
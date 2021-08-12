import React from 'react';
import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	useColorScheme,
	View,
} from 'react-native';

import {
	Colors,
	Header,
} from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Search from './src/screens/Search';
import Details from './src/screens/Details';

import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';

import store from './src/redux/store';

const Stack = createNativeStackNavigator();

const App = () => {
	const isDarkMode = useColorScheme() === 'dark';

	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};

	return (
		<Provider store={store}>
			<PaperProvider>
				<NavigationContainer>
					<Stack.Navigator initialRouteName="Search">
						<Stack.Screen name="Search" component={Search} />
						<Stack.Screen name="Details" component={Details} />
					</Stack.Navigator>
				</NavigationContainer>
			</PaperProvider>
		</Provider>
	);
};

const styles = StyleSheet.create({
	sectionContainer: {
		marginTop: 32,
		paddingHorizontal: 24,
	},
	sectionTitle: {
		fontSize: 24,
		fontWeight: '600',
	},
	sectionDescription: {
		marginTop: 8,
		fontSize: 18,
		fontWeight: '400',
	},
	highlight: {
		fontWeight: '700',
	},
});

export default App;

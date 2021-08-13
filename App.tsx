import React from 'react';
import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	useColorScheme,
	View,
	Image
} from 'react-native';

import {
	Colors,
	Header,
} from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Search from './src/screens/Search';
import Details from './src/screens/Details';

import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';

import store from './src/redux/store';

import colors from './src/constants/colors';

const Stack = createNativeStackNavigator();

const headerStyle = { backgroundColor: colors.header };

const LogoTitle: React.FC = () => {
	return (
		<View style={styles.center}>
			<Image
				style={{ width: 50, height: 50 }}
				source={require('./src/assets/logo.png')}
			/>
			<Text style={styles.textTitle}>Lista de Filmes</Text>
		</View>
	);
}

const MyTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: colors.background,
	},
};


const App = () => {
	return (
		<Provider store={store}>
			<PaperProvider>
				<StatusBar
					animated={true}
					backgroundColor={colors.statusBar}
					barStyle={'default'}
					showHideTransition={'fade'}
					hidden={false} />
				<NavigationContainer theme={MyTheme}>
					<Stack.Navigator initialRouteName="Search">
						<Stack.Screen options={{ headerTitle: props => <LogoTitle {...props} />, headerStyle, headerTintColor: colors.headerTitle }} name="Search" component={Search} />
						<Stack.Screen options={{ title: 'Detalhes do Filme', headerStyle, headerTintColor: colors.headerTitle }} name="Details" component={Details} />
					</Stack.Navigator>
				</NavigationContainer>
			</PaperProvider>
		</Provider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#ECF0F1'
	},
	center: {
		flex: 1,
		alignItems: "center",
		flexDirection: "row",
	},
	textTitle: {
		color: colors.headerTitle,
		fontSize: 20,
		marginLeft: 30,
	}
});

export default App;

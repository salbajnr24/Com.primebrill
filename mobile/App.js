import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

// Import screens
import HomeScreen from './screens/HomeScreen';
import ProductsScreen from './screens/ProductsScreen';
import CartScreen from './screens/CartScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#0F172A" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0F172A',
            },
            headerTintColor: '#F8FAFC',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Brill Prime' }}
          />
          <Stack.Screen 
            name="Products" 
            component={ProductsScreen}
            options={{ title: 'Products' }}
          />
          <Stack.Screen 
            name="Cart" 
            component={CartScreen}
            options={{ title: 'Shopping Cart' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
});

import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./src/components/Home";
import FavoriteScreen from "./src/components/Like";
import DetailScreen from "./src/components/Detail";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Tab">
          <Stack.Screen
            name="Tab"
            options={{ headerShown: false }}
            component={MyBottomNavigationBar}
          />
          <Stack.Screen
            name="Detail"
            options={{ headerShown: false }}
            component={DetailScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7eceb",
  },
});

function MyBottomNavigationBar() {
  const [selectedTab, setSelectedTab] = useState("Home");

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Favorite") {
            iconName = focused ? "heart" : "heart-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={selectedTab === route.name ? "green" : color}
            />
          );
        },
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "black",
        tabBarStyle: {
          display: "flex",
        },
      })}
      keyboardShouldPersistTaps="handled"
      onTabPress={({ route }) => setSelectedTab(route.name)}
    >
      <Tab.Screen
        name="Home"
        options={{ headerShown: false }}
        component={HomeScreen}
      />

      <Tab.Screen
        name="Favorite"
        options={{ headerShown: false }}
        component={FavoriteScreen}
      />
    </Tab.Navigator>
  );
}

export default App;

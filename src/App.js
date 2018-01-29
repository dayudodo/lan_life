/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { StackNavigator, TabNavigator } from "react-navigation";
import CoursesScreen from "./CoursesScreen";
import SecondLevel from "./SecondLevel";
import Settings from './Settings'

import { Platform, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const BookMenu = StackNavigator({
  CoursesScreen: {
    screen: CoursesScreen,
    navigationOptions: {
      headerTitle: "选择课程"
    }
  },
  SecondLevel: { screen: SecondLevel }
});
export const App = TabNavigator(
  {
    '选书': {
      screen: BookMenu,
      navigationOptions: {
        tabBarIcon: <Icon name="book" size={28} color="#4F8EF7" />
      }
    },
    '设置': {
      screen: Settings,
      navigationOptions: {
        tabBarIcon: <Icon name="gear" size={28} color="#4F8EF7" />
      }
    }
  },
  {
    tabBarPosition: "bottom",
    tabBarOptions: {
      activeTintColor: "#ff0000",
      inactiveTintColor: "#dddddd",
      showIcon: true,
      labelStyle: { fontSize: 12, color: "black" },
      style: { backgroundColor: "#eedddd" }
    }
  }
);

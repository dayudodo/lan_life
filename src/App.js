/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { StackNavigator, TabNavigator } from "react-navigation";
import CoursesScreen from "./CoursesScreen";
import SecondLevel from "./SecondLevel";

import { Platform, StyleSheet, Text, View } from "react-native";

export const App = StackNavigator({
  CoursesScreen: {
    screen: CoursesScreen,
    navigationOptions: {
      headerTitle: "选择课程"
    },
  },
  SecondLevel: { screen: SecondLevel }
});

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { StackNavigator, TabNavigator } from "react-navigation";
import HomeScreen from "./HomeScreen";
import SecondLevel from "./SecondLevel";

import { Platform, StyleSheet, Text, View } from "react-native";

export const App = StackNavigator({
  HomeScreen: { screen: HomeScreen },
  SecondLevel: { screen: SecondLevel }
});
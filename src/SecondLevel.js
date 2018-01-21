import React, { Component } from "react";
import {
  Button,
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image
} from "react-native";
import Video from "react-native-video";
import Sound from "react-native-sound";
import { StackNavigator, TabNavigator } from "react-navigation";

export default class SecondLevel extends React.Component {
  static navigationOptions = { title: "选择课程" };
  constructor(props) {
    super(props);
    this.state = { current_media_name: null }; 
  }
  render(){

  }
}

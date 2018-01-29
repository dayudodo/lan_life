import React, { Component } from "react";
import {
  Button,
  View,
  FlatList,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image
} from "react-native";

import { Divider } from "react-native-elements";

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  render(){
      return <View style={styles.container}>
          <TextInput />
          <Divider style={styles.dividerStyle} />
        </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  dividerStyle: {
    backgroundColor: "gray"
  },
});

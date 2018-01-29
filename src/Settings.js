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
  Image,
  Slider
} from "react-native";
import { observable, action } from "mobx";
import { observer } from "mobx-react";

import { Divider } from "react-native-elements";

@observer
export default class Settings extends React.Component {
  @observable currentRepeatTime = 1;
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput />
        <Divider style={styles.dividerStyle} />
        <Slider
          minimumValue={1}
          maximumValue={10}
          value={1}
          onValueChange={value => {
            // this.setState({ fontSizeValue: value });
            this.currentRepeatTime = value;
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  dividerStyle: {
    backgroundColor: "gray"
  }
});

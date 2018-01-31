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
import { Divider } from "react-native-elements";

import { observable, action } from "mobx";
import { observer } from "mobx-react";
import SettingsStore from "./SettingsStoreObservable";

global.SettingsStore = SettingsStore;

@observer
export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static defaultProps = {
    SettingsStore: SettingsStore
  };
  render() {
    return (
      <View style={styles.container}>
        <TextInput />
        <Divider style={styles.dividerStyle} />
        <Text>重复次数：</Text>
        <Slider
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={this.props.SettingsStore.g_repeat_time}
          onValueChange={value => {
            // this.setState({ fontSizeValue: value });
            this.props.SettingsStore.g_repeat_time = value;
          }}
        />
        <Text>{this.props.SettingsStore.g_repeat_time}</Text>
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

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
  Image,
  ListView
} from "react-native";
import { List, ListItem } from "react-native-elements";
import Video from "react-native-video";
// import SecondLevel from "./SecondLevel"

var courses_max = 19;
var g_course_names = [];
var g_current_media;
for (let index = 0; index < courses_max; index++) {
  var double_name;
  if (index < 9) {
    double_name = `0${index + 1}`;
  } else {
    double_name = `${index + 1}`;
  }
  g_course_names.push({
    key: `secret_garden_${double_name}`,
    index: index
  });
}

export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { paused: true, currentTime: 0.0, current_media_name: null }; //因为上一次的图片没有变化，所以有时候图片的onLoad并不会执行！
  }
  playmp3() {
    var first = new Sound("secret_garden_01.mp3", Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("failed to load the sound", error);
        return;
      }
      // loaded successfully
      console.log(
        "duration in seconds: " +
          first.getDuration() +
          "number of channels: " +
          first.getNumberOfChannels()
      );
    });
    first.play(success => {
      if (success) {
        console.log("successfully finished playing");
      } else {
        console.log("playback failed due to audio decoding errors");
        // reset the player to its uninitialized state (android only)
        // this is the only option to recover after an error occured and use the player again
        // first.reset();
      }
    });
  }
  _renderItem = ({ item }) => {
    const { navigate } = this.props.navigation;
    // console.dir(oneItem);
    let media_name = item.key;
    return (
      <View style={styles.listBack}>
        <ListItem
          style={styles.item}
          title={media_name}
          onPress={() => {
            navigate("SecondLevel", {
              title: media_name,
              index: item.index
            });
          }}
        />
      </View>
    );
  };

  componentWillUnmount() {
    if (g_current_media) {
      g_current_media.release();
    }
  }
  render() {
    const { navigate } = this.props.navigation;
    const soundUrl = "";
    return (
      <View style={styles.container}>
        <FlatList data={g_course_names} renderItem={this._renderItem} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
    // justifyContent: 'center',
    // alignItems: "center"
  },
  coursesList: {
    marginBottom: 20
  },
  item: {
    fontSize: 18,
    height: 44
  },
  mediaName: {
    alignSelf: "center"
  }
});

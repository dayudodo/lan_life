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

var courses_max = 19;
var course_names = [];
var current_media;
Sound.setCategory("Playback");
for (let index = 1; index <= courses_max; index++) {
  var double_name;
  if (index < 10) {
    double_name = `0${index}`;
  } else {
    double_name = `${index}`;
  }
  course_names.push({ key: `secret_garden_${double_name}.mp3` });
}

export default class HomeScreen extends React.Component {
  static navigationOptions = { title: "选择课程" };
  constructor(props) {
    super(props);
    this.state = {
      paused: true,
      currentTime: 0.0,
      current_media_name: null,

    }; //因为上一次的图片没有变化，所以有时候图片的onLoad并不会执行！
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
  _renderItem = oneItem => {
    console.dir(oneItem);
    let media_name = oneItem.item.key;
    return (
      <View style={styles.listBack}>
        <Button
          style={styles.item}
          title={media_name}
          onPress={() => {
            console.log(media_name);
            if (current_media) {
              current_media.release();
            }
            this.setState({current_media_name: media_name})
            current_media = new Sound(media_name, Sound.MAIN_BUNDLE, error => {
              if (error) {
                console.log("failed to load the sound", error);
                return;
              }
              // loaded successfully
              console.log(
                "duration in seconds: " +
                  current_media.getDuration() +
                  "number of channels: " +
                  current_media.getNumberOfChannels()
              );
              current_media.play(success => {
                if (success) {
                  console.log("successfully finished playing");
                } else {
                  console.log("playback failed due to audio decoding errors");
                  // reset the player to its uninitialized state (android only)
                  // this is the only option to recover after an error occured and use the player again
                  current_media.reset();
                }
              });
            });
          }}
        />
      </View>
    );
  };
  render() {
    const { navigate } = this.props.navigation;
    const soundUrl = "";
    return (
      <View style={styles.container}>
        <Button title="play" onPress={this.playmp3} />
        <Text style={styles.mediaName}>{this.state.current_media_name}</Text>
        <FlatList data={course_names} renderItem={this._renderItem} />
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
    // alignItems: "center"
  },
  listBack: {
    backgroundColor: "yellow"
  },
  item: {
    fontSize: 18,
    height: 44,
    color: "green"
  },
  mediaName:{
    alignSelf: 'center',
  },
});

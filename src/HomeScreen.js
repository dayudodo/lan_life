import React, { Component } from "react";
import { Button, View } from "react-native";
import Video from "react-native-video";
import Sound from 'react-native-sound';

Sound.setCategory("Playback");
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

export default class HomeScreen extends React.Component {
  static navigationOptions = { title: "Welcome" };
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      paused: true,
      currentTime: 0.0
    }; //因为上一次的图片没有变化，所以有时候图片的onLoad并不会执行！
  }
  video: Video;
  onLoad = () => {
    // this.setState({duration: data.duration});
    this.setState({
      paused: false,
      playDisable: false
    });
  };

  onProgress = data => {
    this.setState({
      currentTime: data.currentTime
    });
  };

  onEnd = () => {
    //播放结束后停止并且重置声音文件，以便重头播放
    this.setState({ paused: true });
    this.video.seek(0);
  };
  play = () => {
    //实现Video中音频的播放
    this.setState({ paused: false });
  };
  render() {
    const { navigate } = this.props.navigation;
    const soundUrl = ''
    return (
      <View>
        <Button
          title="Go to Jane's profile"
          onPress={() => navigate("Profile", { name: "Jane" })}
        />
      </View>
    );
  }
}

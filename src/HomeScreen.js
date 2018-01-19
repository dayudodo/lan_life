import React, { Component } from "react";
import { Button } from "react-native";
import Video from "react-native-video";

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
        <Video
          source={{ uri: soundUrl }}
          ref={(ref: Video) => {
            this.video = ref;
          }}
          rate={1.0}
          volume={
            1.0 // 0 is paused, 1 is normal.
          }
          muted={
            false // 0 is muted, 1 is normal.
          }
          paused={
            this.state.paused // Mutes the audio entirely.
          }
          onEnd={this.onEnd}
          onLoad={this.onLoad}
        />
      </View>
    );
  }
}

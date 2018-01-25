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
import { Divider } from "react-native-elements";
import Video from "react-native-video";
import Sound from "react-native-sound";
// Sound.setCategory("Playback");
// import { content } from "../media/secret_garden/01";
import srtObjects from "../media/secret_garden/srts";
import mp3Requires from "../media/secret_garden/mp3Requires";

// var RNFS = require("react-native-fs");
// console.log(content);
let G_repeat_times;
let g_media_name, currentSrtArray, current_mp3;
var start = 0;
var end = 1000000;
const freeze_at_end = true; //播放完成后，画面停在end
var srt = require("./srt").fromString;

export default class SecondLevel extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params;
    return {
      title: params.title,
      tabBarVisible: params && params.tabBarVisible
    };
  };
  constructor(props) {
    super(props);
    const { params } = props.navigation.state;
    let content = srtObjects[params.index];
    g_media_name = params.title;
    // console.log(params.index, content);

    let data = srt(content);
    for (let index in data) {
      // data[index]["english"]= data[index].text.split('\n')[0]
      // data[index]["chinese"]= data[index].text.split('\n')[1]
      [data[index]["english"], data[index]["chinese"]] = data[index].text.split(
        "\n"
      );
    }

    currentSrtArray = new Array(); //需要生成个新的字幕数组，不然就总是会把以前的给加上。
    for (let index in data) {
      currentSrtArray = currentSrtArray.concat(data[index]);
    }
    console.log("g_media_name", g_media_name);
    current_mp3 = mp3Requires[g_media_name];
    // current_mp3 = require("../media/secret_garden/01.mp3");
    console.log("current_mp3:", current_mp3);

    this.state = {
      current_media_name: null,
      clicked_index: null,
      currentTime: null,
      paused: false
    };
  }
  _onLoad = data => {
    console.log("duration:", data.duration);
  };
  // onEnd = () => {
  //   this.setState({ paused: true });
  //   this.video.seek(0);
  // };
  _onProgress = data => {
    this.setState({ currentTime: data.currentTime }, () => {
      if (data.currentTime >= end) {
        console.log('endTime: ', data.currentTime);
        this.setState({ paused: true });
      }
    });
  };
  _onError = error => {
    console.log(error);
  };

  _oneLinePress = item => {
    // console.log(item);

    [start, end] = [item.startTime / 1000, item.endTime / 1000];
    console.log("start,end: ", start, end);

    //item.number是从1开始的！
    // console.log(this.video);
    this.setState({ clicked_index: item.number, paused: false });
    this.video.seek(start);
    
    
  };

  componentWillUnmount() {
    //组件退出的时候释放资源，包括定时器
    // console.log("componentWillUnmount");

    this.timer && clearInterval(this.timer);
    this.timer = null;
    this.player = null;
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>
          {this.state.currentTime ? this.state.currentTime : "当前播放时间"}
        </Text>
        <FlatList
          data={currentSrtArray}
          renderItem={({ item }) => {
            // console.log(item);
            return (
              <View style={styles.lineView}>
                <Text
                  style={
                    item.number == this.state.clicked_index
                      ? [styles.item, styles.yellowBack]
                      : styles.item
                  }
                  onPress={this._oneLinePress.bind(this, item)}
                >
                  {item.english}
                </Text>
                <Divider style={{ backgroundColor: "blue" }} />
              </View>
            );
          }}
          keyExtractor={(item, index) => index}
        />
        <Video // source={{ uri: soundUrl }}
          source={current_mp3}
          ref={ref => {
            this.video = ref;
          }}
          rate={1.0}
          volume={1.0}
          controls={false}
          paused={this.state.paused}
          onLoad={this._onLoad}
          onProgress={this._onProgress}
          onError={this._onError}
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
  item: {
    fontSize: 18,
    minHeight: 44
  },
  lineView: {
    margin: 5
  },
  yellowBack: {
    backgroundColor: "yellow"
  }
});

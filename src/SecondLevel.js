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
// import ReactNativeComponentTree from "react-native/Libraries/Renderer/src/renderers/native/ReactNativeComponentTree";
import ReactNativeComponentTree from "react-native/Libraries/Renderer/shims/ReactNativeComponentTree";
import { Divider } from "react-native-elements";
import Video from "react-native-video";
import Sound from "react-native-sound";
// Sound.setCategory("Playback");
// import { content } from "../media/secret_garden/01";
import srtObjects from "../media/secret_garden/srts";
import m4aRequires from "../media/secret_garden/m4aRequires";

// var RNFS = require("react-native-fs");
// console.log(content);
let G_repeat_times = 2;
let g_media_name, currentSrtArray, current_mp3;
var mediaStartTime = 0;
var mediaEndTime = 1000000;
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
    current_mp3 = m4aRequires[g_media_name];
    // current_mp3 = require("../media/secret_garden/01.mp3");
    console.log("current_mp3:", current_mp3);

    this.state = {
      current_media_name: null,
      clicked_index: null,
      currentTime: null,
      paused: true
    };
  }
  _repeat_times = G_repeat_times;
  _clicked_array = [null, null];
  _onLoad = data => {
    console.log("duration:", data.duration);
  };
  // onEnd = () => {
  //   this.setState({ paused: true });
  //   this.video.seek(0);
  // };
  _onProgress = data => {
    if (data.currentTime >= mediaEndTime) {
      console.log("mediaEndTimeTime: ", data.currentTime);
      --this._repeat_times;
      if (this._repeat_times > 0) {
        this.video.seek(mediaStartTime); //回到开始播放的时间！
      } else {
        this.setState({ paused: true });
        this._repeat_times = G_repeat_times;
      }
    }
  };
  _onError = error => {
    console.log(error);
  };

  _oneLinePress(item, e) {
    // let text = ReactNativeComponentTree.getInstanceFromNode(e.target);
    // text.memoizedProps.style = styles.yellowBack
    // console.log(item, text);
    // return;
    [mediaStartTime, mediaEndTime] = [
      item.startTime / 1000,
      item.endTime / 1000
    ];
    console.log("mediaStartTime,mediaEndTime: ", mediaStartTime, mediaEndTime);

    //item.number是从1开始的！
    console.log("item.number", item.number);
    //有了video里面的onpress方法，就得把重复次数写成全局的。
    this._repeat_times = G_repeat_times;
    // console.log(`text${item.number}`, this.textRef);
    this._clicked_array.push(item.number);
    this._clicked_array.shift();
    if (this._clicked_array[0]) {
      this.textRef[this._clicked_array[0]].setNativeProps({
        style: styles.normalBack
      });
    }
    this.textRef[this._clicked_array[1]].setNativeProps({
      style: styles.clickedBack
    });
    this.setState({ paused: false }, () => {
      this.video.seek(mediaStartTime);
    });
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   return true
  // }
  componentDidMount() {
    this.props.navigation.setParams({
      tabBarVisible: false
    });
  }
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
          ref={"textList"}
          data={currentSrtArray}
          renderItem={({ item }) => (
            <View>
              <Text
                style={styles.item}
                selectable={true}
                ref={ref =>
                  (this.textRef = { ...this.textRef, [`${item.number}`]: ref })
                }
                onPress={e => this._oneLinePress(item, e)}
              >
                {item.number}: {item.english}
              </Text>
              <Divider style={{ backgroundColor: "blue" }} />
            </View>
          )}
          keyExtractor={(item, index) => index}
        />
        <Video
          source={
            current_mp3 // source={{ uri: soundUrl }}
          }
          ref={ref => {
            this.video = ref;
          }}
          rate={1.0}
          volume={1.0}
          controls={false}
          paused={this.state.paused}
          progressUpdateInterval={100.0}
          playInBackground={true}
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
  clickedBack: {
    backgroundColor: "yellow"
  },
  normalBack: {
    backgroundColor: "white"
  }
});

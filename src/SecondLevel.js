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
import { srtArr } from "../media/secret_garden/srts";

// var RNFS = require("react-native-fs");
// console.log(content);
var g_current_media;
// let G_timer;
let G_repeat_times;
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
    this.state = { current_media_name: null };
  }
  _oneLinePress(item) {
    const { params } = this.props.navigation.state;
    let media_name = params.title;
    console.log(item.startTime, item.endTime);

    let [start, end] = [item.startTime / 1000, item.endTime / 1000];
    let _repeatTimes;
    console.log(start, end);

    initRepeatTimes = () => {
      _repeatTimes = 2;
      if (G_repeat_times) {
        _repeatTimes = G_repeat_times;
      }
      //计时器，如果有这个计时器就取消掉，免得会有其它问题，另外，貌似在react里面需要使用clearTimeout, 而不是clearInterval?
      //只要点击就得清除，因为可能是点击其它句子了！
      this.timer && clearInterval(this.timer);
      this.timer = null;
    };
    initRepeatTimes();

    playTimes = () => {
      if (!g_current_media) {
        console.log("错误：g_current_media未初始化");
        return;
      }
      const playFrontStart = () => {
        g_current_media.setCurrentTime(start);
        //设置好时间后再去播放，不然异步的话始终会从头放，引起N多问题，这与html不同。
        g_current_media.play(success => {
          if (success) {
            console.log("successfully finished playing");
          } else {
            console.log("playback failed due to audio decoding errors");
            // reset the player to its uninitialized state (android only)
            // this is the only option to recover after an error occured and use the player again
            // if(g_current_media) { g_current_media.reset(); }
          }
        });
      };
      this.timer = setInterval(() => {
        g_current_media.getCurrentTime(_currentTime => {
          if (_currentTime >= end) {
            console.log(`end: currentTime: ${_currentTime}`);
            _repeatTimes -= 1;
            if (_repeatTimes === 0) {
              console.log("clearInterval");
              this.timer && clearInterval(this.timer);
              this.timer = null;
              g_current_media.pause();
            } else {
              console.log(`setCurrentTime: ${start}`);
              playFrontStart();
            }
          }
        });
      }, 10);
      playFrontStart();
    };
    if (!g_current_media) {
      g_current_media = new Sound(media_name, Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log(`failed to load the ${media_name}`, error);
          return;
        }
        playTimes();
      });
    } else {
      //如果已经有播放器了，不用新建，直接使用
      initRepeatTimes();
      playTimes();
    }
  }
  componentWillUnmount() {
    //组件退出的时候释放资源，包括定时器
    // console.log("componentWillUnmount");

    this.timer && clearInterval(this.timer);
    this.timer = null;
    g_current_media && g_current_media.release();
    //release并不代表g_current_media已经释放了，还得赋值才行，也许并不需要release?
    g_current_media = null;
  }
  render() {
    const { params } = this.props.navigation.state;
    let content = srtArr[params.index];
    // console.log(params.index, content);

    let data = srt(content);
    for (let index in data) {
      // data[index]["english"]= data[index].text.split('\n')[0]
      // data[index]["chinese"]= data[index].text.split('\n')[1]
      [data[index]["english"], data[index]["chinese"]] = data[index].text.split(
        "\n"
      );
    }

    let result = new Array(); //需要生成个新的字幕数组，不然就总是会把以前的给加上。
    for (let index in data) {
      result = result.concat(data[index]);
    }
    // console.log(result);
    return (
      <FlatList
        style={styles.container}
        data={result}
        renderItem={({ item }) => {
          // console.log(item);
          return (
            <View style={styles.lineView}>
              <Text
                style={styles.item}
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
    height: 44
  },
  lineView: {
    margin: 5
  }
});

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
  Modal,
  Slider,
  Switch
} from "react-native";
import { Divider } from "react-native-elements";
import Video from "react-native-video";
import Sound from "react-native-sound";
import Icon from "react-native-vector-icons/FontAwesome";
import ProgressBar from "react-native-progress/Bar";
// Sound.setCategory("Playback");
// import { content } from "../media/secret_garden/01";
import srtObjects from "../media/secret_garden/srts";
import m4aRequires from "../media/secret_garden/m4aRequires";

import { observable, action } from "mobx";
import { observer } from "mobx-react";

// var RNFS = require("react-native-fs");
// console.log(content);
// let g_repeat_time = global.SettingsStore && global.SettingsStore.g_repeat_time;
// let global_repeat_times = 1
const CHECK_INTERVAL = 100;
let g_media_name, currentSrtArray, current_mp3;
var g_mediaStartTime = 0;
var g_mediaEndTime = 1000000;
var g_playTime;
const freeze_at_end = true; //播放完成后，画面停在end
var srt = require("./srt").fromString;

@observer
export default class SecondLevel extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params;
    return {
      title: params.title,
      tabBarVisible: params && params.tabBarVisible,
      headerRight: (
        <Icon
          name="gear"
          size={28}
          color="#4F8EF7"
          style={styles.rigthIcon}
          onPress={() => {
            console.log("setting clicked.");

            params.toggleSetting();
          }}
        />
      )
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
      paused: true,
      SettingisVisible: false,
      g_repeat_time: 1,
      currentStyles: "黑底白字"
    };
  }

  _clicked_array = [null, null];
  @observable progress_value = 0;
  _onLoad = data => {
    console.log("duration:", data.duration);
  };
  // onEnd = () => {
  //   this.setState({ paused: true });
  //   this.video.seek(0);
  // };
  _onProgress = data => {
    this.progress_value =
      (data.currentTime - g_mediaStartTime) /
      (g_mediaEndTime - g_mediaStartTime);
    if (data.currentTime >= g_mediaEndTime) {
      console.log("mediaEndTimeTime: ", data.currentTime);
      --this._repeat_times;
      if (this._repeat_times > 0) {
        this.video.seek(g_mediaStartTime); //回到开始播放的时间！
      } else {
        this.setState({ paused: true });
        this._repeat_times = this.state.g_repeat_time;
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
    [g_mediaStartTime, g_mediaEndTime] = [
      item.startTime / 1000,
      item.endTime / 1000
    ];
    g_playTime = g_mediaEndTime - g_mediaStartTime;
    console.log(
      "mediaStartTime,mediaEndTime: ",
      g_mediaStartTime,
      g_mediaEndTime
    );

    //item.number是从1开始的！
    console.log("item.number", item.number);
    //有了video里面的onpress方法，就得把重复次数写成全局的。
    this._repeat_times = this.state.g_repeat_time;
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
      this.video.seek(g_mediaStartTime);
    });
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   return true
  // }
  _toggleSetting() {
    this.setState({ SettingisVisible: !this.state.SettingisVisible });
  }
  closeModal() {
    this.setState({ SettingisVisible: false });
  }
  componentDidMount() {
    this._repeat_times = this.state.g_repeat_time;
    this.props.navigation.setParams({
      tabBarVisible: false,
      toggleSetting: this._toggleSetting.bind(this)
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
        <Modal
          visible={this.state.SettingisVisible}
          animationType={"slide"}
          transparent={true}
          onRequestClose={() => this.closeModal()}
        >
          <View style={styles.modalContainer}>
            <View style={styles.innerContainer}>
              <Text>配色方案：{this.state.currentStyles}</Text>
              <Button
                onPress={() => {
                  //改变CSS的配置方案，只是个切换器而已！
                  if (styles == stylesOne) {
                    styles = stylesTwo;
                    this.setState({ currentStyles: "黑底白字" });
                  } else {
                    styles = stylesOne;
                    this.setState({ currentStyles: "白底黑字" });
                  }
                  this.forceUpdate();
                }}
                title="变色"
              />
              <Text> 重复次数：{this.state.g_repeat_time}</Text>
              <View style={styles.settingSlider}>
                <Slider
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={this.state.g_repeat_time}
                  onValueChange={value => {
                    // this.setState({ fontSizeValue: value });
                    this.setState({ g_repeat_time: value });
                  }}
                />
              </View>

              <Button
                onPress={() => {
                  this.closeModal();
                }}
                title="Close"
              />
            </View>
          </View>
        </Modal>

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
              <Divider style={styles.divider} />
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
          progressUpdateInterval={CHECK_INTERVAL}
          playInBackground={true}
          onLoad={this._onLoad}
          onProgress={this._onProgress}
          onError={this._onError}
        />
        <ProgressBar
          progress={this.progress_value}
          width={null}
          height={3}
          borderRadius={0}
          useNativeDriver={true}
        />
      </View>
    );
  }
}

let stylesOne = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  item: {
    fontSize: 18,
    minHeight: 50
  },
  divider: {
    backgroundColor: "blue"
  },
  lineView: {
    margin: 5
  },
  clickedBack: {
    backgroundColor: "yellow"
  },
  normalBack: {
    backgroundColor: "white"
  },
  rigthIcon: {
    marginRight: 16
  },
  modalContainer: {
    flex: 1,
    // justifyContent: "center",
    backgroundColor: "grey"
  },
  innerContainer: {
    // alignItems: "center"
  },
  settingSlider: {
    minHeight: 44,
    // alignItems: "stretch",
    justifyContent: "center"
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0
  }
});

let stylesTwo = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  item: {
    fontSize: 18,
    minHeight: 50,
    color: "white",
    backgroundColor: "black"
  },
  divider: {
    backgroundColor: "grey"
  },
  lineView: {
    margin: 5
  },
  clickedBack: {
    backgroundColor: "rgb(38,79,120)"
  },
  normalBack: {
    backgroundColor: "black"
  },
  rigthIcon: {
    marginRight: 16
  },
  modalContainer: {
    flex: 1,
    // justifyContent: "center",
    backgroundColor: "grey"
  },
  innerContainer: {
    // alignItems: "center"
  },
  settingSlider: {
    minHeight: 44,
    // alignItems: "stretch",
    justifyContent: "center"
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0
  }
});

let styles = stylesOne;

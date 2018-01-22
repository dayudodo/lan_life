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
// import { content } from "../media/secret_garden/01";
import { srtArr} from "../media/secret_garden/srts";
console.log("allsrts", srtArr);

// var RNFS = require("react-native-fs");
// console.log(content);
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
  _renderItem = item => {
    <Text>{item.english}</Text>;
  };
  render() {
    const { params } = this.props.navigation.state;
    let content = srtArr[params.index]
    console.log(params.index, content);
    
    // eval(`content = sg01.content`);
    // let content = sg01.content
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
          console.log(item);
          return (
            <View style={styles.lineView}>
              <Text
                style={styles.item}
                onPress={() => {
                  console.log(item.startTime, item.endTime);
                }}
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

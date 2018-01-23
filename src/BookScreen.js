import React, { Component } from "react";
import { Text, View, FlatList } from "react-native";
import { Card } from 'react-native-elements'

class BookScreen extends Component {
  state = {};
  render() {
    return (
      <View style={container}>
        <Text style={styles.bookText}></Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection: 'column',
    },
    bookText:{
        height:44,
    },
})

export default BookScreen;

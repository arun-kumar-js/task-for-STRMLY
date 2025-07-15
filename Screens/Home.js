import React, { useState, useRef } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useIsFocused } from '@react-navigation/native';
import { moderateScale, verticalScale, scale } from 'react-native-size-matters';

const { height } = Dimensions.get('window');

const videos = [
  require('../assets/demo1.mp4'),
  require('../assets/demo2.mp4'),
  require('../assets/demo3.mp4'),
  require('../assets/demo4.mp4'),
  require('../assets/demo5.mp4'),
  require('../assets/demo6.mp4'),
  require('../assets/demo7.mp4'),
  require('../assets/demo1.mp4'),
  require('../assets/demo2.mp4'),
  require('../assets/demo3.mp4'),
  require('../assets/demo4.mp4'),
  require('../assets/demo5.mp4'),
  require('../assets/demo6.mp4'),
  require('../assets/demo7.mp4'),
];

const Home = () => {
  const isFocused = useIsFocused();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState({});
  const [liked, setLiked] = useState({});
  const [muted, setMuted] = useState({});

  const onViewChange = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = { itemVisiblePercentThreshold: 80 };

  const handleLike = index => {
    setLiked(prev => ({ ...prev, [index]: !prev[index] }));
    setPaused(prev => ({ ...prev, [index]: true }));
  };

  const handleMute = index => {
    setMuted(prev => ({ ...prev, [index]: !prev[index] }));
    setPaused(prev => ({ ...prev, [index]: true }));
  };

  const handleResume = index => {
    setPaused(prev => ({ ...prev, [index]: false }));
  };

  const renderItem = ({ item, index }) => (
    <TouchableWithoutFeedback onPress={() => handleResume(index)}>
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: item }}
          style={styles.video}
          resizeMode="cover"
          repeat
          muted={!!muted[index]}
          paused={!isFocused || index !== currentIndex || !!paused[index]}
        />
        <TouchableOpacity
          style={styles.likeBtn}
          onPress={() => handleLike(index)}
        >
          <Icon
            name="heart"
            size={moderateScale(28)}
            color={liked[index] ? 'red' : 'white'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.muteBtn}
          onPress={() => handleMute(index)}
        >
          <Icon
            name={muted[index] ? 'volume-off' : 'volume-up'}
            size={moderateScale(28)}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <FlatList
      data={videos}
      renderItem={renderItem}
      keyExtractor={(_, i) => i.toString()}
      pagingEnabled
      horizontal={false}
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={onViewChange}
      viewabilityConfig={viewConfig}
      initialNumToRender={1}
      maxToRenderPerBatch={1}
      windowSize={1} 
    />
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    height,
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  likeBtn: {
    position: 'absolute',
    right: scale(20),
    top: height / 2 - verticalScale(40),
    backgroundColor: '#00000066',
    padding: moderateScale(10),
    borderRadius: moderateScale(30),
  },
  muteBtn: {
    position: 'absolute',
    right: scale(25),
    top: height / 2 - verticalScale(-15),
    backgroundColor: '#00000066',
    padding: moderateScale(10),
    borderRadius: moderateScale(30),
  },
});

export default Home;


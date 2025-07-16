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

// Local video assets
const videos = [
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
  const [pausedIndex, setPausedIndex] = useState(null); // just one paused index
  const [liked, setLiked] = useState({});
  const [muted, setMuted] = useState({});

  const viewConfig = { itemVisiblePercentThreshold: 80 };

  const onViewChange = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);
      setPausedIndex(null); // Resume when new video comes in view
    }
  }).current;

  const handleLike = index => {
    setLiked(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleMute = index => {
    setMuted(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handlePlayPause = index => {
    setPausedIndex(prev => (prev === index ? null : index));
  };

  const renderItem = ({ item, index }) => (
    <TouchableWithoutFeedback onPress={() => handlePlayPause(index)}>
      <View style={styles.videoContainer}>
        <Video
          source={item}
          style={styles.video}
          resizeMode="cover"
          repeat
          paused={!isFocused || index !== currentIndex || pausedIndex === index}
          muted={!!muted[index]}
        />

        <TouchableOpacity
          style={styles.iconButtonLike}
          onPress={() => handleLike(index)}
        >
          <Icon
            name="heart"
            size={moderateScale(28)}
            color={liked[index] ? 'red' : 'white'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButtonMute}
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
      snapToInterval={height}
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={onViewChange}
      viewabilityConfig={viewConfig}
      initialNumToRender={3}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews
    />
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    height: verticalScale(650),
    backgroundColor: 'black',
    marginBottom: verticalScale(28),
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  iconButtonLike: {
    position: 'absolute',
    right: scale(20),
    top: height / 2 - verticalScale(40),
    backgroundColor: '#00000066',
    padding: moderateScale(10),
    borderRadius: moderateScale(30),
  },
  iconButtonMute: {
    position: 'absolute',
    right: scale(25),
    top: height / 2 + verticalScale(20),
    backgroundColor: '#00000066',
    padding: moderateScale(10),
    borderRadius: moderateScale(30),
  },
});

export default Home;

import {View, ActivityIndicator, TouchableOpacity, Text} from 'react-native';
import {useState} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {PanGestureHandler, TapGestureHandler} from 'react-native-gesture-handler';

const ImageViewer = ({source}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentScale, setCurrentScale] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const containerWidth = 500;
  const containerHeight = 500;

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      if (scale.value <= 1) return;
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      if (scale.value <= 1) return;
      
      const maxX = (containerWidth * scale.value - containerWidth) / 2;
      const maxY = (containerHeight * scale.value - containerHeight) / 2;
      
      const newX = ctx.startX + event.translationX;
      const newY = ctx.startY + event.translationY;
      
      translateX.value = Math.max(-maxX, Math.min(maxX, newX));
      translateY.value = Math.max(-maxY, Math.min(maxY, newY));
    },
    onEnd: (event) => {
      if (scale.value <= 1) return;
      
      const maxX = (containerWidth * scale.value - containerWidth) / 2;
      const maxY = (containerHeight * scale.value - containerHeight) / 2;

      translateX.value = withSpring(
        Math.max(-maxX, Math.min(maxX, translateX.value)),
        {
          velocity: event.velocityX,
          damping: 20,
        }
      );
      translateY.value = withSpring(
        Math.max(-maxY, Math.min(maxY, translateY.value)),
        {
          velocity: event.velocityY,
          damping: 20,
        }
      );
    },
  });

  const handleZoomIn = () => {
    const newScale = Math.min(currentScale + 0.5, 3);
    setCurrentScale(newScale);
    scale.value = withSpring(newScale, {
      damping: 15,
      stiffness: 100,
    });
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    translateX.value = withSpring(0, {damping: 15});
    translateY.value = withSpring(0, {damping: 15});
    
    const newScale = Math.max(currentScale - 0.5, 1);
    setCurrentScale(newScale);
    scale.value = withSpring(newScale, {
      damping: 15,
      stiffness: 100,
    });
    if (newScale <= 1) {
      setIsZoomed(false);
    }
  };

  const handleDoubleTap = () => {
    if (isZoomed) {
      // If zoomed in, zoom out completely
      translateX.value = withSpring(0, {damping: 15});
      translateY.value = withSpring(0, {damping: 15});
      setCurrentScale(1);
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 100,
      });
      setIsZoomed(false);
    } else {
      // If zoomed out, zoom in to max
      setCurrentScale(3);
      scale.value = withSpring(3, {
        damping: 15,
        stiffness: 100,
      });
      setIsZoomed(true);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: scale.value},
        {translateX: translateX.value},
        {translateY: translateY.value}
      ],
      zIndex: 99999,
    };
  });

  if(imageError){
    return (
      <View style={{width: '100%', height: 500, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', position: 'relative', overflow: 'hidden'}}>
        <Icon name="image-not-supported" size={48} color="#666" />
        <Text style={{marginTop: 12, color: '#666', fontSize: 16}}>Unable to load image</Text>
      </View>
    )
  }

  return (
    <View style={{width: '100%', height: 500, backgroundColor: '#f5f5f5', position: 'relative', overflow: 'hidden'}}>
      <View style={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 100000,
        flexDirection: 'row',
        gap: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
      }}>
        <TouchableOpacity 
          onPress={handleZoomIn}
          style={{
            padding: 8,
            borderRadius: 20
          }}
        >
          <Icon 
            name="zoom-in"
            size={24} 
            color={currentScale >= 3 ? '#666' : '#fff'}
          />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleZoomOut}
          style={{
            padding: 8,
            borderRadius: 20
          }}
        >
          <Icon 
            name="zoom-out"
            size={24} 
            color={currentScale <= 1 ? '#666' : '#fff'}
          />
        </TouchableOpacity>
      </View>

      {imageLoading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{position: 'absolute', top: '50%', left: '50%'}}
        />
      )}
      
      <PanGestureHandler onGestureEvent={gestureHandler} enabled={isZoomed}>
        <Animated.View>
          <TapGestureHandler
            numberOfTaps={2}
            onActivated={handleDoubleTap}
          >
            <Animated.Image
              source={source}
              style={[{width: '100%', height: 500}, animatedStyle]}
              resizeMode="contain"
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
            />
          </TapGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default ImageViewer;

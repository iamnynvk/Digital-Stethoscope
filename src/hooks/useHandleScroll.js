import {useState, useRef, useCallback} from 'react';
import {LayoutAnimation} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';

const useHandleScroll = () => {
  const [showButton, setShowButton] = useState(true);

  // Ref variable that will keep track of the current scroll position
  const scrollOffset = useRef(0);

  const handleScroll = useCallback(
    event => {
      // Simple fade-in / fade-out animation
      const CustomLayoutLinear = {
        duration: 100,
        create: {
          type: LayoutAnimation.Types.linear,
          property: LayoutAnimation.Properties.opacity,
        },
        update: {
          type: LayoutAnimation.Types.linear,
          property: LayoutAnimation.Properties.opacity,
        },
        delete: {
          type: LayoutAnimation.Types.linear,
          property: LayoutAnimation.Properties.opacity,
        },
      };
      // Check if the user is scrolling up or down by confronting the new scroll position with your own one
      const currentOffset = event.nativeEvent.contentOffset.y;
      let direction =
        currentOffset > 0 && currentOffset > scrollOffset.current
          ? 'down'
          : 'up';

      // On iOS we have bounce effect
      const isBottomBounce =
        event.nativeEvent.layoutMeasurement.height -
          event.nativeEvent.contentSize.height +
          event.nativeEvent.contentOffset.y >=
        0;

      // if (direction === 'up' && isBottomBounce && isIphoneX()) {
      //   direction = 'down';
      // }

      // If the user is scrolling down (and the action-button is still visible) hide it
      const isActionButtonVisible = direction === 'up';
      if (isActionButtonVisible !== showButton) {
        LayoutAnimation.configureNext(CustomLayoutLinear);
        setShowButton(isActionButtonVisible);
      }
      // Update your scroll position
      scrollOffset.current = currentOffset;
    },
    [showButton],
  );

  return {handleScroll, showButton};
};

export default useHandleScroll;

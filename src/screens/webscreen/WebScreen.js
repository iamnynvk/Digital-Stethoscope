import React, {useState} from 'react';
import {View} from 'react-native';
import {styles} from './WebScreen.styles';
import {BackButton, Loading, Screen, Spacer} from '@/components';
import {WebView} from 'react-native-webview';
import {primaryBgColor} from '@/theme/colors';

const WebScreen = props => {
  const title = props.route.params.title;
  const uri = props.route.params.link;
  const [visible, setVisible] = useState(true);

  return (
    <Screen>
      <BackButton title={title} />
      <Spacer size={16} />
      <WebView onLoad={() => setVisible(false)} source={{uri}} />

      {visible && (
        <View style={styles.loaderContainer}>
          <Loading size="large" color={primaryBgColor} />
        </View>
      )}
    </Screen>
  );
};

export default WebScreen;

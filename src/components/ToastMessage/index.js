import React from 'react';
import styles from './styles';
import Toast, {BaseToast} from 'react-native-toast-message';

const toastConfig = {
  success: ({text1, props, ...rest}) => (
    <BaseToast
      {...rest}
      style={styles.toastStyle}
      contentContainerStyle={styles.container}
      text1Style={styles.textStyle}
      text1={text1}
      text2={props.uuid}
      trailingIconStyle={styles.iconStyle}
      text1NumberOfLines={3}
    />
  ),
};

export const ToastMessage = () => {
  return <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />;
};

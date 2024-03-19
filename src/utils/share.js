import {Share} from 'react-native';

export const share = message => {
  const shareOptions = {
    title: 'Share via HOPS Device app!',
    message,
  };
  Share.share(shareOptions)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      err && console.log(err);
    });
};

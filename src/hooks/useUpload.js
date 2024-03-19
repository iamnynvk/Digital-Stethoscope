import {useState, useCallback} from 'react';
import storage from '@react-native-firebase/storage';
import {getPercentage} from '@/utils/percentage';
import {
  createImageStorageRef,
  getFileLocalPath,
  updateProfileImage,
} from '@/utils/firebase';

export const useUpload = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [imageResponse, setImageResponse] = useState(null);

  const monitorUpload = useCallback(
    (userId, imgResponse, autoUpdate = false, callBack) => {
      setUploading(true);
      setSuccess(false);
      setProgress(0);
      setError(null);
      setDownloadURL(null);
      setImageResponse(imgResponse);

      const storageRef = createImageStorageRef(userId, imgResponse);
      const imagePath = getFileLocalPath(imgResponse);
      const uploadTask = storageRef.putFile(imagePath);

      uploadTask.on(storage.TaskEvent.STATE_CHANGED, snapshot => {
        console.log(
          `${snapshot.bytesTransferred} transferred out of ${snapshot.totalBytes}`,
        );
        setProgress(
          getPercentage(snapshot.bytesTransferred / snapshot.totalBytes),
        );
      });

      uploadTask
        .then(snapshot => {
          return storageRef.getDownloadURL();
        })
        .then(downloadedURL => {
          if (autoUpdate) {
            return updateProfileImage(userId, downloadedURL);
          } else {
            return downloadedURL;
          }
        })
        .then(url => {
          setSuccess(true);
          setUploading(false);
          setProgress(0);
          setDownloadURL(url);
          callBack && callBack(url);
        })
        .catch(error => {
          setUploading(false);
          setSuccess(false);
          setProgress(0);
          setDownloadURL(null);
          setError(error);
        });
    },
    [],
  );

  const state = {
    progress,
    uploading,
    downloadURL,
    imageResponse,
    success,
    error,
  };

  return [state, monitorUpload];
};

import {Alert, Linking} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {RESULTS} from 'react-native-permissions';
import {PERMISSION} from '@/constants';
import {checkPermissionAndRequest} from './permission';
import {isAndroid} from './platform';

const PICKER_TYPE = {
  // FOR CAMERA
  CAMERA: 'CAMERA',
  CAMERA_WITH_CROPPING: 'CAMERA_WITH_CROPPING',
  CAMERA_BINARY_DATA: 'CAMERA_BINARY_DATA',
  CAMERA_WITH_CROPPING_BINARY_DATA: 'CAMERA_WITH_CROPPING_BINARY_DATA',

  // FOR GALLERY
  GALLERY: 'GALLERY',
  GALLERY_WITH_CROPPING: 'GALLERY_WITH_CROPPING',
  GALLERY_BINARY_DATA: 'GALLERY_BINARY_DATA',
  GALLERY_WITH_CROPPING_BINARY_DATA: 'GALLERY_WITH_CROPPING_BINARY_DATA',

  // FOR MULTI PICK
  MULTI_PICK: 'MULTI_PICK',
  MULTI_PICK_BINARY_DATA: 'MULTI_PICK_BINARY_DATA',
};

const IMAGE_PICKER_OPTIONS = {
  includeExif: false, // Include image details in the response
  includeBase64: false, // (default false) | image as a base64-encoded string in the data property
  mediaType: 'photo', // default 'any' | ('photo', 'video', or 'any')
  useFrontCamera: false, // (default false) 'front' or 'selfie' camera when opened

  /* multiple selection  */
  multiple: false,
  waitAnimationEnd: false, // (ios only) default true
  forceJpg: true, // (ios only) default false

  /* Should be use without cropping, just resizing after selection  */
  compressImageMaxWidth: 720,
  compressImageMaxHeight: 720,
  compressImageQuality: 0.5, // default 1 (Android) | 0.8 (iOS))

  /* Should be used when cropping */
  // Metrics.screenWidth
  width: 720, // only work with cropping
  height: 720, // only work with cropping
  cropping: false,
  cropperCircleOverlay: false, // Enable or disable circular cropping mask.
  enableRotationGesture: false, // (android only) default false
  freeStyleCropEnabled: true, // (android only) default false | Enable custom rectangle area for cropping
};

/**
 *
 * Show Picker
 *
 * @param {*} callback callback handle response
 * @param {*} pickerTypeCamera
 * @param {*} cameraOptions
 * @param {*} pickerTypeGallery
 * @param {*} galleryOptions
 */

export const showImagePicker = (
  callback,
  pickerTypeGallery = PICKER_TYPE.GALLERY,
  pickerTypeCamera = PICKER_TYPE.CAMERA,
  galleryOptions = {},
  cameraOptions = {},
) => {
  showPickerOptions(
    callback,
    pickerTypeCamera,
    cameraOptions,
    pickerTypeGallery,
    galleryOptions,
  );
};

const showPickerOptions = (...args) => {
  if (isAndroid) {
    Alert.alert(
      'Image picker',
      'Choose image from',
      [
        {
          text: 'Camera',
          onPress: () => {
            requestCameraPermission(() => {
              pickCameraOptions(...args);
            });
          },
        },

        {
          text: 'Gallery',
          onPress: () => {
            requestGalleryPermission(() => {
              pickGalleryOptions(...args);
            });
          },
        },
      ],
      {
        cancelable: true,
      },
    );
  } else {
    Alert.alert('Select Image', null, [
      {
        text: 'Camera',
        onPress: () => {
          requestCameraPermission(() => {
            pickCameraOptions(...args);
          });
        },
      },

      {
        text: 'Gallery',
        onPress: () => {
          requestGalleryPermission(() => {
            pickGalleryOptions(...args);
          });
        },
      },
      {text: 'Cancel', onPress: () => console.log('Cancel')},
    ]);
  }
};

export const pickCameraOptionsWithPermission = (
  callback,
  pickerTypeGallery = PICKER_TYPE.GALLERY,
  pickerTypeCamera = PICKER_TYPE.CAMERA,
  galleryOptions = {},
  cameraOptions = {},
) => {
  requestCameraPermission(() => {
    pickCameraOptions(
      callback,
      pickerTypeCamera,
      cameraOptions,
      pickerTypeGallery,
      galleryOptions,
    );
  });
};

export const pickCameraOptions = (...args) => {
  let [
    callback,
    pickerTypeCamera,
    cameraOptions,
    pickerTypeGallery,
    galleryOptions,
  ] = args;
  //pickImageFromCameraWithCropping(callback, cameraOptions);

  switch (pickerTypeCamera) {
    case PICKER_TYPE.CAMERA:
    case PICKER_TYPE.CAMERA_BINARY_DATA:
      pickImageFromCamera(callback, cameraOptions);
      break;
    case PICKER_TYPE.CAMERA_WITH_CROPPING:
    case PICKER_TYPE.CAMERA_WITH_CROPPING_BINARY_DATA:
      pickImageFromCameraWithCropping(callback, cameraOptions);
      break;
  }
};

export const pickGalleryOptionsWithPermission = (
  callback,
  pickerTypeGallery = PICKER_TYPE.GALLERY,
  pickerTypeCamera = PICKER_TYPE.CAMERA,
  galleryOptions = {},
  cameraOptions = {},
) => {
  requestGalleryPermission(() => {
    pickGalleryOptions(
      callback,
      pickerTypeCamera,
      cameraOptions,
      pickerTypeGallery,
      galleryOptions,
    );
  });
};

export const pickGalleryOptions = (...args) => {
  let [
    callback,
    pickerTypeCamera,
    cameraOptions,
    pickerTypeGallery,
    galleryOptions,
  ] = args;

  switch (pickerTypeGallery) {
    case PICKER_TYPE.GALLERY:
    case PICKER_TYPE.GALLERY_BINARY_DATA:
      pickImageFromGallery(callback, galleryOptions);
      break;
    case PICKER_TYPE.GALLERY_WITH_CROPPING:
    case PICKER_TYPE.GALLERY_WITH_CROPPING_BINARY_DATA:
      pickImageFromGalleryWithCropping(callback, galleryOptions);
      break;
    case PICKER_TYPE.MULTI_PICK:
    case PICKER_TYPE.MULTI_PICK_BINARY_DATA:
      pickMultiple(callback, galleryOptions);
      break;
  }
};

/**
 * Pick image from camera
 *
 * @param {*} callback function which handle the response
 * @param {*} options  customize attributes
 *
 */
export const pickImageFromCamera = (callback, options = {}) => {
  options = {...IMAGE_PICKER_OPTIONS, ...options};

  // clean all images
  //cleanupImages();

  ImagePicker.openCamera({
    compressImageMaxWidth: options.compressImageMaxWidth,
    compressImageMaxHeight: options.compressImageMaxHeight,
    compressImageQuality: options.compressImageQuality,
    mediaType: options.mediaType,
    includeExif: options.includeExif,
    includeBase64: options.includeBase64,
  })
    .then(image => {
      let path = getImageUriFromData(options.includeBase64, image);
      const imageData = {...image, path};
      callback && callback(imageData);
    })
    .catch(e => handleError(e));
};

/**
 * Pick image from camera with cropping functionality
 *
 * @param {*} callback function which handle the response
 * @param {*} options  customize attributes
 *
 */
export const pickImageFromCameraWithCropping = (callback, options = {}) => {
  options = {...IMAGE_PICKER_OPTIONS, ...options};

  // clean all images
  //cleanupImages();

  ImagePicker.openCamera({
    width: options.width,
    height: options.height,
    cropping: true,
    cropperCircleOverlay: options.cropperCircleOverlay,
    enableRotationGesture: options.enableRotationGesture,
    mediaType: options.mediaType,
    includeExif: options.includeExif,
    includeBase64: options.includeBase64,
  })
    .then(image => {
      let path = getImageUriFromData(options.includeBase64, image);
      const imageData = {...image, path};
      callback && callback(imageData);
    })
    .catch(e => handleError(e));
};

/**
 * Pick image from gallery
 *
 * @param {*} callback function which handle the response
 * @param {*} options  customize attributes
 *
 */
export const pickImageFromGallery = (callback, options = {}) => {
  options = {...IMAGE_PICKER_OPTIONS, ...options};

  // clean all images
  //cleanupImages();

  ImagePicker.openPicker({
    compressImageMaxWidth: options.compressImageMaxWidth,
    compressImageMaxHeight: options.compressImageMaxHeight,
    compressImageQuality: options.compressImageQuality,
    mediaType: options.mediaType,
    includeExif: options.includeExif,
    includeBase64: options.includeBase64,
  })
    .then(image => {
      let path = getImageUriFromData(options.includeBase64, image);
      const imageData = {...image, path};
      callback && callback(imageData);
    })
    .catch(e => handleError(e));
};

/**
 * Pick image from gallery with cropping functionality
 *
 * @param {*} callback function which handle the response
 * @param {*} options  customize attributes
 *
 */
export const pickImageFromGalleryWithCropping = (callback, options = {}) => {
  options = {...IMAGE_PICKER_OPTIONS, ...options};

  // clean all images
  //cleanupImages();

  ImagePicker.openPicker({
    // width: options.width,
    // height: options.height,
    width: options.width,
    height: options.height,
    cropping: true,
    cropperCircleOverlay: options.cropperCircleOverlay,
    enableRotationGesture: options.enableRotationGesture,
    mediaType: options.mediaType,
    includeExif: options.includeExif,
    includeBase64: options.includeBase64,
  })
    .then(image => {
      let path = getImageUriFromData(options.includeBase64, image);
      const imageData = {...image, path};
      callback && callback(imageData);
    })
    .catch(e => handleError(e));
};

/**
 * Pick multiple images
 *
 * @param {*} callback function which handle the response
 * @param {*} options  customize attributes
 *
 */
export const pickMultiple = (callback, options = {}) => {
  options = {...IMAGE_PICKER_OPTIONS, ...options};

  // clean all images
  //cleanupImages();

  ImagePicker.openPicker({
    multiple: true,
    waitAnimationEnd: options.waitAnimationEnd,
    forceJpg: options.forceJpg,
    compressImageMaxWidth: options.compressImageMaxWidth,
    compressImageMaxHeight: options.compressImageMaxHeight,
    compressImageQuality: options.compressImageQuality,
    mediaType: options.mediaType,
    includeExif: options.includeExif,
    includeBase64: options.includeBase64,
    maxFiles: options.maxFiles || 10,
  })
    .then(images => {
      let imageData = images.map(img => {
        let uri = img.path || getImageUriFromData(options.includeBase64, img);
        return {...img, uri};
      });
      callback && callback(imageData);
    })
    .catch(e => handleError(e));
};

/**
 * Clean temp Images
 */
const cleanupImages = () => {
  ImagePicker.clean()
    .then(() => {
      //console.log("removed tmp images from tmp directory");
    })
    .catch(e => handleError(e));
};

/**
 *
 * Clean single temp image
 *
 * @param {*} image path to be clean
 */
const cleanupSingleImage = image => {
  //console.log('will cleanup image', image);

  ImagePicker.cleanSingle(image ? image.uri : null)
    .then(() => {
      //console.log(`removed tmp image ${image.uri} from tmp directory`);
    })
    .catch(e => handleError(e));
};

/**
 *
 * Get image path from response data
 *
 * @param {*} includeBase64
 * @param {*} image
 */
const getImageUriFromData = (includeBase64, image) => {
  //console.log("includeBase64", includeBase64);
  return includeBase64 ? `data:${image.mime};base64,` + image.data : image.path;
};

const handleError = error => {
  if (error.code && error.code === 'E_PICKER_CANCELLED') return;
  let errorMsg = error.message ? error.message : error;
  Alert.alert('Error', errorMsg);
};

const requestCameraPermission = (triggerFunc, openSettings = undefined) => {
  checkPermissionAndRequest(PERMISSION.CAMERA_PERMISSION, result => {
    switch (result) {
      case RESULTS.GRANTED:
        triggerFunc();
        break;
      case RESULTS.BLOCKED:
        openSettingModal();
        break;
    }
  });
};

const requestGalleryPermission = (triggerFunc, openSettings = undefined) => {
  checkPermissionAndRequest(PERMISSION.GALLERY_PERMISSION, result => {
    switch (result) {
      case RESULTS.GRANTED:
        triggerFunc();
        break;
      case RESULTS.LIMITED:
        triggerFunc();
        break;
      case RESULTS.BLOCKED:
        openSettingModal();
        break;
    }
  });
};

const openSettingModal = () => {
  Alert.alert(
    'Permission required',
    'Need permissions to access gallery and camera',
    [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Open Settings', onPress: () => Linking.openSettings()},
    ],
    {cancelable: false},
  );
};

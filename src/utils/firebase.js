import auth, {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {formateDate, formateTime} from './date';
import {isAndroid} from './platform';

const firebaseAuth = auth();
const db = firestore();
const dbStorage = storage();

/**
 * Collection list
 */
const USERS = 'users';
const VITALS = 'vitals';

/**
 * Storage bucket path list
 */
const PROFILE = 'profile';
const DEVICES = 'devices';
const STETHOSCOPE = 'stethoscope';

const DEVICE_NAME = 'hops_stethoscope';

/**
 * Send a verification code to the user's phone
 *
 * @param phoneNumber The phone number identifier supplied by the user.
 * @error auth/invalid-phone-number Thrown if the phone number has an invalid format.
 * @error auth/missing-phone-number Thrown if the phone number is missing.
 * @error auth/quota-exceeded Thrown if the SMS quota for the Firebase project has been exceeded.
 * @error auth/user-disabled Thrown if the user corresponding to the given phone number has been disabled.
 * @error auth/operation-not-allowed Thrown if you have not enabled the provider in the Firebase Console. Go to the Firebase Console for your project, in the Auth section and the Sign in Method tab and configure the provider.
 */
export const signInWithPhoneNumber = (phoneNumber, forceResend) => {
  return new Promise((resolve, reject) => {
    firebaseAuth
      .signInWithPhoneNumber(phoneNumber, forceResend)
      .then(confirmResult => {
        resolve(confirmResult);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};

/**
 * Verify the sign-in flow.
 *
 * @param confirmation A result from a signInWithPhoneNumber call.
 */
export const otpVerification = (confirmation, otp) => {
  return new Promise((resolve, reject) => {
    confirmation
      .confirm(otp)
      .then(result => {
        console.log(result);
        resolve(result);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};

/**
 * Updates the user's email address.
 *
 * @param email The users new email address.
 * @param credential Interface that represents the credentials returned by an auth provider. Implementations specify the details about each auth provider's credential requirements.
 * @error auth/invalid-email Thrown if the email used is invalid.
 * @error auth/email-already-in-use Thrown if the email is already used by another user.
 * @error auth/requires-recent-login Thrown if the user's last sign-in time does not meet the security threshold.
 */
export const updateUserEmail = (credential, email) => {
  return new Promise((resolve, reject) => {
    firebaseAuth.currentUser
      .reauthenticateWithCredential(credential)
      .then(() => {
        return firebaseAuth.currentUser.updateEmail(email);
      })
      .then(() => {
        resolve();
      })
      .catch(error => {
        console.log('Error updating user:', error);
        reject(error);
      });
  });
};

/**
 * Link the user with a email provider.
 *
 * @param email The users new email address.
 * @param phoneNumber The phone number identifier supplied by the user.
 */
export const linkAccountWithEmail = (email, phone) => {
  const credential = firebase.auth.EmailAuthProvider.credential(email, phone);
  // const credential = getProvider('email').credential(email, phone);
  return new Promise((resolve, reject) => {
    firebaseAuth.currentUser
      .linkWithCredential(credential)
      .then(usercred => {
        const user = usercred.user;
        console.log('Account linking success', user);
        resolve();
      })
      .catch(error => {
        console.log('Account linking error', error);
        if (error.code == 'auth/provider-already-linked') {
          resolve();
        } else {
          reject(error);
        }
      });
  });
};

/**
 * Sign the user out of their current authentication state.
 */
export const logoutUser = () => {
  return new Promise((resolve, reject) => {
    firebaseAuth
      .signOut()
      .then(() => {
        resolve();
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};

/**
 * Fetch user detail.
 *
 * @param uid A user identifier as specified by the authentication provider.
 */
export const getUserDetails = uid => {
  return new Promise((resolve, reject) => {
    db.collection(USERS)
      .doc(uid)
      .get()
      .then(snap => {
        const user = snap.data();
        if (user === undefined) {
          const {displayName, photoURL, email, phoneNumber} =
            firebaseAuth.currentUser;

          setUpNewUser(uid, {
            userId: uid,
            //name: displayName,
            phoneNumber,
            profileImg: photoURL,
            //email: email,
          });
        }
        resolve(user);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};

/**
 * Add a new user.
 *
 * @param refId A slash-separated path to a document.
 * @param user A map of the fields and values for the document.
 */
export const setUpNewUser = (refId, user) => {
  return new Promise((resolve, reject) => {
    db.collection(USERS)
      .doc(refId)
      .set(user)
      .then(() => resolve())
      .catch(err => reject(err));
  });
};

/**
 * Update user detail.
 *
 * @param userId A slash-separated path(documentPath) to a document.
 * @param user An object containing the fields and values with which to update the document.
 */
export const updateUserDetails = (userId, user) => {
  return new Promise((resolve, reject) => {
    db.collection(USERS)
      .doc(userId)
      .update(user)
      .then(() => resolve())
      .catch(err => reject(err));
  });
};

/**
 * Updating profile image in the users collection.
 *
 * @param userId A slash-separated path(documentPath) to a document.
 * @param profileImg Image bucket path.
 */
export const updateProfileImage = (userId, profileImg) => {
  return new Promise((resolve, reject) => {
    db.collection(USERS)
      .doc(userId)
      .update({
        profileImg,
      })
      .then(() => resolve(profileImg))
      .catch(err => reject(err));
  });
};

/**
 * Delete user detail.
 *
 * @param userId A slash-separated path(documentPath) to a document.
 */
export const removeUserDetails = userId => {
  return new Promise((resolve, reject) => {
    db.collection(USERS)
      .doc(userId)
      .delete()
      .then(() => resolve())
      .catch(err => reject(err));
  });
};

/**
 * Fetch all memeber list of authenticated user.
 *
 * @param fieldPath The path to compare.
 * @param filterOpStr The operation string.
 * @param groupId The comparison value.
 */
export const fetchMembersList = (
  groupId,
  fieldPath = 'group',
  filterOpStr = '==',
) => {
  return new Promise((resolve, reject) => {
    db.collection(USERS)
      .where(fieldPath, filterOpStr, groupId)
      .get()
      .then(querySnapshot => {
        const objectsArray = [];
        querySnapshot.forEach(documentSnapshot => {
          objectsArray.push(documentSnapshot.data());
        });
        resolve(objectsArray);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};

/**
 * Fetch vitals file list of given user id.
 *
 * @param fieldPath The path to compare.
 * @param filterOpStr The operation string.
 * @param userId The comparison value.
 */
export const fetchVitalsList = (
  userId,
  limit,
  fieldPath = 'addedBy',
  filterOpStr = '==',
  startAt,
  endAt,
) => {
  return new Promise((resolve, reject) => {
    getFiles(userId, fieldPath, filterOpStr, limit, startAt, endAt)
      .then(querySnapshot => {
        const result = [];
        let dayData = {title: '', data: []};

        querySnapshot.forEach(child => {
          const timestamp = child.data().recordedDate;
          console.log(timestamp);
          const date = formateDate(
            convertTimestampToDate(timestamp),
            'DD/MM/YYYY',
          );

          const data = child.data();
          data.isExpanded = false;

          if (dayData.title === date) {
            dayData.data.push(data);
          } else {
            dayData = {title: date, data: [data]};
            result.push(dayData);
          }
        });
        resolve(result);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};

/**
 * Creates and returns a new Query where the results are limited to the specified number of documents with the additional filter that documents must contain the specified field and
 * the value should satisfy the relation constraint provided.
 *
 * @param fieldPath The path to compare.
 * @param filterOpStr The operation string.
 * @param userId The comparison value.
 * @param fieldPath The field to sort by. Either a string or FieldPath instance.
 * @param directionStr Optional direction to sort by (`asc` or `desc`). If not specified, order will be ascending.
 * @param limit The maximum number of items to return.
 */
const getFiles = async (
  userId,
  fieldPath,
  filterOpStr,
  limit,
  startAt,
  endAt,
) => {
  let querySnapshot = db
    .collection(VITALS)
    .where(fieldPath, filterOpStr, userId)
    .where('deviceName', '==', DEVICE_NAME)
    .orderBy('recordedDate', 'DESC');

  if (limit) {
    querySnapshot = querySnapshot.limit(limit);
  }
  if (startAt) {
    querySnapshot = querySnapshot.where(
      'recordedDate',
      '>=',
      firebase.firestore.Timestamp.fromDate(
        new Date(formateTime(startAt, 'YYYY-MM-DDT00:00:00.000')),
      ),
    );
  }
  if (endAt) {
    querySnapshot = querySnapshot.where(
      'recordedDate',
      '<=',
      firebase.firestore.Timestamp.fromDate(
        new Date(formateTime(endAt, 'YYYY-MM-DDT23:59:00.000')),
      ),
    );
  }

  return querySnapshot.get();
};

/**
 * Delete vitals list document.
 *
 * @param userId A slash-separated path(documentPath) to a document.
 */
export const removeVitalsFile = (vitalId, userId, fileName, fileType) => {
  const path = `${fileStoragePath(userId)}/${fileName}.${fileType}`;
  console.log(path);
  return new Promise((resolve, reject) => {
    dbStorage
      .ref(path)
      .delete()
      .then(() => db.collection(VITALS).doc(vitalId).delete())
      .then(() => resolve())
      .catch(err => reject(err));
  });
};

/**
 * Create reference of the bucket for uploading user image to the bucket at the reference location.
 * Returns a reference to a image storage path.
 *
 * @param userId A slash-separated path(documentPath) to a document.
 * @param imgResponse An object containing image's fields and values with which to upload to the bucket.
 */
export const createImageStorageRef = (userId, imgResponse) => {
  const name =
    imgResponse.fileName ||
    imgResponse.name ||
    imgResponse.path ||
    imgResponse.uri;
  const extension = name.split('.').pop();
  const path = `${imageStoragePath(userId)}/${'user_pic'}.${extension}`;
  return dbStorage.ref(path);
};

/**
 * Returns a reference to a file storage path.
 */
const createStorageReference = (userId, filePath, fileName) => {
  const extension = filePath.split('.').pop();
  const path = `${fileStoragePath(userId)}/${fileName}.${extension}`;
  return dbStorage.ref(path);
};

/**
 * Upload vitals recorder file to the bucket at the reference location.
 *
 * @param userId A slash-separated path(documentPath) to a document.
 * @param fileSource A map of the fields and values for the document with which to upload to the bucket.
 */
export const uploadFile = (userId, fileSource) => {
  const fileId = getFileDocId();
  const fileName = 'audio_file_' + Date.now();
  const extension = fileSource?.file?.split('.').pop();
  let vitals = {
    addedBy: userId,
    deviceName: 'hops_stethoscope',
    vitalId: fileId,
    recordedDate: convertDateToTimestamp(new Date()),
    status: 'active',
  };
  const storageRef = createStorageReference(userId, fileSource.file, fileName);
  return new Promise((resolve, reject) => {
    storageRef
      .putFile(fileSource.file)
      .then(snapshot => storageRef.getDownloadURL())
      .then(downloadedURL => {
        fileSource.file = downloadedURL;
        fileSource.fileName = fileName;
        fileSource.fileType = extension;
        fileSource.uom = null;
        fileSource.value = null;
        vitals.deviceValue = [fileSource];
        return db.collection(VITALS).doc(fileId).set(vitals);
      })
      .then(result => {
        resolve(vitals);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};

/**
 * Returns a local storage file path.
 */
export const getFileLocalPath = response => {
  const {path, sourceURL} = response;
  console.log('getFileLocalPath', response);
  return isAndroid ? path : `file:///${path}`;
};

/**
 * Returns a unsubscribe function to stop listening for changes in the users auth state.
 *
 * @param listener A listener function which triggers when auth state changed.
 */
export const getAuthSubscriber = listener =>
  firebaseAuth.onAuthStateChanged(listener);

/**
 * Returns a user identifier as specified by the authentication provider.
 */
export const getAuthUserId = () => firebaseAuth.currentUser?.uid;

/**
 * Returns a new immutable GeoPoint object with the provided latitude and longitude values.
 *
 * @param latitude The latitude as number between -90 and 90.
 * @param longitude The longitude as number between -180 and 180.
 */
export const getGeoPoint = (latitude, longitude) =>
  new firebase.firestore.GeoPoint(latitude, longitude);

/**
 * Returns a new timestamp from the given JavaScript [Date]
 */
export const convertDateToTimestamp = date =>
  firebase.firestore.Timestamp.fromDate(date).toDate();

/**
 * Returns a Timestamp to a JavaScript Date object.
 */
export function convertTimestampToDate(timestamp) {
  return convertDate(timestamp);
}

export const convertDate = timestamp => {
  if (timestamp && typeof timestamp === 'object' && timestamp.seconds) {
    return new firebase.firestore.Timestamp(
      timestamp.seconds,
      timestamp.nanoseconds,
    ).toDate();
  } else if (timestamp && typeof timestamp === 'string') {
    console.log('String');
    return new Date(timestamp);
  }
  return timestamp;
};

/**
 * Returns document's identifier within its users collection.
 */
export const getImageDocId = () => db.collection(USERS).doc().id;

/**
 * Returns document's identifier within its vitals collection.
 */
export const getFileDocId = () => db.collection(VITALS).doc().id;

/**
 * Get the firebase database reference.
 *
 * @param path {!string|string}
 * @returns {!firebase.database.Reference|firebase.database.Reference}
 */
const getDatabaseReference = path => db.ref(path);

/**
 * Returns a string pointing to users-> userId -> profile location path on the storage bucket.
 *
 * @param userId A slash-separated documentPath to a document.
 */
const imageStoragePath = userId => `${USERS}/${userId}/${PROFILE}/`;

/**
 * Returns a string pointing to users-> userId -> devices -> stethoscope location path on the storage bucket.
 *
 * @param userId A slash-separated documentPath to a document.
 */
const fileStoragePath = userId =>
  `${USERS}/${userId}/${DEVICES}/${STETHOSCOPE}/`;

/**
 * Return an instance of a firebase auth provider based on the provider string.
 *
 * @param provider
 * @returns {firebase.auth.AuthProvider}
 */
const getProvider = provider => {
  switch (provider) {
    case 'email':
      return new firebase.auth.EmailAuthProvider();
    case 'facebook':
      return new firebase.auth.FacebookAuthProvider();
    case 'github':
      return new firebase.auth.GithubAuthProvider();
    case 'google':
      return new firebase.auth.GoogleAuthProvider();
    case 'twitter':
      return new firebase.auth.TwitterAuthProvider();
    default:
      throw new Error('Provider is not supported!!!');
  }
};

/**
 * Firebase authentication error handler.
 *
 * @param error An Object containing FirebaseAuthTypes.PhoneAuthError.
 * @param errorHandler A callback to be called if the authentication fails.
 */
export function handleAuthError(error, errorHandler) {
  switch (error.code) {
    case 'auth/account-exists-with-different-credential':
    case 'auth/email-already-in-use':
      errorHandler('There already exists an account with this email address.');
      break;
    case 'auth/invalid-email':
      errorHandler('Please enter a valid email address.');
      break;
    case 'auth/invalid-credential':
      errorHandler('Your credentials are invalid or expired.');
      break;
    case 'auth/user-disabled':
      errorHandler('Your account has been disabled.');
      break;
    case 'auth/operation-not-allowed':
      console.info(
        'The type of account corresponding to the credential is not enabled. Enable the account type in the Firebase Console, under the Auth tab.',
      );
      errorHandler(
        'These type of accounts are not enabled for this app by the developer. More info is available in the console output.',
      );
      break;
    case 'auth/user-disabled':
      errorHandler('This account has been disabled.');
      break;
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      errorHandler('No user found or wrong password.');
      break;
    case 'auth/invalid-verification-code':
      errorHandler(
        'Unable to sign you in, the verification code is invalid. Please try again.',
      );
      break;
    case 'auth/invalid-verification-id':
      errorHandler(
        'Unable to sign you in, the verification ID is invalid. Please try again.',
      );
      break;
    case 'auth/invalid-phone-number':
      errorHandler('Please enter a valid phone number.');
      break;
    case 'auth/requires-recent-login':
      errorHandler('Please re-login.');
      break;
    case 'auth/missing-phone-number':
      errorHandler('Please enter a phone number.');
      break;
    case 'auth/quota-exceeded':
      errorHandler('This app has exceeded its SMS quota.');
      break;
    case 'auth/network-request-failed':
      errorHandler('Please check your network connection and try again');
      break;
    default:
      errorHandler(error.message);
      console.log(error);
      break;
  }
}

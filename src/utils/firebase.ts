import {NavigationProp, ParamListBase} from '@react-navigation/native';
import PushNotification, {
  Importance,
  ReceivedNotification,
} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import supaAuthApiService from '../services/SupaAuthApiService';
import {saveFcmToken} from '../redux/reducer/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppState} from 'react-native';
import store from '../redux/store';
import {saveCount} from '../redux/reducer/dashboardSlice';

interface FirebaseNotificationI {
  data: {
    collapse_key: string;
    collection_id?: string;
    product_id?: string;
    from: string;
    title: string;
  };
  userInteraction: boolean;
  foreground: boolean;

  // !channelId and message are only recieved when notification is recieved in foreground state (when app is in active state).
  message?: string;
  channelId?: string;
}

function Notification(id: number, navigation: NavigationProp<ParamListBase>) {
  PushNotification.getApplicationIconBadgeNumber(badeIcon => {
    // console.log(
    //   '🚀 ~ file: firebase.ts ~ line 32 ~ Notification ~ badeIcon',
    //   badeIcon,
    // );

    store.dispatch(saveCount(badeIcon));
  });
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)

    onRegister: async function (token) {
      console.log(token);
      //   if (appNotification)
      // if (!fcmToken) {

      //! only login user will get notification please remember it.
      if (token && id) {
        // dispatch(saveFcmToken(token.token));
        if (token.os == 'ios') {
          var response: any = await supaAuthApiService.handleTokenForIos(
            token.token,
          );

          response = await response.json();
          const responseF = await response;
          console.log(
            '🚀 ~ file: firebase.ts ~ line 52 ~ responseF',
            responseF,
          );

          await supaAuthApiService.saveToken(
            id,
            responseF.results[0].registration_token,
          );
        } else {
          await supaAuthApiService.saveToken(id, token.token);
        }
        // NotificationListner();
        // await AsyncStorage.setItem('fcmToken', token.token);
        // console.log('firebase token', token);
      }
      // }
    },
    //   else {
    //   }
    // },

    // (required) Called when a remote is recexived or opened, or local notification is opened
    //@ts-ignore
    onNotification: (notification: any) => {
      console.log(
        '🚀 ~ file: firebase.ts ~ line 82 ~ Notification ~ notification',
        notification,
      );

      PushNotification.getApplicationIconBadgeNumber(count => {
        console.log(
          '🚀 ~ file: firebase.ts ~ line 78 ~ Notification ~ count',
          count,
          AppState,
        );
        if (count == 0) {
          PushNotification.setApplicationIconBadgeNumber(1);
          store.dispatch(saveCount(1));
        } else {
          if (
            (count > 0 && AppState.currentState == 'background') ||
            AppState.currentState == 'inactive'
          ) {
            var newCount = count + 1;
            PushNotification.setApplicationIconBadgeNumber(newCount);
            store.dispatch(saveCount(newCount));
          }
        }
      });
      if (notification?.data?.collection_id || notification?.data?.product_id) {
        handleNavigation(notification, navigation);
      }
      if (AppState.currentState == 'active') {
        PushNotification.localNotification({
          autoCancel: true, // (optional) default: true
          largeIcon: 'ic_launcher', // (optional) default: "ic_launcher". Use "" for no large icon.
          smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
          color: 'black', // (optional) default: system default
          vibrate: true, // (optional) default: true
          vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          ongoing: false, // (optional) set whether this is an "ongoing" notification
          priority: 'high', // (optional) set notification priority, default: high
          visibility: 'private', // (optional) set notification visibility, default: private
          ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
          onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
          when: null, // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
          messageId: 'google:message_id', // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module.
          actions: ['Yes', 'No'], // (Android only) See the doc for notification actions to know more
          invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
          /* iOS only properties */
          category: '', // (optional) default: empty string
          // subtitle: 'My Notification Subtitle' as string , // (optional) smaller title below notification title
          /* iOS and Android properties */
          id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
          title: notification.data.title, // (optional)
          message: notification.message,
          channelId: 'fcm_fallback_notification_channel', // (required)
          playSound: true,
          // (optional) default: true
          // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
        });
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      }
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    // onRegistrationError: function (err) {
    //   console.error(err.message, err);
    // },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true

    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */

    requestPermissions: true,
  });
}
// function NotificationListner() {
//   messaging().onNotificationOpenedApp(remoteMessage => {
//     console.log(
//       'Notification caused app to open from background state:',
//       remoteMessage.notification,
//     );
//   });

//   // Check whether an initial notification is available
//   messaging()
//     .getInitialNotification()
//     .then(remoteMessage => {
//       if (remoteMessage) {
//         console.log(
//           'Notification caused app to open from quit state:',
//           remoteMessage.notification,
//         );
//         console.log('remoteMessage', remoteMessage);

//         // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
//       }
//     });
// }
export default Notification;

export function handleNavigation(
  notification: Required<FirebaseNotificationI>,
  navigation: NavigationProp<ParamListBase>,
) {
  const {data} = notification;
  if (data?.collection_id) {
    navigation.navigate('Catalogue', {
      screen: 'CatalogueItemScreen',
      params: {
        catId: data?.collection_id,
        title: data.title,
        path: 'Notifications',
        callApi: true,
      },
    });
  } else {
    navigation.navigate('Catalogue', {
      screen: 'SelectedProduct',
      params: {pId: data.product_id},
      path: 'Notifications',
    });
  }
}

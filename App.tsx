import React from 'react';
import FlashMessage from 'react-native-flash-message';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';
import {Provider} from 'react-redux';
import PushNotification, {Importance} from 'react-native-push-notification';
import {LogBox} from 'react-native';

import Navigation from './src/navigation/MainStack';
import store from './src/redux/store';

LogBox.ignoreLogs(['EventEmitter.removeListener']);
LogBox.ignoreLogs([
  'You seem to update props of the "TRenderEngineProvider" component in short periods of time, causing costly tree rerenders',
  'You seem to update the renderersProps prop(s) of the "RenderHTML" component in short periods of time, causing costly tree rerenders',
  'ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from deprecated-react-native-prop-types .',
]);

let persistor = persistStore(store);

const App = () => {
  React.useEffect(() => {
    createNotificationChannel();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <Navigation />
        </SafeAreaProvider>
        <FlashMessage position="top" />
      </PersistGate>
    </Provider>
  );
};
function createNotificationChannel() {
  PushNotification.createChannel(
    {
      channelId: 'fcm_fallback_notification_channel', // ! Not sure
      channelName: 'supa', // (required)
      channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
      playSound: false, // (optional) default: true
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    },
    created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );
}
export default App;

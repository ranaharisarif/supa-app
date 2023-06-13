import appleAuth, {
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';
import jwt_decode from 'jwt-decode';
import {handleSocialLogin} from './Signin';
let user: string | undefined | any = undefined;
async function onAppleButtonPress(
  path: any,
  pId: any,
  updateCredentialStateForUser: number | string | any,
) {
  console.warn('Beginning Apple Authentication');

  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,

      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    if (appleAuthRequestResponse?.email == null) {
      //@ts-ignore
      const decode: any = jwt_decode(appleAuthRequestResponse!?.identityToken);
      const user = {
        id: '',
        name: '',
        email: decode!.email as string,
        photo: null,
        familyName: null,
        givenName: null,
      };
      return handleSocialLogin(user, path, pId);
    }

    // console.log(appleAuthRequestResponse, 'real response');
    // console.log('decoded', decode);
    const {
      user: newUser,

      email,

      nonce,

      identityToken,

      realUserStatus /* etc */,
    } = appleAuthRequestResponse;

    user = newUser;
    const initalUser = {
      id: appleAuthRequestResponse.user,
      name:
        //@ts-ignore
        appleAuthRequestResponse!.fullName!?.givenName +
        //@ts-ignore
        appleAuthRequestResponse!.fullName!?.familyName,
      email: appleAuthRequestResponse.email,
      photo: null,
      familyName: appleAuthRequestResponse.fullName?.familyName,
      givenName: appleAuthRequestResponse.fullName?.givenName,
    };
    //@ts-ignore
    handleSocialLogin(initalUser, path, pId);
    //@ts-ignore
    fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
      updateCredentialStateForUser(`Error: ${error.code}`),
    );

    if (identityToken) {
      // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
    } else {
      // no token - failed sign-in?
    }

    if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
    }
  } catch (error: any) {
    if (error.code === appleAuth.Error.CANCELED) {
      console.warn('User canceled Apple Sign in.');
    } else {
      console.log(error);
    }
  }
}
const doAppleLogin = async (
  path: any,
  pId: any,
  updateCredentialStateForUser: number | string | any,
) => {
  // Generate secure, random values for state and nonce
  // const rawNonce = uuid();
  // const state = uuid();

  try {
    // Initialize the module
    appleAuthAndroid.configure({
      // The Service ID you registered with Apple
      clientId: 'com.supapk.pk',

      // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
      // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
      redirectUri: 'https://supa.pk/',

      // [OPTIONAL]
      // Scope.ALL (DEFAULT) = 'email name'
      // Scope.Email = 'email';
      // Scope.Name = 'name';
      scope: appleAuthAndroid.Scope.ALL,

      // [OPTIONAL]
      // ResponseType.ALL (DEFAULT) = 'code id_token';
      // ResponseType.CODE = 'code';
      // ResponseType.ID_TOKEN = 'id_token';
      responseType: appleAuthAndroid.ResponseType.ALL,

      // [OPTIONAL]
      // A String value used to associate a client session with an ID token and mitigate replay attacks.
      // This value will be SHA256 hashed by the library before being sent to Apple.
      // This is required if you intend to use Firebase to sign in with this credential.
      // Supply the response.id_token and rawNonce to Firebase OAuthProvider
      // nonce: rawNonce,

      // [OPTIONAL]
      // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
      // state,
    });

    const response = await appleAuthAndroid.signIn();

    if (response?.user) {
      const user = {
        id: '',
        name: response?.user?.name?.firstName + response?.user?.name?.lastName,
        email: response?.user?.email as string,
        photo: null,
        familyName: response?.user?.name?.firstName,
        givenName: response?.user?.name?.lastName,
      };
      return handleSocialLogin(user, path, pId);
    }
    const decode: any = jwt_decode(response?.id_token as string);

    const user = {
      id: '',
      name: '',
      email: decode!.email as string,
      photo: null,
      familyName: null,
      givenName: null,
    };
    return handleSocialLogin(user, path, pId);
  } catch (error) {
    //@ts-ignore
    if (error && error.message) {
      //@ts-ignore
      switch (error.message) {
        case appleAuthAndroid.Error.NOT_CONFIGURED:
          console.log('appleAuthAndroid not configured yet.');
          break;
        case appleAuthAndroid.Error.SIGNIN_FAILED:
          console.log('Apple signin failed.');
          break;
        case appleAuthAndroid.Error.SIGNIN_CANCELLED:
          console.log('User cancelled Apple signin.');
          break;
        default:
          break;
      }
    }
  }
};

export {onAppleButtonPress, doAppleLogin};

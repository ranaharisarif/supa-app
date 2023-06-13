import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {
  CommonActions,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import {Alert} from 'react-native';

import {supa_base_url} from '../utils';
import {
  AuthResponseModel,
  BannerI,
  ColorsResponseI,
  OtpResponse,
  Collection_IdResponse,
} from '../models';
import store, {AppDispatch, AppThunk} from '../redux/store';
import {
  authStart,
  authFailed,
  authSuccess,
  updateUser,
  removeToken,
} from '../redux/reducer/authSlice';
import {
  saveColors,
  failColors,
  shopifyUserId,
  saveCollectioId,
  saveSaleId,
  Banner,
} from '../redux/reducer/dashboardSlice';
import {Colors} from '../constant/Colors';
import {useAppSelector} from '../hooks';
import shopifyApiService from './ShopifyApiService';
import {ShopifyAcessToken} from './GraphQLApi';
// const authReducer = useAppSelector(State => State.authReducer);
// const {token} = authReducer;
interface contactUs {
  data: {message: string; statusCode: number};
}

class SupaAuthApiService {
  supaInstance: AxiosInstance;

  private baseApiUrl: string = supa_base_url;
  public navigation: NavigationProp<ParamListBase> | undefined;

  constructor() {
    this.supaInstance = axios.create({
      baseURL: this.baseApiUrl,
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      timeout: 300000,
    } as AxiosRequestConfig);
  }
  setNavigation = (navigation: NavigationProp<ParamListBase>) => {
    this.navigation = navigation;
  };
  getRedux = () => {
    const authReducer = useAppSelector(State => State.authReducer);
    const dashboardReducer = useAppSelector(state => state.dashboardReducer);

    const {token, user} = authReducer;
    return dashboardReducer;
  };
  setAuth = (userAuth: string) => {
    this.supaInstance.defaults.headers.common['Authorization'] =
      'Bearer ' + userAuth;
  };
  getColors = (): AppThunk => async (dispatch: AppDispatch) => {
    try {
      const res = await this.supaInstance.get<AxiosResponse<ColorsResponseI>>(
        'config/color',
      );

      let [primary, secondary] = res.data?.data?.value.split(',');
      let colorObj = {
        primary,
        secondary,
        gradient1: Colors.gradient1,
        gradient2: Colors.gradient2,
        title: Colors.title,
        resend: Colors.resend,
      };
      dispatch(saveColors(colorObj));
    } catch (error) {
      let colorObj = {
        primary: Colors.primary,
        secondary: Colors.secondary,
        gradient1: Colors.gradient1,
        gradient2: Colors.gradient2,
        title: Colors.title,
        resend: Colors.resend,
      };
      dispatch(saveColors(colorObj));
      console.warn('fail to get colors', error);
      dispatch(failColors());
    }
    return true;
  };

  getCollectionId1 = (): AppThunk => async (dispatch: AppDispatch) => {
    try {
      const res = await this.supaInstance.get<
        AxiosResponse<Collection_IdResponse[]>
      >('config/screen_collection');

      if (res.status == 200) {
        dispatch(saveCollectioId(res?.data?.data[0] as any));
        dispatch(saveSaleId(res?.data?.data[1] as any));
      }

      // dispatch(saveCollectioId(res.data.data))
    } catch (error) {
      console.error(error);
    }
  };
  getbanner1 = (): AppThunk => async (dispatch: AppDispatch) => {
    try {
      const res = await this.supaInstance.get<BannerI>('config/banner');

      if (res?.status == 200) {
        dispatch(Banner(res.data.data));
      }
    } catch (error) {
      console.log('this is banner error', error);
    }
  };

  signinUser =
    (
      values: any,
      formikRef: any,
      navigation: any,
      email: string,
      path: any,
      pId: any,
      check: boolean,
    ): AppThunk =>
    async (dispatch: AppDispatch) => {
      try {
        dispatch(authStart());

        const res = await this.supaInstance.post<AuthResponseModel<any>>(
          'login',
          values,
        );

        // return true;
        if (res.data.statusCode == 200) {
          if (check) {
            const shopifyResponse = await shopifyApiService.shopifySignin(
              email,
            );
            dispatch(
              shopifyUserId(
                shopifyResponse.data?.customers![0]?.id ?? undefined,
              ),
            );
          }

          dispatch(authSuccess(res.data));
          this.setAuth(res.data.token!);

          setTimeout(
            () => {
              if (path) {
                this.navigation!?.navigate('HomeTabs', {
                  screen: 'Catalogue',
                  params: {
                    screen: path,
                    params: {
                      cartm: true,
                      pId,
                    },
                  },
                });
              } else {
                this.navigation!.dispatch(
                  CommonActions.reset({
                    index: 1,
                    routes: [{name: 'HomeTabs'}],
                  }),
                );
              }
            },
            // this.navigation?.navigate('Home');
            1000,
          );
        } else {
          dispatch(authFailed());
          formikRef.current?.setErrors({
            email: 'Email is invalid!',
            password: 'Password is wrong!',
          });
        }
      } catch (e) {
        dispatch(authFailed());
        console.error(e);
      }
    };
  signupUser =
    (
      values: FormData,
      phone: string,
      formikRef: any,
      navigation: any,
      email: any,
      passward: any,
      custmerId: any,
      customNavigationPath: {path: string} | undefined,
    ): AppThunk =>
    async (dispatch: AppDispatch) => {
      try {
        // dispatch(authStart());
        const res = await this.supaInstance.post<AuthResponseModel<any>>(
          'regstr',
          values,
        );

        // return true;
        if (res.data.statusCode == 200) {
          dispatch(authSuccess(''));
          const formData: FormData = new FormData();
          formData.append('email', email);
          formData.append('password', passward);
          ShopifyAcessToken(email, passward);
          //! donot need formik here
          //@ts-ignore
          dispatch(
            this.signinUser(
              formData,
              '',
              navigation,
              email,
              customNavigationPath?.path,
              '',
              false,
            ),
          );
          // setTimeout(() => {
          //   if (!store.getState().authReducer.signInLoader) {
          //     navigation.navigate('VerifyOtp', {
          //       id: res.data.data.id,
          //       sendOtp: phone.slice(3),
          //       selectField: '',
          //       screenFlag: false,
          //       formikRef,
          //       navigation,
          //       email,
          //       passward,
          //     });
          //   }
          // }, 500);
        } else {
          dispatch(authFailed());
          shopifyApiService.deleteUser(custmerId);
          formikRef.current?.setErrors({
            name: res.data?.error?.name ? 'Name is already exist.' : undefined,
            mobilenumber: res.data?.error?.phone
              ? 'Mobile Number is already exist.'
              : undefined,
            email: res.data?.error?.email
              ? 'Email is already exist.'
              : undefined,
          });
        }
      } catch (e: any) {
        console.log(e.message, 'signup error');

        dispatch(authFailed());
      }
    };
  socialLoginFirstTime =
    (
      values: any,
      email: string,
      passward: string,
      path: any,
      pId: any,
    ): AppThunk =>
    async (dispatch: AppDispatch) => {
      try {
        const res = await this.supaInstance.post<AuthResponseModel<any>>(
          'regstr',
          values,
        );
        // return true;
        if (res.data.statusCode == 200) {
          //* After signup we need to login to get user.

          const formData: FormData = new FormData();
          formData.append('email', email);
          formData.append('password', passward);
          //@ts-ignore
          dispatch(
            this.socialLogin(formData, email, path ?? undefined, '', false),
          );
          //! TODO FIX
          // setTimeout(() => {
          //   if (path) {
          //     return this.navigation!.navigate('HomeTabs', {
          //       screen: 'Catalogue',
          //       params: {
          //         screen: path,
          //         cartm: true,
          //         pId,
          //       },
          //     });
          //   } else {
          //     return this.navigation!.dispatch(
          //       CommonActions.reset({
          //         index: 1,
          //         routes: [{name: 'HomeTabs'}],
          //       }),
          //     );
          //   }
          // }, 1000);
        } else {
          console.warn('sowething went wrong!');
          dispatch(authFailed());
        }
      } catch (e: any) {
        console.log(e.message, 'signup error');

        dispatch(authFailed());
      }
    };
  RecoverPassword = async (
    value: any,
    selectedField: string,
  ): Promise<AuthResponseModel<OtpResponse>> => {
    return Promise.resolve(
      this.supaInstance.post(`recover-password/${selectedField}`, value),
    );
  };
  socialLogin =
    (
      values: any,
      email: string,
      path: any,
      pId: any,
      check: boolean,
    ): AppThunk =>
    async (dispatch: AppDispatch) => {
      dispatch(authStart());
      try {
        const res = await this.supaInstance.post<AuthResponseModel<any>>(
          'login',
          values,
        );
        console.log(
          '🚀 ~ file: SupaAuthApiService.ts ~ line 355 ~ SupaAuthApiService ~ res',
          res,
          values,
        );

        if (res.data.statusCode == 200) {
          if (check) {
            const shopifyResponse = await shopifyApiService.shopifySignin(
              email,
            );
            dispatch(
              shopifyUserId(
                shopifyResponse.data?.customers![0]?.id ?? undefined,
              ),
            );
          }
          dispatch(authSuccess(res.data));
          this.setAuth(res.data.token!);
          setTimeout(
            () => {
              if (path) {
                this.navigation!?.navigate('HomeTabs', {
                  screen: 'Catalogue',
                  params: {
                    screen: path,
                    params: {
                      cartm: true,
                      pId,
                    },
                  },
                });
              } else {
                this.navigation!.dispatch(
                  CommonActions.reset({
                    index: 1,
                    routes: [{name: 'HomeTabs'}],
                  }),
                );
              }
            },
            // this.navigation?.navigate('Home');
            1000,
          );
        } else {
          Alert.alert('Signup failed!');
          dispatch(authFailed());
        }
      } catch (e) {
        Alert.alert('Something went wrong!');
        dispatch(authFailed());
        console.error('social login error line 400.', e);
      }
    };

  VerifyOtp = async (data: any): Promise<AxiosResponse<OtpResponse>> => {
    return await Promise.resolve(this.supaInstance.post('verify-otp', data));
  };
  reSendOtp = async (
    data: any,
    selectedField: string,
  ): Promise<AxiosResponse> => {
    return await Promise.resolve(
      this.supaInstance.post(`resend-otp/${selectedField}`, data),
    );
  };
  resetPassword = async (
    values: any,
    id: number,
  ): Promise<AxiosResponse<OtpResponse>> => {
    return await this.supaInstance.post(`reset-password/${id}`, values);
  };

  ContactUs = async (data: any, token: string) => {
    this.setAuth(token);
    return this.supaInstance
      .post<contactUs>('contact-us', data)
      .catch(function (error) {
        console.log(error);
      });
    // return this.supaInstanceI.post<contactUs>('contact-us', data);
  };
  UpdateUser =
    (data: any, id: any, token: any, formikRef: any): AppThunk =>
    async (dispatch: AppDispatch) => {
      this.setAuth(token);
      const res = await this.supaInstance.post(`update-user/${id}`, data);

      if (res.data.statusCode == 200) {
        dispatch(updateUser(res.data.user));

        // return true;
      } else {
        formikRef.current?.setErrors({
          mobilenumber: res.data?.error
            ? 'Mobile Number is already exist.'
            : undefined,
        });
      }
      // return true;
    };
  ChanePass = async (data: any, id: any) => {
    return await this.supaInstance.post(`change-password/${id}`, data);
  };
  saveToken = async (id: number, token: string) => {
    // console.log('id token', id, token);

    try {
      const formData: FormData = new FormData();
      formData.append('device_token', token);
      const res = await this.supaInstance.post(`update-user/${id}`, formData);
    } catch (error) {
      console.log(error);
    }
  };
  Notification = async (token: any) => {
    this.setAuth(token);
    try {
      return await this.supaInstance.get('notifications-list');
    } catch (error) {
      console.error(error);
    }
  };
  handleTokenForIos = async (token: string | undefined) => {
    try {
      return await fetch('https://iid.googleapis.com/iid/v1:batchImport', {
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'key=AAAAYj3DpS4:APA91bHP7bWMXVaPQGnzIs5oDlgHmiHDL-C4ygg7zvegYGAjIKYakEJkJga7J0oxg9L6ktkKqV2qoAJiMepGx1-K4o1VrZkyve-AbRyww4eN20s5sMlQVdHo0qChdm5psC6OcIqWGNpi',
        },
        method: 'POST',
        body: JSON.stringify({
          application: 'com.supapk',
          sandbox: true,
          apns_tokens: [token?.toString()],
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };
  deleteAccount = async () => {
    const formData = new FormData();
    formData.append('email', store.getState().authReducer?.user?.email);
    try {
      const res = await this.supaInstance.post('delUserAccount', formData);
      if (res.data.statusCode == 200) {
        store.dispatch(removeToken());
        this.navigation!.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'AuthStack'}],
          }),
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Something went wrong!');
    }
  };
}
const supaAuthApiService = new SupaAuthApiService();

export default supaAuthApiService;

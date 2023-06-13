import store from '../redux/store';

const tokenExist = () => {
  return store.getState().authReducer?.token ? true : false;
};

export {tokenExist};

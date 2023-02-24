import { atom } from 'recoil';
import { STORE } from '../../contants';
import { persistAtom } from '../persist';

export const accountIdState = atom({
  key: STORE.ACCOUNT.ACCOUNT_ID,
  default: '',
  effects_UNSTABLE: [persistAtom]
});

export const accessTokenState = atom({
  key: STORE.ACCOUNT.ACCESS_TOKEN,
  default: '',
  effects_UNSTABLE: [persistAtom]
});

export const accountNameState = atom({
  key: STORE.ACCOUNT.ACCOUNT_NAME,
  default: '',
  effects_UNSTABLE: [persistAtom]
});

export const accountEmailState = atom({
  key: STORE.ACCOUNT.ACCOUNT_EMAIL,
  default: '',
  effects_UNSTABLE: [persistAtom]
});

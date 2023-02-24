import { atom } from 'recoil';
import { STORE } from '../../contants';
import { persistAtom } from '../persist';

export const accountIdState = atom({
  key: STORE.ACCOUNT.ACCOUNT_ID,
  default: ''
});

export const accessTokenState = atom({
  key: STORE.ACCOUNT.ACCESS_TOKEN,
  default: '',
  effects_UNSTABLE: [persistAtom]
});

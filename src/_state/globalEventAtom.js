import { atom } from 'recoil';

// notification
export const globalEventAtom = atom({
  key: 'globalEventAtom',
  default: {
    eventName: '',
    search:'',
    message: '',
    data: {}
  },
});
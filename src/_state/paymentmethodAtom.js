import { atom } from 'recoil';

const paymentmethodAtom = atom({
    key: 'paymentmethodAtom',
    default: []
});

export { paymentmethodAtom };
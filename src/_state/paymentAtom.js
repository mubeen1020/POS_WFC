import { atom } from 'recoil';

const paymentAtom = atom({
    key: 'paymentAtom',
    default: []
});

export { paymentAtom };
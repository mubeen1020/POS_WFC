import { atom } from 'recoil';

const paymentstatusAtom = atom({
    key: 'paymentstatusAtom',
    default: []
});

export { paymentstatusAtom };
import { atom } from 'recoil';

const orderstatusAtom = atom({
    key: 'orderstatusAtom',
    default: []
});

export { orderstatusAtom };
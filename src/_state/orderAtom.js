import { atom } from 'recoil';

const orderAtom = atom({
    key: 'orderAtom',
    default: []
});

export { orderAtom };
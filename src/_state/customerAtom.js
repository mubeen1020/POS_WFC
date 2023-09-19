import { atom } from 'recoil';

const customerAtom = atom({
    key: 'customerAtom',
    default: []
});

export { customerAtom };
import { atom } from 'recoil';

const orderitemsAtom = atom({
    key: 'orderitemsAtom',
    default: []
});

export { orderitemsAtom };
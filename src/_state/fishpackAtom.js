import { atom } from 'recoil';

const fishpackAtom = atom({
    key: 'fishpackAtom',
    default: []
});

export { fishpackAtom };
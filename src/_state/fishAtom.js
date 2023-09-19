import { atom } from 'recoil';

const fishAtom = atom({
    key: 'fishAtom',
    default: []
});

export { fishAtom };
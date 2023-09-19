import { atom } from 'recoil';

const sidebarAtom = atom({
    key: 'sidebar',
    default: false
});

export { sidebarAtom };
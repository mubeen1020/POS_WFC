import React from 'react';
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { AppSidebarNav } from './AppSidebarNav';
import { logoNegative } from 'src/assets/brand/logo-negative';
import { sygnet } from 'src/assets/brand/sygnet';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import navigation from '../_nav';
import { sidebarAtom } from 'src/_state/sidebarAtom';
import { useRecoilState } from 'recoil';

const AppSidebar = () => {
  const [state, setSideBarState] = useRecoilState(sidebarAtom);

  const toggleSidebar = () => {
    setSideBarState(!state);
  };

  return (
    <CSidebar
      position="fixed"
      unfoldable={false}
      visible={!state}
      onClick={() => { toggleSidebar}}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={toggleSidebar}
      />
    </CSidebar>
  );
};

export default React.memo(AppSidebar);

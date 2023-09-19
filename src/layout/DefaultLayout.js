import React, { useEffect } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { customerAtom } from 'src/_state/customerAtom'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import CustomerService from 'src/services/customer_services'
import { globalEventAtom } from 'src/_state/globalEventAtom'
import { fishAtom } from 'src/_state/fishAtom'
import FishService from 'src/services/fish_services'
import { fishpackAtom } from 'src/_state/fishpackAtom'
import FishpackService from 'src/services/fishpack_services'

const DefaultLayout = () => {
  const setCustomer = useSetRecoilState(customerAtom);
  const setFish = useSetRecoilState(fishAtom);
  const setFishpack = useSetRecoilState(fishpackAtom);
  const globatEvent = useRecoilValue(globalEventAtom);

  const refreshCustomer = (search = "") => {
    const api = new CustomerService;
    api.getCustomer(search).then((res) => {
      if (Array.isArray(res.data)) {
        setCustomer(res.data);
      } else {
        if (res.data && res.data.message === "Customer not found.") {
          setCustomer([]);
        } else {
          setCustomer(res.data.customers);
        }
      }

    }).catch((err) => { });
  }

  const refreshfish = (search = "") => {
    const api = new FishService;
    api.getfish(search).then((res) => {

      if (Array.isArray(res.data)) {
        setFish(res.data);
      } else {
        if (res.data && res.data.message === "fish not found.") {
          setFish([]);
        } else {
          setFish(res.data.fishList);
        }
      }

    }).catch((err) => { });
  }

  const refreshfishpack = (search = "") => {
    const api = new FishpackService;
    api.getfishpack(search).then((res) => {
      if (Array.isArray(res.data)) {
        setFishpack(res.data);
      } else {
        if (res.data && res.data.message === "fishpack not found.") {
          setFishpack([]);
        } else {
          setFishpack(res.data.fishPacks);
        }
      }

    }).catch((err) => { });
  }

  useEffect(() => {
    refreshCustomer();
    refreshfish();
    refreshfishpack();
  }, [])

  useEffect(() => {
    switch (globatEvent.eventName) {
      case 'refreshCustomer':
        refreshCustomer(globatEvent.search);
        break;
      case 'refreshfish':
        refreshfish(globatEvent.search);
        break;
      case 'refreshfishpack':
        refreshfishpack(globatEvent.search);
        break;
      default:
    }
  }, [globatEvent]);

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout

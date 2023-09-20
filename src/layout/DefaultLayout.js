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
import { orderAtom } from 'src/_state/orderAtom'
import OrdersService from 'src/services/order_services'
import { paymentmodeAtom } from 'src/_state/paymentmodeAtom'
import PaymentmodeService from 'src/services/paymentmode_services'
import { paymentstatusAtom } from 'src/_state/paymentstatusAtom'
import PaymentstatusService from 'src/services/paymentstatus_services'
import { paymentmethodAtom } from 'src/_state/paymentmethodAtom'
import PaymentmethodService from 'src/services/paymentmethod_services'
import { orderstatusAtom } from 'src/_state/orderstatusAtom'
import OrderStatusService from 'src/services/orderstatus_services'

const DefaultLayout = () => {
  const setCustomer = useSetRecoilState(customerAtom);
  const setFish = useSetRecoilState(fishAtom);
  const setFishpack = useSetRecoilState(fishpackAtom);
  const setOrder = useSetRecoilState(orderAtom);
  const setPaymentmode = useSetRecoilState(paymentmodeAtom);
  const setPaymentstatus = useSetRecoilState(paymentstatusAtom);
  const setPaymentmethod = useSetRecoilState(paymentmethodAtom);
  const setOrderstatus = useSetRecoilState(orderstatusAtom);
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

  const refreshorder = (search = "") => {
    const api = new OrdersService;
    api.getorders(search).then((res) => {
      if (Array.isArray(res.data)) {
        setOrder(res.data);
      } else {
        if (res.data && res.data.message === "orders not found.") {
          setOrder([]);
        } else {
          setOrder(res.data.orders);
        }
      }

    }).catch((err) => { });
  }

  const refreshpaymentmode = (search = "") => {
    const api = new PaymentmodeService;
    api.getpaymentmode(search).then((res) => {
      if (Array.isArray(res.data)) {
        setPaymentmode(res.data);
      } else {
        if (res.data && res.data.message === "paymentmode not found.") {
          setPaymentmode([]);
        } else {
          setPaymentmode(res.data.paymentmodes);
        }
      }

    }).catch((err) => { });
  }

  const refreshpaymentstatus = (search = "") => {
    const api = new PaymentstatusService;
    api.getpaymentStatus(search).then((res) => {
      if (Array.isArray(res.data)) {
        setPaymentstatus(res.data);
      } else {
        if (res.data && res.data.message === "paymentmode not found.") {
          setPaymentstatus([]);
        } else {
          setPaymentstatus(res.data.paymentStatuses);
        }
      }

    }).catch((err) => { });
  }

  const refreshpaymentmethod= (search = "") => {
    const api = new PaymentmethodService;
    api.getpaymentmethods(search).then((res) => {
      if (Array.isArray(res.data)) {
        setPaymentmethod(res.data);
      } else {
        if (res.data && res.data.message === "paymentmethod not found.") {
          setPaymentmethod([]);
        } else {
          setPaymentmethod(res.data.paymentMethods);
        }
      }

    }).catch((err) => { });
  }

  const refreshorderstatus= (search = "") => {
    const api = new OrderStatusService;
    api.getorderStatus(search).then((res) => {
      if (Array.isArray(res.data)) {
        setOrderstatus(res.data);
      } else {
        if (res.data && res.data.message === "paymentmethod not found.") {
          setOrderstatus([]);
        } else {
          setOrderstatus(res.data.orderStatuses);
        }
      }

    }).catch((err) => { });
  }

  useEffect(() => {
    refreshCustomer();
    refreshfish();
    refreshfishpack();
    refreshorder();
    refreshpaymentmode();
    refreshpaymentstatus();
    refreshpaymentmethod();
    refreshorderstatus();
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
      case 'refreshorder':
        refreshorder(globatEvent.search);
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

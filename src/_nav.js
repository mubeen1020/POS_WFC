import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilAsteriskCircle,
  cilBug,
  cilCart,
  cilCash,
  cilColumns,
  cilCreditCard,
  cilFire,
  cilRestaurant,
  cilSettings,
  cilSpeedometer,
  cilStar,
  cilStorage,
  cilTask,
  cilUser,
  
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Customer',
  },
  {
    component: CNavItem,
    name: 'Customer',
    to: '/Customer/customerList',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Fish',
  },
  {
    component: CNavItem,
    name: 'Fish',
    to: '/Fish/FishList',
    icon: <CIcon icon={cilAsteriskCircle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Fish Pack',
    to: '/Fish/FishPackList',
    icon: <CIcon icon={cilColumns} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Order',
  },
  {
    component: CNavItem,
    name: 'Orders',
    to: '/Order/OrderList',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Order Stock Item ',
    to: '/Order/OrderStockItemsList',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Order Purchase Item ',
    to: '/Order/OrderPurchaseItemsList',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Payment',
  },
  {
    component: CNavItem,
    name: 'Payment',
    to: '/Payment/PaymentList',
    icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Purchase Requirement',
    to: '/Order/OrderList',
    icon: <CIcon icon={cilBug} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Settings',
    to: '/Settings',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
]

export default _nav

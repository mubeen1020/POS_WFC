import React from 'react'
import Login from './views/pages/login/Login'
import Customer from './views/customer/customer'
import CustomerList from './views/customer/customerlist'
import Fish from './views/fish/fish'
import Customer_List from './views/customer/customerlist'
import Fish_List from './views/fish/fishlist'
import FishPack_List from './views/fishpack/fishpacklist'
import FishPack from './views/fishpack/fishpack'
import Orders from './views/order/order'
import Order_List from './views/order/orderlist'
import Order_Stock_Item_List from './views/orderstockitem/orderstockitemlist'
import OrderStockItem from './views/orderstockitem/orderstockitem'
import Order_purchase_item_List from './views/orderpurchaseitem/orderpurchaseitemlist'
import Order_Purchase_Item from './views/orderpurchaseitem/orderpurchaseitem'
import Payments from './views/payment/payment'
import Payments_List from './views/payment/paymentlist'
import Settings from './views/settings/settings'
import CommonHome from './views/home/home'
import Purchase_Requirement from './views/purchaserequirements/purchaserequirement'
import PurchaseRequirement from './views/purchaserequirements/purchaserequirement'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/home', exact: true, name: 'Home',element:CommonHome },
  { path: '/', name: 'Login Page', element: Login },
  
  { path: '/Customer', name: 'Customer', element: CustomerList, exact: true },
  { path: '/Customer/customerList/customer', name: 'Add Customer', element: Customer },
  { path: '/Customer/customerList', name: 'Customer List', element: Customer_List },
  { path: '/Customer/customerList/customerupdate/:id', name: 'update Customer', element: Customer },

  { path: '/Fish', name: 'Fish', element: FileList, exact: true },
  { path: '/Fish/FishList/Fish', name: 'Add Fish', element: Fish },
  { path: '/Fish/FishList', name: 'Fish List', element: Fish_List },
  { path: '/Fish/FishList/Fish/fishupdate/:id', name: 'update Fish', element: Fish },

  { path: '/Fish/FishPackList', name: 'Fish Pack List', element: FishPack_List },
  { path: '/Fish/FishPackList/FishPack', name: 'Add Fish Pack', element: FishPack },
  { path: '/Fish/FishPackList/FishPack/fishPackupdate/:id', name: 'update Fish', element: FishPack },

  { path: '/order', name: 'Order', element: FileList, exact: true },
  { path: '/Order/OrderList/Order', name: 'Add Order', element: Orders },
  { path: '/Order/OrderList', name: 'Order List', element: Order_List },
  { path: '/Order/OrderList/Order/Orderupdate/:id', name: 'update Order', element: Orders },

  { path: '/Order/OrderStockItemsList/OrderItems', name: 'Add Order Stock Items', element: OrderStockItem },
  { path: '/Order/OrderStockItemsList', name: 'Order Stock Items List', element: Order_Stock_Item_List },
  { path: '/Order/OrderStockItemsList/OrderStockItems/OrderStockItemsupdate/:id', name: 'update  Order Stock Items ', element: OrderStockItem },

  { path: '/Order/OrderPurchaseItemsList/OrderItems', name: 'Add Order Purchase Items', element: Order_Purchase_Item },
  { path: '/Order/OrderPurchaseItemsList', name: 'Order Purchase Items List', element: Order_purchase_item_List },
  { path: '/Order/OrderPurchaseItemsList/OrderPurchaseItems/OrderPurchaseItemsupdate/:id', name: 'update  Order Purchase Items ', element: Order_Purchase_Item },

  { path: '/payment', name: 'Payment', element: FileList, exact: true },
  { path: '/Payment/PaymentList/Payment', name: 'Add Payment', element: Payments },
  { path: '/Payment/PaymentList', name: 'Payment List', element: Payments_List },
  { path: '/Payment/PaymentList/Payment/Paymentupdate/:id', name: 'update Payment', element: Payments },

  { path: '/Settings', name: 'Settings', element: Settings},
  { path: '/Purchaserequirement', name: 'Purchase Requirement', element: PurchaseRequirement}
]

export default routes

import Layout from "@/layout";
import Auth from "@/middlewares/auth";
import User from "@/mixins/modules/authMixins";
import Merchants from "@/views/Merchant/MerchantList";
import CreateMerchant from "@/views/Merchant/MerchantCreate";
import EditMerchant from "@/views/Merchant/MerchantEdit";
import Users from "@/views/User/UserList";
import CreateUser from "@/views/User/UserCreate";
import EditUser from "@/views/User/UserEdit";
import RoleList from "@/views/Role/RoleList";
import RoleCreate from "@/views/Role/RoleCreate";
import RoleEdit from "@/views/Role/RoleEdit";
import ResetPassword from "@/views/User/ResetPassword";
import BankList from "@/views/Bank/BankList";
import BankEdit from "@/views/Bank/BankEdit";
import BankCreate from "@/views/Bank/BankCreate"
import Dashboard_Dutyfree from "@/views/Dashboard_Dutyfree/Dashboard";
import Dashboard_DutyfreeSL from "@/views/Dashboard_DutyfreeSL/Dashboard";
// import Dashboard_DutyfreeBank from "@/views/Dashboard_DutyfreeBank/Dashboard";
import DutyFreeMerchant from "@/views/DutyFreeMerchant/DutyFreeMerchant"
import PurchaseDutyFreeMerchant from "@/views/DutyFreeMerchant/DutyFreeMerchantPurchase"
import DutyFreeSLCustoms from "@/views/DutyFreeSLCustoms/DutyFreeSLCustoms"
import DutyFreePendingRequests from "@/views/DutyFreeRequests/DutyFreePendingRequests"
import DutyFreeRequests from "@/views/DutyFreeRequests/DutyFreeRequests"
import DutyFreeRequestsAction from "@/views/DutyFreeRequests/DutyFreeRequestsAction"
import DutyFreeCustomers from "@/views/DutyFreeCustomers/DutyFreeCustomers"
import CreateDutyFreeCustomers from "@/views/DutyFreeCustomers/DutyFreeCustomersCreate"
import DutyFreeUpdateTodaysRate from "@/views/DutyFreeUpdateTodaysRate/DutyFreeUpdateTodaysRate"
import Dashboard from "@/views/Dashboard/Dashboard";
import CustomerReport from "@/views/Reports/CustomerReport";
import MerchantReport from "@/views/Reports/MerchantReport";
import RequestReport from "@/views/Reports/RequestReport";
import CustomerReportMerchantView from "@/views/Reports/CustomerReportMerchantView";


const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login'),
        hidden: true
    },
    {
        path: '/Terms&Conditions',
        name: 'TermsAndConditionsModal',
        component: () => import('@/components/TermsAndConditionsModal'),
        hidden: true,
      },  
    {
        path: '/resetPassword',
        name: 'ResetPassword',
        component: ResetPassword,
        hidden: true
    },
    {
        path: '/',
        hidden: true,
        redirect: 'Login',
    },
    {
        path: '/#',
        component: Layout,
        isVisible: () => {
            return User.hasPermission("df-bank-view") ||
                User.hasPermission("df-ministry-view") ||
                User.hasPermission("df-customs-view") ||
                User.hasSuperPermission()
        },
        redirect: () => {
            if(User.hasSuperPermission()) return 'DashboardDFMinistry'
            if(User.hasPermission("df-bank-view")) return 'DashboardDFBank'
            if(User.hasPermission("df-ministry-view")) return 'DashboardDFMinistry'
            if(User.hasPermission("df-customs-view")) return 'DashboardDFCustoms'
        },
        meta: { type: 'menu', icon: 'view-dashboard',
            title: 'Dashboard', isActive: false},
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: Dashboard,
                meta: {
                    type: '', icon: 'view-dashboard', title: 'Dashboard',
                    isActive: false, middleware: [Auth]
                }
            },
            // {
            //     path: '/dashboard/dutyfree/bank',
            //     name: 'DashboardDFBank',
            //     component: Dashboard_DutyfreeBank,
            //     meta: {
            //         type: '', icon: 'view-dashboard', title: 'Dashboard',
            //         isActive: false, middleware: [Auth]
            //     }
            // },
            {
                path: '/dashboard/dutyfree/ministry',
                name: 'DashboardDFMinistry',
                component: Dashboard_Dutyfree,
                meta: {
                    type: '', icon: 'view-dashboard', title: 'Dashboard',
                    isActive: false, middleware: [Auth]
                }
            },
            {
                path: '/dashboard/dutyfree/customs',
                name: 'DashboardDFCustoms',
                component: Dashboard_DutyfreeSL,
                meta: {
                    type: '', icon: 'view-dashboard', title: 'Dashboard',
                    isActive: false, middleware: [Auth]
                }
            }
        ]
    },
    {
        path: '/#',
        component: Layout,
        isVisible: () => {
            return User.hasSuperPermission() || User.hasPermission("df-merchant-view") || User.hasPermission("user-view")
        },
        redirect: '',
        meta: { type: 'menu', icon: 'cog', title: 'Administrator', isActive: false },
        children: [
            {
                path: '/users',
                name: 'Users',
                isVisible: () => {return User.hasPermission("user-view")},
                component: Users,
                meta: { type: 'menu-item', title: 'Users', icon: 'account-multiple',
                    isActive: false, middleware: [Auth]  }
            },
            {
                path: '/users/create',
                name: 'CreateUser',
                component: CreateUser,
                meta: { type: '', isActive: false, middleware: [Auth]  }
            },
            {
                path: '/users/edit/:id',
                name: 'EditUser',
                component: EditUser,
                meta: { type: '', isActive: false, middleware: [Auth]  }
            },
            {
                path: '/roles',
                name: 'Roles',
                isVisible: () => {return User.hasPermission("role-view")},
                component: RoleList,
                meta: { type: 'menu-item', title: 'Roles', icon: 'human-male-board', isActive: false, middleware: [Auth]  }
            },
            {
                path: '/roles/create',
                name: 'CreateRole',
                component: RoleCreate,
                meta: { type: '', isActive: false, middleware: [Auth]  }
            },
            {
                path: '/roles/edit/:id',
                name: 'EditRole',
                component: RoleEdit,
                meta: { type: '', isActive: false, middleware: [Auth]  }
            },
            {
                path: '/banks',
                name: 'Bank',
                isVisible: () => {return User.hasPermission("bank-view")},
                component: BankList,
                meta: { type: 'menu-item', title: 'Banks', icon: 'bank', isActive: false, middleware: [Auth]  }
            },
            {
                path: '/banks/create',
                name: 'BankCreate',
                component: BankCreate,
                meta: { type: '', isActive: false, middleware: [Auth]  }
            },
            {
                path: '/banks/edit/:id',
                name: 'BankEdit',
                component: BankEdit,
                meta: { type: '', isActive: false, middleware: [Auth]  }
            },
            {
                path: '/merchants',
                name: 'Merchants',
                isVisible: () => { return User.hasPermission("df-merchant-view") },
                component: Merchants,
                meta: {
                    type: 'menu-item', title: 'Merchants', icon: 'store',
                    isActive: false, middleware: [Auth]
                }
            },

            {
                path: '/merchants/create',
                name: 'CreateMerchant',
                component: CreateMerchant,
                meta: { type: '', isActive: false, middleware: [Auth] }
            },
            {
                path: '/merchants/edit/:id',
                name: 'EditMerchant',
                component: EditMerchant,
                meta: { type: '', isActive: false, middleware: [Auth] }
            },
        ]
        },
    {
        path: '/#',
        component: Layout,
        isVisible: () => {
            return User.hasPermission("df-bank-view") ||
                User.hasPermission("df-cbsl-view") || User.hasPermission("df-merchant-data-view") ||
                User.hasPermission("df-customs-view")
        },
        redirect: '',
        meta: {type: 'menu', icon: 'hand-extended', title: 'Duty Free', isActive: false},
        children: [
            {
                path: '/dutyFreeMerchant',
                name: 'DutyFreeMerchant',
                isVisible: () => {
                    return User.hasPermission("df-merchant-data-view") || User.hasSuperPermission()
                },
                component: DutyFreeMerchant,
                meta: {
                    type: 'menu-item', title: 'Duty Free Merchants', icon: 'store',
                    isActive: false, middleware: [Auth]
                }
            },
            {
                path: '/dutyFreeMerchantPurchase',
                name: 'PurchaseDutyFreeMerchant',
                isVisible: () => {
                    return User.hasPermission("df-merchant-data-view") || User.hasSuperPermission()
                },
                component: PurchaseDutyFreeMerchant,
                meta: {type: '', isActive: false, middleware: [Auth]}

            },
            {
                path: '/dutyFreeSLCustoms',
                name: 'dutyFreeSLCustoms',
                isVisible: () => {
                    return User.hasPermission("df-customs-view") || User.hasSuperPermission()
                },
                component: DutyFreeSLCustoms,
                meta: {
                    type: 'menu-item', title: 'Duty FreeSL Customs', icon: 'account-tie-hat',
                    isActive: false, middleware: [Auth]
                }
            },
            {
                path: '/DutyFreePendingRequests',
                name: 'DutyFreePendingRequests',
                isVisible: () => {
                    return User.hasPermission("df-bank-view") && !User.hasSuperPermission()
                },
                component: DutyFreePendingRequests,
                meta: {
                    type: 'menu-item', title: 'Duty Free Pending Requests', icon: 'hand-coin',
                    isActive: false, middleware: [Auth]
                }
            },
            {
                path: '/dutyFreeRequests',
                name: 'dutyFreeRequests',
                isVisible: () => {
                    return User.hasPermission("df-bank-view") && !User.hasSuperPermission()
                },
                component: DutyFreeRequests,
                meta: {
                    type: 'menu-item', title: 'Duty Free Requests', icon: 'receipt-text',
                    isActive: false, middleware: [Auth]
                }
            },
            {
                path: '/dutyFreeRequests/DutyFreeRequestsAction',
                name: 'DutyFreeRequestsAction',
                isVisible: () => {
                    return User.hasPermission("df-bank-view") && !User.hasSuperPermission()
                },
                component: DutyFreeRequestsAction,
                meta: {type: '', isActive: false, middleware: [Auth]}
            },
            {
                path: '/dutyFreeCustomers',
                name: 'dutyFreeCustomers',
                isVisible: () => {
                    return User.hasPermission("df-bank-view")
                },
                component: DutyFreeCustomers,
                meta: {
                    type: 'menu-item', title: 'Duty Free Customers', icon: 'account-cash',
                    isActive: false, middleware: [Auth]
                }
            },
            {
                path: '/dutyFreeCustomers/create/:nic',
                name: 'CreateDutyFreeCustomers',
                isVisible: () => {
                    return User.hasPermission("df-bank-view")
                },
                component: CreateDutyFreeCustomers,
                meta: {type: '', isActive: false, middleware: [Auth]}
            },
            {
                path: '/dutyFreeUpdateTodaysRate',
                name: 'DutyFreeUpdateTodaysRate',
                isVisible: () => {
                    return User.hasPermission("df-cbsl-view")
                },
                component: DutyFreeUpdateTodaysRate,
                meta: {
                    type: 'menu-item', title: 'Daily Exchange Rates', icon: 'update',
                    isActive: false, middleware: [Auth]
                }
            },

        ]
    },

    {
        path: '/#',
        component: Layout,
        isVisible: () => {
            return User.hasPermission("df-report-view") || User.hasPermission("df-merchant-data-view") || User.hasPermission("df-customs-view")
            
        },
        meta: { type: 'menu', icon: 'script-text', title: 'Reports', isActive: false},
        children: [
            {
                path: '/report/customer',
                name: 'CustomerReport',
                isVisible: () => {return User.hasPermission("df-report-view") || User.hasPermission("df-customs-view") },
                component: CustomerReport,
                meta: { type: 'menu-item', title: 'Customer Report', icon: 'receipt-text',
                    isActive: false, middleware: [Auth]  }
            },
            {
                path: '/report/customerReportMerchantView',
                name: 'CustomerReportMerchantView',
                isVisible: () => {return User.hasPermission("df-merchant-data-view") && !User.hasSuperPermission()},
                component: CustomerReportMerchantView,
                meta: { type: 'menu-item', title: 'Customer Report', icon: 'receipt-text',
                    isActive: false, middleware: [Auth]  }
            },
            {
                path: '/report/Requests',
                name: 'RequestReport',
                isVisible: () => {return User.hasPermission("df-lankapay-report-view")},
                component: RequestReport,
                meta: { type: 'menu-item', title: 'Request Report', icon: 'receipt-text',
                    isActive: false, middleware: [Auth]  }
            },

            {
                path: '/report/merchant',
                name: 'MerchantReport',
                isVisible: () => {return User.hasPermission("df-report-view")},
                component: MerchantReport,
                meta: { type: 'menu-item', title: 'Merchant Report', icon: 'receipt-text',
                    isActive: false, middleware: [Auth]  }
            }
        ]
    },
]


export default routes

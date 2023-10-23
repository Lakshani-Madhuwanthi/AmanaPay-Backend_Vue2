import Layout from "@/layout";
import Auth from "@/middlewares/auth";
import User from "@/mixins/modules/authMixins";
import Dashboard_Dutyfree from "@/views/Dashboard_Dutyfree/Dashboard";
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
import AppUserList from "@/views/AppUser/AppUserList";
import AppVersionList from "@/views/AppVersion/AppVersionList";
import AppVersionCreate from "@/views/AppVersion/AppVersionCreate";
import IPGProviderList from "@/views/IPGProvider/IPGProviderList";
import AdvertisementList from "@/views/Advertisement/AdvertisementList";
import AdvertisementCreate from "@/views/Advertisement/AdvertisementCreate";
import AdvertisementEdit from "@/views/Advertisement/AdvertisementEdit";
import KYC from "@/views/KYC/KYC";
import BillTransactions from "@/views/Reports/BillTransactions";
import CeftTransactions from "@/views/Reports/CeftTransactions";
import ThyagaTransactions from "@/views/Reports/ThyagaTransactions";
import InsuranceTransactions from "@/views/Reports/InsuranceTransactions";
import EChannellingTransactions from "@/views/Reports/EChannellingTransactions";
import ActivityLogs from "@/views/Reports/ActivityLogs";

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
                path: '/dashboard/dutyfree/ministry',
                name: 'DashboardDFMinistry',
                component: Dashboard_Dutyfree,
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
                path: '/provider',
                name: 'IPGProvider',
                isVisible: () => {return User.hasPermission("ipg-provider-view")},
                component: IPGProviderList,
                meta: { type: 'menu-item', title: 'IPG Providers', icon: 'home', isActive: false, middleware: [Auth]  }
            },
            {
                path: '/advertisements',
                name: 'Advertisements',
                isVisible: () => {return User.hasPermission("advertisement-view")},
                component: AdvertisementList,
                meta: { type: 'menu-item', title: 'Advertisements', icon: 'television-classic', isActive: false, middleware: [Auth]  }
            },
            {
                path: '/advertisements/create',
                name: 'CreateAdvertisement',
                component: AdvertisementCreate,
                meta: { type: '', isActive: false, middleware: [Auth]  }
            },
            {
                path: '/advertisements/edit/:id',
                name: 'EditAdvertisement',
                component: AdvertisementEdit,
                meta: { type: '', isActive: false, middleware: [Auth]  }
            },
            {
                path: '/appUsers',
                name: 'AppUser',
                isVisible: () => {return User.hasPermission("app-user-view")},
                component: AppUserList,
                meta: { type: 'menu-item', title: 'App Users', icon: 'account-card-outline', isActive: false, middleware: [Auth]  }
            },
            {
                path: '/appVersions',
                name: 'AppVersion',
                isVisible: () => {return User.hasPermission("app-version-view")},
                component: AppVersionList,
                meta: { type: 'menu-item', title: 'App Versions', icon: 'cellphone-play', isActive: false, middleware: [Auth]  }
            },
            {
                path: '/appVersions/create',
                name: 'AppVersionCreate',
                component: AppVersionCreate,
                meta: { type: '', isActive: false, middleware: [Auth]  }
            },
        ]
        },
        {
            path: '/KYC',
            component: Layout,
            isVisible: () => {return User.hasPermission("kyc-view")},
            redirect: 'KYC',
            meta: { type: 'menu', icon: 'account-check',
                title: 'KYC', isActive: false},
            children: [
                {
                    path: '/KYC',
                    name: 'KYC',
                    component: KYC,
                    meta: { type: '', icon: 'account-check', title: 'KYC',
                        isActive: false, middleware: [Auth]}
                }
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
                path: '/transaction/bill',
                name: 'BillTransaction',
                isVisible: () => {return User.hasPermission("bill-payment-report-view")},
                component: BillTransactions,
                meta: { type: 'menu-item', title: 'Bill Transactions', icon: 'receipt-text',
                    isActive: false, middleware: [Auth]  }
            },
            {
                path: '/transaction/ceft',
                name: 'CEFTTransaction',
                isVisible: () => {return User.hasPermission("send-money-report-view")},
                component: CeftTransactions,
                meta: { type: 'menu-item', title: 'Send Money Transactions', icon: 'cash-fast',
                    isActive: false, middleware: [Auth]  }
            },
            {
                path: '/transaction/thyaga',
                name: 'ThyagaTransaction',
                isVisible: () => {return User.hasPermission("thyaga-report-view")},
                component: ThyagaTransactions,
                meta: { type: 'menu-item', title: 'Thyaga Transactions', icon: 'gift',
                    isActive: false, middleware: [Auth]  }
            },
            {
                path: '/transaction/eChannelling',
                name: 'EChannellingTransaction',
                isVisible: () => {return User.hasPermission("echannelling-report-view")},
                component: EChannellingTransactions,
                meta: { type: 'menu-item', title: 'EChannelling Transactions', icon: 'medical-bag',
                    isActive: false, middleware: [Auth]  }
            },
            {
                path: '/transaction/insurance',
                name: 'InsuranceTransaction',
                isVisible: () => {return User.hasPermission("insurance-report-view")},
                component: InsuranceTransactions,
                meta: { type: 'menu-item', title: 'Insurance Transactions', icon: 'account-child',
                    isActive: false, middleware: [Auth]  }
            },
            {
                path: '/activityLogs',
                name: 'ActivityLogs',
                isVisible: () => {return User.hasPermission("activity-log-report-view")},
                component: ActivityLogs,
                meta: { type: 'menu-item', title: 'Activity Log Report', icon: 'format-list-text', isActive: false, middleware: [Auth]  }
            },
        ]
    },
]


export default routes

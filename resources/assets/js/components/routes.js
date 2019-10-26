import React from 'react';

// User Management
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import UserList from './users/Userlist'
import ProductList from './products/ProductList'
import Kanban from './Kanban'
import Calendar from './calendar/Calendars'
import Roles from './roles/Roles'
import Invoice from './invoice/Invoice'
import Brands from './brands/Brands'
import Categories from './categories/Categories'
import Customers from './customers/Customers'
import Departments from './departments/Departments'
import ChatPage from './chat/ChatPage'
import Login from './Login'
import Dashboard from './Dashboard'
import Message from './activity/MessageContainer'
import UserProfile from './users/UserProfile'
import TaskStatus from './taskStatus/statusList'
import Permissions from './permissions/Permissions'

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
    {path: '/customers', name: 'Customers', component: Customers},
    {path: '/users', exact: true, name: 'Users', component: UserList},
    {path: '/products', name: 'Products', component: ProductList},
    {path: '/kanban/projects', name: 'Projects', component: Kanban},
    {path: '/kanban/leads', name: 'Leads', component: Kanban},
    {path: '/kanban/deals', name: 'Deals', component: Kanban},
    {path: '/calendar', exact: true, name: 'Calendar', component: Calendar},
    {path: '/roles', name: 'Roles', component: Roles},
    {path: '/invoice', name: 'Invoice', component: Invoice},
    {path: '/brands', name: 'Brands', component: Brands},
    {path: '/categories', name: 'Categories', component: Categories},
    {path: '/departments', name: 'Departments', component: Departments},
    {path: '/chat', name: 'Chat', component: ChatPage},
    {path: '/activity', name: 'Activity', component: Message},
    {path: '/statuses', name: 'Task Statuses', component: TaskStatus},
    {path: '/permissions', name: 'Permissions', component: Permissions},
    {path: '/', name: 'Dashboard', component: Dashboard},
    // {path: '/base/list-groups', name: 'List Groups', component: ListGroups},
    // {path: '/base/navbars', name: 'Navbars', component: Navbars},
    // {path: '/base/navs', name: 'Navs', component: Navs},
    // {path: '/base/paginations', name: 'Paginations', component: Paginations},
    // {path: '/base/popovers', name: 'Popovers', component: Popovers},
    // {path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar},
    // {path: '/base/tooltips', name: 'Tooltips', component: Tooltips},
    // {path: '/buttons', exact: true, name: 'Buttons', component: Buttons},
    // {path: '/buttons/buttons', name: 'Buttons', component: Buttons},
    // {path: '/buttons/button-dropdowns', name: 'Button Dropdowns', component: ButtonDropdowns},
    // {path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups},
    // {path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons},
    // {path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons},
    // {path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons},
    // {path: '/icons/flags', name: 'Flags', component: Flags},
    // {path: '/icons/font-awesome', name: 'Font Awesome', component: FontAwesome},
    // {path: '/icons/simple-line-icons', name: 'Simple Line Icons', component: SimpleLineIcons},
    // {path: '/notifications', exact: true, name: 'Notifications', component: Alerts},
    // {path: '/notifications/alerts', name: 'Alerts', component: Alerts},
    // {path: '/notifications/badges', name: 'Badges', component: Badges},
    // {path: '/notifications/modals', name: 'Modals', component: Modals},
    // {path: '/widgets', name: 'Widgets', component: Widgets},
    // {path: '/charts', name: 'Charts', component: Charts},
    // {path: '/users', exact: true, name: 'Users', component: Users},
    // {path: '/features', exact: true, name: 'Features', component: Features},
    // {path: '/organisations', exact: true, name: 'Organisations', component: Organisations},
    // {path: '/organisation-units', exact: true, name: 'Organisation Units', component: OrganisationUnits},
    // {path: '/roles', exact: true, name: 'Roles', component: Roles},
    // {path: '/applications', exact: true, name: 'Applications', component: Applications}
    // { path: '/users/:id', exact: true, name: 'User Details', component: User },
];

export default routes;
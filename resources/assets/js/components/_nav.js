export default {
    items: [

        {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'fa fa-dashboard'
        },

        {
            name: 'Activity',
            url: '/activity',
            icon: 'fa fa-dashboard'
        },

        {
            name: 'User Management',
            icon: 'fa fa-dashboard',
            children: [
                {
                    name: 'Employees',
                    url: '/users',
                    icon: 'fa fa-user'
                },

                {
                    name: 'Departments',
                    url: '/departments',
                    icon: 'fa fa-sitemap'
                },

                {
                    name: 'Roles',
                    url: '/roles',
                    icon: 'fa fa-chain-broken'
                },

                {
                    name: 'Permissions',
                    url: '/permissions',
                    icon: 'fa fa-list-alt'
                },
            ]
        },

        {
            name: 'Brands',
            url:
                '/brands',
            icon:
                'fa fa-building'
        }
        ,

        {
            name: 'Categories',
            url:
                '/categories',
            icon:
                'fa fa-building'
        }
        ,

        {
            name: 'Task Statuses',
            url:
                '/statuses',
            icon:
                'fa fa-building'
        }
        ,

        {
            name: 'Tasks',
            icon: 'fa fa-chain-broken',
            children: [
                {
                    name: 'Projects',
                    url:
                        '/kanban/projects',
                    icon:
                        'fa fa-chain-broken'
                },
                {
                    name: 'Leads',
                    url:
                        '/kanban/leads',
                    icon:
                        'fa fa-chain-broken'
                }
                ,

                {
                    name: 'Deals',
                    url:
                        '/kanban/deals',
                    icon:
                        'fa fa-chain-broken'
                }
            ]
        },


        {
            name: 'Products',
            url:
                '/products',
            icon:
                'fa fa-chain-broken'
        }
        ,

        {
            name: 'Customers',
            url:
                '/customers',
            icon:
                'fa fa-chain-broken'
        }
        ,

        {
            name: 'Invoice',
            url:
                '/invoice',
            icon:
                'fa fa-chain-broken'
        }
        ,

        {
            name: 'Calendar',
            url:
                '/calendar',
            icon:
                'fa fa-chain-broken'
        }
        ,

        {
            name: 'Chat',
            url:
                '/chat',
            icon:
                'fa fa-chain-broken'
        }
        ,
    ]
}
;
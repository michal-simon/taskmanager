import React, { Component, Suspense } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';
import PrivateRoute from '../../PrivateRoute'

import {
    AppAside,
    AppFooter,
    AppHeader,
    AppSidebar,
    AppSidebarFooter,
    AppSidebarForm,
    AppSidebarHeader,
    AppSidebarMinimizer,
    AppBreadcrumb2 as AppBreadcrumb,
    AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';
import DefaultAside from "./DefaultAside";
import DefaultFooter from "./DefaultFooter";
import DefaultHeader from "./DefaultHeader";

class DefaultLayout extends Component {

    signOut(e) {
        e.preventDefault()
        this.props.history.push('/login')
    }

    render() {
        return (
            <div className="app">
                <AppHeader fixed>
                    <Suspense>
                        <DefaultHeader onLogout={e=>this.signOut(e)}/>
                    </Suspense>
                </AppHeader>
                <div className="app-body">
                    <AppSidebar fixed display="lg">
                        <AppSidebarHeader />
                        <AppSidebarForm />
                        <Suspense>
                            <AppSidebarNav navConfig={navigation} {...this.props} router={router}/>
                        </Suspense>
                        <AppSidebarFooter />
                        <AppSidebarMinimizer />
                    </AppSidebar>
                    <main className="main">
                        <AppBreadcrumb appRoutes={routes} router={router}/>
                        <Container fluid>
                            <Suspense>
                                <Switch>
                                    {routes.map((route, idx) => {
                                        return route.component ? (
                                            <PrivateRoute
                                                key={idx}
                                                path={route.path}
                                                exact={route.exact}
                                                name={route.name}
                                                component={route.component}
                                                render={props => (
                                                    <route.component {...props} />
                                                )} />
                                        ) : (null);
                                    })}
                                    <Redirect from="/" to="/dashboard" />
                                </Switch>
                            </Suspense>
                        </Container>
                    </main>
                    <AppAside fixed>
                        <Suspense>
                            <DefaultAside />
                        </Suspense>
                    </AppAside>
                </div>
                <AppFooter>
                    <Suspense>
                        <DefaultFooter />
                    </Suspense>
                </AppFooter>
            </div>
        );
    }
}

export default DefaultLayout;
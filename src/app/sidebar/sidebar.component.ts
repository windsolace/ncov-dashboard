import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    isExternal: boolean;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',     title: 'Dashboard',         icon:'nc-chart-bar-32',       class: '', isExternal:false },
    { path: 'https://sgwuhan.xose.net/',          title: 'Map',              icon:'nc-pin-3',      class: '', isExternal:true },
    { path: 'https://github.com/CSSEGISandData/COVID-19',          title: 'Data Source',              icon:'nc-app',      class: '', isExternal:true },
    { path: '/about',         title: 'About',             icon:'nc-alert-circle-i',    class: '', isExternal:false },
    // { path: '/notifications', title: 'Notifications',     icon:'nc-bell-55',    class: '', isExternal:true },
    // { path: '/user',          title: 'User Profile',      icon:'nc-single-02',  class: '', isExternal:true },
    // { path: '/table',         title: 'Table List',        icon:'nc-tile-56',    class: '', isExternal:true },
    // { path: '/typography',    title: 'Typography',        icon:'nc-caps-small', class: '', isExternal:true },
    // { path: '/upgrade',       title: 'Upgrade to PRO',    icon:'nc-spaceship',  class: 'active-pro', isExternal:true },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}

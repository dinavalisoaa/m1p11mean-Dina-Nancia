import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppLayoutComponent } from 'src/app/layout/app.layout.component';
import { AuthGuardPermission } from '../manager/auth-permission';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'login',
                loadChildren: () =>
                    import('./login/login.module').then((m) => m.LoginModule),
            },
            {
                path: 'registration',
                loadChildren: () =>
                    import('./registration/registration.module').then(
                        (m) => m.RegistrationModule
                    ),
            },
            {
                path: 'appointment',
                loadChildren: () =>
                    import('./registration/registration.module').then(
                        (m) => m.RegistrationModule
                    ),
            },
            {
                path: '',
                component: AppLayoutComponent,
                children: [
                    {
                        path: 'preference',
                        canActivate: [AuthGuardPermission],
                        data: {
                            role: 'CUSTOMER',
                        },
                        loadChildren: () =>
                            import('./preference/preference.module').then(
                                (m) => m.PreferenceModule
                            ),
                    },
                    {
                        path: 'appointment/making',
                        canActivate: [AuthGuardPermission ],
                        data: {
                            role: 'CUSTOMER',
                        },
                        loadChildren: () =>
                            import('./appointment/appointment.module').then(
                                (m) => m.AppointmentModule
                            ),
                    },
                    {
                        path: 'profile',
                        canActivate: [AuthGuardPermission ],
                        data: {
                            role: 'CUSTOMER',
                        },
                        loadChildren: () =>
                            import('./profile/profile.module').then(
                                (m) => m.ProfileModule
                            ),
                    },
                    {
                        path: 'account/load',
                        canActivate: [AuthGuardPermission ],
                        data: {
                            role: 'CUSTOMER',
                        },
                        loadChildren: () =>
                            import('./account/account.module').then(
                                (m) => m.AccountDemoModule
                            ),
                    },
                    {
                        path: 'account/list',
                        canActivate: [AuthGuardPermission ],
                        data: {
                            role: 'CUSTOMER',
                        },
                        loadChildren: () =>
                            import('./list-account/list-account.module').then(
                                (m) => m.ListAccountModule
                            ),
                    },
                    {
                        path: 'appointment/making',
                        canActivate: [AuthGuardPermission ],
                        data: {
                            role: 'CUSTOMER',
                        },
                        loadChildren: () =>
                            import('./appointment/appointment.module').then(
                                (m) => m.AppointmentModule
                            ),
                    },
                    {
                        path: 'appointment/history',
                        canActivate: [AuthGuardPermission ],
                        data: {
                            role: 'CUSTOMER',
                        },
                        loadChildren: () =>
                            import('./history/history.module').then(
                                (m) => m.HistoryModule
                            ),
                    },
                    {
                        path: 'notifications',
                        canActivate: [AuthGuardPermission ],
                        data: {
                            role: 'CUSTOMER',
                        },
                        loadChildren: () =>
                            import('./notification/notification.module').then(
                                (m) => m.NotificationModule
                            ),
                    }
                ],
            },
        ]),
    ],
    exports: [RouterModule],
})
export class CustomerRoutingModule {}

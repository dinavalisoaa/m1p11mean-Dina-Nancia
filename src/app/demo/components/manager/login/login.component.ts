import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Manager } from 'src/app/models/models';
import { ManagerService } from 'src/app/service/manager/manager.service';
import { UtilService } from 'src/app/service/util-service/util.service';

@Component({
    selector: 'app-login-manager',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .p-password input {
                width: 100%;
                padding: 1rem;
            }

            :host ::ng-deep .pi-eye {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }

            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
})
export class LoginComponent {
    // valCheck: string[] = ['remember'];
    password: string = 'root';
    email: string = 'admin@nova.com';

    constructor(
        public layoutService: LayoutService,
        public managerService: ManagerService,
        public utilService: UtilService,
        public router: Router
    ) {}
    login() {
        const password = this.password;
        const email = this.email;
        const data: Manager = {
            password,
            email,
        };
        this.managerService.loginManager(data, (res) => {
            console.log(this.utilService.getToken());
            this.utilService.navigateTo('/manager/reservation');
        });
    }
}

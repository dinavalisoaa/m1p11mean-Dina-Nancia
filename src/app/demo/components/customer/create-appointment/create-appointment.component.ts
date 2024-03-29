import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Customer, Representative } from 'src/app/demo/api/customer';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { AccountService } from 'src/app/service/account/account.service';
import { UtilService } from 'src/app/service/util-service/util.service';
import {
    Account,
    Appointment,
    Service,
    TokenObject,
} from 'src/app/models/models';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Router } from '@angular/router';
import { AppointmentService } from 'src/app/service/appointment/appointment.service';
import { ServiceService } from 'src/app/service/service/service.service';
import { DataView } from 'primeng/dataview';
import Swal from 'sweetalert2';
import { CustomerService } from 'src/app/service/customer/customer.service';

@Component({
    selector: 'app-create-appointment',
    templateUrl: './create-appointment.component.html',
    providers: [MessageService, ConfirmationService],
    styles: [
        `
            :host ::ng-deep .p-frozen-column {
                font-weight: bold;
            }

            :host ::ng-deep .p-datatable-frozen-tbody {
                font-weight: bold;
            }

            :host ::ng-deep .p-progressbar {
                height: 0.5rem;
            }
        `,
    ],
})
export class CreateAppointmentComponent implements OnInit {
    appointment: Appointment = {};
    @Input() date: Date = new Date();
    filledAppointment: Appointment = {};
    showallServices: Service[] = [];
    @Input() display: boolean = false;
    visiblePay: boolean = false;
    allServices: Service[] = [];
    state: string = '';
    total: number = 0;
    showService: any = [];

    @Input() servicesFilled: Service[] = [];

    // service:Service={};
    click(service: Service) {}

    getDistinct(array: Service[]) {
        this.fetchService();
        let idtab = [...new Set(array.map((item) => item._id))];
        // if (this.isSetCart()) {
        //     this.servicesFilled = this.utilService.getCart().service;
        // }


        return [...new Set(array.map((item) => item._id))];
    }

    saveService(service: Service) {
        this.servicesFilled.push(service);

        let ap: Appointment = {};
        ap.date = this.date;
        ap.service = this.servicesFilled;

        this.utilService.saveCart(ap);
        this.showService = this.getDistinct(this.servicesFilled);
        this.total = this.totalize();
    }

    getCurrence(item: any) {
        let count = this.servicesFilled.reduce(
            (acc, cur) => (cur._id == item ? ++acc : acc),
            0
        );
        return count;
    }

    choose() {
        this.display = true;
    }

    trashService(service: Service) {
        // console.log(service);
        //recherche d'object correspond a l'ID
        let object = this.servicesFilled.filter(
            (val, index) => val._id == service
        );
        //recherche d'index correspond a l'object

        let index = this.servicesFilled.indexOf(object[0]);

        // suppression de l'object correspondant a l'index
        this.servicesFilled.splice(index, 1);
        if(this.servicesFilled.length==0){
            this.date=new Date();
        }
        let ap: Appointment = {};
        ap.date = this.date;
        ap.service = this.servicesFilled;
        this.utilService.saveCart(ap);
        this.total = this.totalize();


        // Swal.fire(.toString());
        // ;
    }

    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }

    constructor(
        public layoutService: LayoutService,
        public router: Router,
        private productService: ProductService,
        public utilService: UtilService,
        public serviceService: ServiceService,
        private appointmentService: AppointmentService,
        private accountService: AccountService,
        // private service: MessageService,
        private customerService: CustomerService
    ) {}

    format(date: any) {
        return this.utilService.toDateFr(date);
    }

    fetchService() {
        this.serviceService.getService('', (res) => {
            this.allServices = res;
            console.log(this.allServices);
        });
    }

    getObjectService(service: any) {
        return this.allServices.filter((va, index) => va._id == service)[0];
    }

    isSetCart() {
        return (
            this.utilService.getCart().date != null &&
            this.utilService.getCart().date != '' &&
            this.utilService.getCart().date != undefined
        );
    }

    totalize() {
        let sum = 0;
        this.servicesFilled.forEach((element) => {
            if (element.price != undefined) {
                sum += element.price;
            }
        });
        return sum;
    }

    getToken() {
        const token: TokenObject = this.utilService.getToken();
        return token;
    }

    getName() {
        const token: TokenObject = this.getToken();
        if (token.userId != null) {
            return token?.info?.name;
        }
        return undefined;
    }

    pay() {


        const token: TokenObject = this.utilService.getToken();
        const account: Account = {};
        account.customer = token.info;
        account.date = new Date();
        account.description = 'Prise de rendez-vous';
        account.debit = this.total;
        account.credit = 0;
        this.filledAppointment.duration=this.getDurations(this.filledAppointment);
        this.filledAppointment.date=this.utilService.getRealDate(this.date);

        // Swal.fire( this.filledAppointment.date.toISOString());
        this.accountService.saveAccountTransaction(
            account,
            this.filledAppointment,
            (res) => {
                this.servicesFilled = [];
                this.utilService.saveCart([]);
                this.date=new Date();
                this.showService = [];
            }
        );
//
        this.fetchService();

        this.visiblePay = false;
        this.appointment = {};
    }
    getDurations(app: Appointment) {
        let som = 0;
        app?.service?.forEach((val, index) => {
            if (val?.duration != undefined) {
                som +=val?.duration;
            }
        });
        return som;
    }

    logged() {
        const token: TokenObject = this.getToken();
        if (token.userId != null && token.role == 'CUSTOMER') {
            return true;
        }
        return false;
    }

    saveNoPay() {
        if (!this.logged()) {
            this.utilService.navigateToByUrl(
                '/customer/login?after=appointment'
            );
            Swal.fire({
                icon: 'error',
                title: 'Message',
                text: 'Vous devez avoir un compte',
                footer: '',
            });
        }
        this.visiblePay = true;
        this.appointment.date = this.date;

        const data: Appointment = {};
        data.date = this.utilService.getRealDate(this.appointment.date);
        const token: TokenObject = this.utilService.getToken();
        data.customer = token.info;
        data.service = this.servicesFilled;
        data.status = 0;
        this.filledAppointment = data;
        this.visiblePay = true;
        this.total = this.totalize();
        let account = 0;
        this.accountService.getAccountState(token.info._id, (res) => {
            account = res[0].total_credit - res[0].total_debit;
            this.state = this.utilService.formatted(account);
            if (account < this.total) {
                // this.show = true;
            }
        });
    }
    formattAr(montant: any) {
        return this.utilService.format(montant);
    }

    dot(ele1: any, ele2: any) {
        if (ele1 == undefined || ele2 == undefined) return 0;
        return ele1 * ele2;
    }

    ngOnInit() {
        if (this.isSetCart()) {
            this.servicesFilled = this.utilService.getCart().service;
            this.date=new Date(this.utilService.getCart().date.toString().split("T")[0]);
        }
        this.showService = this.getDistinct(this.servicesFilled);
        this.total = this.totalize();

        this.fetchService();

        // this.servicesFilled = [];
    }
}

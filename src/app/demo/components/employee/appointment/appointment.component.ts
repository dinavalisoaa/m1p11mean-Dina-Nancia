import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { Appointment, Customer, Service } from 'src/app/models/models';
import { AppointmentService } from 'src/app/service/appointment/appointment.service';
import { CustomerService } from 'src/app/service/customer/customer.service';
import { ServiceService } from 'src/app/service/service/service.service';
import { UtilService } from 'src/app/service/util-service/util.service';
import { MegaMenuItem, MenuItem } from 'primeng/api';

@Component({
    templateUrl: './appointment.component.html',
})
export class AppointmentComponent implements OnInit {
    products: Product[] = [];
    dialog: Boolean = false;
    currentFilter: any = {};
    name: string = '';
    sortOptions: SelectItem[] = [];
    statusOptions: SelectItem[] = [];
    routeItems!: MenuItem[];

    sortOrder: number = 0;
    date: any = '';
    availableProducts: Product[] = [];

    selectedProducts: Product[] = [];

    draggedProduct: Product | undefined | null = {};
    draggedProduct1: Product | undefined | null;
    sortField: string = '';

    sourceCities: any[] = [];

    targetCities: any[] = [];
    filteredCustomers: any[] = [];
    orderCities: any[] = [];
    selectedCustomers: any[] = [];
    selectedServices: any[] = [];
    appointments: Appointment[] = [];
    customers: Customer[] = [];
    services: Service[] = [];
    constructor(
        private productService: ProductService,
        private appointmentService: AppointmentService,
        private customersService: CustomerService,
        private serviceService: ServiceService,
        private uService: UtilService
    ) {}
    showService(appointment: Appointment) {
        let str = '';
        if (appointment.service != undefined)
            appointment.service.forEach((element) => {
                str += element.name + ' & \n ';
            });
        return str;
    }
    showDiag() {
        this.dialog = true;
    }
    format(date: any) {
        return this.uService.toDateFr(date);
    }
    filterByValue(val: Appointment[], value: any) {
        return val.filter((appointment) =>
            appointment.customer?.name
                ?.toLowerCase()
                .includes(value.toLowerCase())
        );
    }
    onSort(val: Appointment[]) {
        return val.sort(function (a, b) {
            let number = 0;
            if (a.date != undefined && b.date != undefined) {
                let un = new Date(a.date);
                let two = new Date(a.date);
                number = un.getTime() - two.getTime();
            }
            return number;
        });
    }
    getAppoints() {
        this.appointmentService.getAppointment('', {}, (res) => {
            this.appointments = res;
            console.log(res);
        });
    }
    setService() {
        this.serviceService.getService('', (res) => {
            this.services = res;
        });
    }
    setCustomer() {
        this.customersService.getCustomer('', (res) => {
            this.customers = res;
            console.log(this.customers);
        });
    }
    ngOnInit() {
        this.setCustomer();
        this.setService();
        this.getAppoints();
        this.selectedProducts = [];
        this.availableProducts = [
            { id: '1', name: 'Black Watch' },
            { id: '2', name: 'Bamboo Watch' },
        ];
        this.sortOptions = [
            { label: 'Plus ancien', value: '!date' },
            { label: 'Plus recent', value: 'date' },
        ];
        this.statusOptions = [
            { label: 'Choisir', value: '-1' },
            { label: 'Nouveau', value: '0' },
            { label: 'En cours', value: '1' },
            { label: 'Fini', value: '2' },
        ];
        this.routeItems = [
            { label: 'Nouveau', routerLink: '/state/0' },
            { label: 'En cours', routerLink: '/state=1' },
            { label: 'Fini', routerLink: '/?state=2' },
        ];
    }
    findByStatus(val: Appointment[], value: any) {
        return val.filter((appointment) => appointment.status == value);
    }

    onStatusChange(event: any) {
        console.log('KKKKKKKKKK' + event.value);
        this.appointmentService.getAppointment(
            '',
            this.currentFilter,
            (res) => {
                if (event.value != -1) {
                    this.appointments = this.findByStatus(res, event.value);
                } else {
                    this.appointments = res;
                }
            }
        );
    }
    onSortChange(event: any) {
        // this.onSort(this.appointments);
        const value = event.value;
        // this.appointments = this.filterByValue('dina');
        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }
    hideDialog() {
        this.dialog = false;
    }
    filterCustomer(event: any) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.customers.length; i++) {
            const country = this.customers[i];
            if (country?.name?.toLowerCase().includes(query.toLowerCase())) {
                filtered.push(country);
            }
        }

        this.filteredCustomers = filtered;
    }
    filter() {
        const filter: any = {};
        filter.service = this.selectedServices;
        if (this.selectedCustomers.length != 0) {
            filter.customer = this.selectedCustomers;
        }
        // console.log("KKKKKKKKKKKKKKKKK"+this.selectedCustomers.length);
        filter.date = this.date;
        this.currentFilter = filter;

        this.appointmentService.getAppointment('', filter, (res) => {
            this.appointments = res;
            this.hideDialog();
        });
    }
    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }

    dragStart(product: Product) {
        this.draggedProduct = product;
    }

    drop() {
        if (this.draggedProduct) {
            let draggedProductIndex = this.findIndex(this.draggedProduct);
            this.selectedProducts = [
                ...(this.selectedProducts as Product[]),
                this.draggedProduct,
            ];
            this.availableProducts = this.availableProducts?.filter(
                (val, i) => i != draggedProductIndex
            );
            this.draggedProduct = null;
        }
    }

    dragEnd1() {
        this.draggedProduct1 = null;
    }
    dragStart1(product:  Product | null | undefined) {
        this.draggedProduct1 = product;
        console.log(product);
    }

    drop1() {
        if (this.draggedProduct) {
            let draggedProductIndex = this.findIndex1(this.draggedProduct);
            this.availableProducts = [
                ...(this.availableProducts as Product[]),
                this.draggedProduct,
            ];
            this.selectedProducts = this.selectedProducts?.filter(
                (val, i) => i != draggedProductIndex
            );
            this.draggedProduct = null;
        }
    }
    dropAll(
        sourceList: Product[],
        targetList: Product[],
        draggedProduct: Product | null | undefined
    ) {
        if (sourceList != undefined && draggedProduct != undefined) {
            // if (this.draggedProduct)
            {
                console.log(sourceList.length);
                // sourceList.forEach(element => {
                //     console.log(element);
                // });
        // console.log(sourceList+"111<<<");

                let draggedProductIndex = this.findIndexInSource(
                    draggedProduct,
                    sourceList
                );

                targetList = [...(targetList as Product[]), draggedProduct];
                // console.log("..."+targetList.length+"...");

                sourceList = sourceList?.filter(
                    (val, i) => i != draggedProductIndex
                );
            }
        }
    }

    dragEnd() {
        this.draggedProduct = null;
    }

    findIndexInSource(product: Product, sourceList: Product[]) {
        let index = -1;
        for (let i = 0; i < (sourceList as Product[]).length; i++) {
            if (product.id === (sourceList as Product[])[i].id) {
                index = i;
                break;
            }
        }
        return index;
    }
    findIndex(product: Product) {
        let index = -1;
        for (let i = 0; i < (this.availableProducts as Product[]).length; i++) {
            if (product.id === (this.availableProducts as Product[])[i].id) {
                index = i;
                break;
            }
        }
        return index;
    }
    findIndex1(product: Product) {
        let index = -1;
        for (let i = 0; i < (this.selectedProducts as Product[]).length; i++) {
            if (product.id === (this.selectedProducts as Product[])[i].id) {
                index = i;
                break;
            }
        }
        return index;
    }
}

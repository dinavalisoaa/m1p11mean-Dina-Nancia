import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { EmployeeService } from 'src/app/service/employee/employee.service';
import { SexService } from 'src/app/service/sex/sex.service';
import { UtilService } from 'src/app/service/util-service/util.service';

@Component({
    templateUrl: './workingtime.component.html',
    providers: [MessageService]
})
export class WorkingTimeComponent implements OnInit {

    selectedState: any;

    dropdownItems = [
        { name: 'Homme', code: 'Homme' },
        { name: 'Femme', code: 'Femme' }
    ];

    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[] = [];

    product: Product = {};

    ///////////////////////////////////////////////////////////

    confirmationPassword: any;

    entry: any;

    exit: any;

    selectedSex: any;

    dropdownSexes: [] = [];

    personnelDialog: boolean = false;

    editPersonnelDialog: boolean = false;

    deletePersonnelDialog: boolean = false;

    lists: [] = [];

    personnel: any = {};

    submitted: boolean = false;

    entryTimePart: any;

    exitTimePart: any;

    ///////////////////////////////////////////////////////////

    selectedProducts: Product[] = [];

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private employeeService: EmployeeService,
        private sexService: SexService,
        public utilService: UtilService
    ) { }

    ngOnInit() {
        this.productService.getProducts().then(data => this.products = data);

        ///////////////////////////////////////////////////////////
        this.fetchPersonnelWorkingTime();
        this.fetchSexes();

        // if(this.personnel != null){
        //     console.log("diff null" + this.personnel.schedule.entry);
        //     this.entryTimePart = this.utilService.getTimeFromDate(this.personnel.schedule.entry);
        // }
        ///////////////////////////////////////////////////////////

        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }

    ///////////////////////////////////////////////////////////

    checkStatus(status: number) {
        let res: { type: any, message: string } = { type: "success", message: "Actif" };
        if(status == 0){
            res = { type: "danger", message: "Passif" };
        }
        return res;
    }

    fetchPersonnelWorkingTime() {
        this.employeeService.getEmployeesWorkingTime((res) => {
            this.lists = res;
        });
    }

    fetchSexes() {
        this.sexService.getAllSexes((res) => {
            console.log({res});
            this.dropdownSexes = res;
        });
    }

    openNewDialog() {
        this.personnel = {};
        this.submitted = false;
        this.personnelDialog = true;
    }

    editPersonnel(personnel: any) {
        this.personnel = { ...personnel };
        this.entryTimePart = this.utilService.getTimeFromDate(this.personnel.schedule.entry);
        this.exitTimePart = this.utilService.getTimeFromDate(this.personnel.schedule.exit);
        this.editPersonnelDialog = true;
    }

    deletePersonnel(personnel: any) {
        this.deletePersonnelDialog = true;
        this.personnel = { ...personnel };
    }

    ///////////////////////////////////////////////////////////

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(val => !this.selectedProducts.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedProducts = [];
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.products = this.products.filter(val => val.id !== this.product.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        this.product = {};
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.product.name?.trim()) {
            if (this.product.id) {
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value : this.product.inventoryStatus;
                this.products[this.findIndexById(this.product.id)] = this.product;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                this.product.id = this.createId();
                this.product.code = this.createId();
                this.product.image = 'product-placeholder.svg';
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus ? this.product.inventoryStatus.value : 'INSTOCK';
                this.products.push(this.product);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account, Appointment, Customer } from 'src/app/models/models';
import { CheckError } from '../util-service/error';
import { API_URL, UtilService } from '../util-service/util.service';
import Swal from 'sweetalert2';
import { AppointmentService } from '../appointment/appointment.service';
const apiUrl = API_URL;

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    constructor(
        private http: HttpClient,
        private uService: UtilService,
        private appoint: AppointmentService
    ) {}
    // getState(val:number,id: string) {

    // }
    getAccount(query: any, next: (res: any) => any) {
        let h = new Headers();
        h.append('Authorization', this.uService.getToken().token);
        this.http
            .get(`${apiUrl}/api/accounts` + query, {
                headers: {
                    Authorization: this.uService.getToken().token,
                },
            })
            .subscribe(
                CheckError((res) => {
                    next(res);
                    close();
                })
            );
    }
    getAccountState(id: string, next: (res: any) => any) {
        this.http.get(`${apiUrl}/api/account/state?id=` + id).subscribe(
            CheckError((res) => {
                next(res);
                close();
            })
        );
    }
    saveAccount(data: Account, next: (res: any) => any) {
        console.log(data);
        this.http.post(`${apiUrl}/api/account`, data).subscribe(
            CheckError((res) => {
                next(res);
                // Swal.showLoading(Swal.getDenyButton())
                Swal.fire({
                    icon: 'success',
                    title: 'Message',
                    text: res.message,
                    footer: '',
                });

                close();
            })
        );
    }
    saveAccountTransaction(data: Account, appoint: Appointment, next: (res: any) => any) {
        console.log(data);
        this.http.post(`${apiUrl}/api/account`, data).subscribe(
            CheckError((res) => {
                next(res);
                // Swal.showLoading(Swal.getDenyButton())
                Swal.fire({
                    icon: 'success',
                    title: 'Message',
                    text: res.message,
                    footer: '',
                });
                appoint.isPaid=true;

                this.appoint.saveAppointment(appoint, (res) => {});
                return res;
                // close();
            })
        );
    }
    updateAccount(data: Account, param: any, next: (res: any) => any) {
        this.http.put(`${apiUrl}/api/account/` + param, data).subscribe(
            CheckError((res) => {
                next(res);
                close();
            })
        );
    }
}

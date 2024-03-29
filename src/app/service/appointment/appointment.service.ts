import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Appointment } from 'src/app/models/models';
import { API_URL, UtilService } from '../util-service/util.service';
import { CheckError } from '../util-service/error';
import { loadPage } from '../util-service/load';
import Swal from 'sweetalert2';

const apiUrl = API_URL;

@Injectable({
    providedIn: 'root',
})
export class AppointmentService {
    constructor(private http: HttpClient) {}
    getAppointment2(query: any, sort: Appointment, next: (res: any) => any) {
        loadPage();
        this.http.post(`${apiUrl}/api/appointments` + query, sort).subscribe(
            CheckError((res) => {
                next(res);
                Swal.close();
                // return res;
            })
        );
    }

    getAppointment(query: any, sort: Appointment, next: (res: any) => any) {
        // loadPage();
        this.http.post(`${apiUrl}/api/appointments` + query, sort).subscribe(
            CheckError((res) => {
                next(res);
                // Swal.close();
                // close();
            })
        );
    }
    getAppointmentByEmp(
        query: any,
        next: (res: any) => any
    ) {
        this.http
            .get(`${apiUrl}/api/appointment/state/` + query)
            .subscribe(
                CheckError((res) => {
                    next(res);
                })
            );
    }
    saveAppointment(data: Appointment, next: (res: any) => any) {
        this.http.post(`${apiUrl}/api/appointment`, data).subscribe(
            CheckError((res) => {
                next(res);
            })
        );
    }
    updateAppointment(data: Appointment, param: any, next: (res: any) => any) {
        this.http.put(`${apiUrl}/api/appointment/` + param, data).subscribe(
            CheckError((res) => {
                next(res);
            })
        );
    }
    patchAppointment(data: Appointment, param: any, next: (res: any) => any) {
        this.http.patch(`${apiUrl}/api/appointment/` + param, data).subscribe(
            CheckError((res) => {
                next(res);
            })
        );
    }
}

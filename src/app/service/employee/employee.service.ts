import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Employee, TokenObject } from 'src/app/models/models';
import { CheckError } from '../util-service/error';
import { API_URL, UtilService } from '../util-service/util.service';
import { closeLoad, loadPage } from '../util-service/load';

// const apiUrl = process.env.API_URL;
const apiUrl = API_URL;

@Injectable({
    providedIn: 'root',
})
export class EmployeeService {
    constructor(private http: HttpClient, public uService: UtilService) {}

    getEmployee(query: any, next: (res: any) => any) {
        loadPage();

        this.http.get(`${apiUrl}/api/employee` + query).subscribe(
            CheckError((res) => {
                next(res);
                closeLoad();
            })
        );
    }
    getOneEmployee(query: any, next: (res: any) => any) {
        loadPage();
        let h = new Headers();
        h.append('Authorization', this.uService.getToken().token);
        this.http
            .get(`${apiUrl}/api/employee/` + query)
            .subscribe(
                CheckError((res) => {
                    next(res);
                closeLoad();

                })
            );
    }

    saveEmployee(data: Employee, next: (res: any) => any) {
        loadPage();

        this.http.post(`${apiUrl}/api/employee`, data).subscribe(
            CheckError((res) => {
                next(res);
                closeLoad();

            })
        );
    }

    loginEmployee(data: Employee, next: (res: any) => any) {

        this.http.post(`${apiUrl}/api/employee/connection`, data).subscribe(
            CheckError((res) => {
                const data: TokenObject = {};
                data.token = res.token;
                data.userId = res.userId;
                data.role = res.role;
                data.info = res.info;
                data.expiration = res.expiration;
                this.uService.saveDataStorage(
                    `sessionId`,
                    JSON.stringify(data)
                );
                next(res);


            })
        );
    }

    updateEmployee(data: Employee, param: any, next: (res: any) => any) {
        loadPage();

        this.http.put(`${apiUrl}/api/employee/` + param, data).subscribe(
            CheckError((res) => {
                next(res);
                closeLoad();

            })
        );
    }

    getAllEmployees(next: (res: any) => any) {
        loadPage();
        this.http.get(`${apiUrl}/api/employees`).subscribe(
            CheckError((res) => {
                next(res);
                closeLoad();

            })
        );
    }

    getCommission(employeeId: any ,query: any, next: (res: any) => any) {
        let date = new HttpParams();
        Object.keys(query).forEach(key => {
            date = date.append(key, query[key]);
        });
        this.http
            .get(`${apiUrl}/api/employee/${employeeId}/commission`, { params: date })
            .subscribe(
            CheckError((res) => {
                next(res);
            })
        );
    }

    getEmployeesWorkingTime(next: (res: any) => any) {
        loadPage();
        this.http.get(`${apiUrl}/api/dashboard/employee/working-time/average`).subscribe(
            CheckError((res) => {
                next(res);
                closeLoad();
            })
        );
    }

    savePersonnel(data: any, next: (res: any) => any) {
        loadPage();
        this.http.post(`${apiUrl}/api/employee`, data).subscribe(
            CheckError((res) => {
                next(res);
            })
        );
    }

    updatePersonnel(data: any, id: any, next: (res: any) => any) {
        loadPage();

        this.http.put(`${apiUrl}/api/employee/` + id, data).subscribe(
            CheckError((res) => {
                next(res);
                closeLoad();

            })
        );
    }

    deactivatePersonnel(id: any, next: (res: any) => any) {
        loadPage();
        this.http
            .put(`${apiUrl}/api/employee/${id}/deactivate`, null)
            .subscribe(
                CheckError((res) => {
                    next(res);
                closeLoad();

                })
            );
    }

    activatePersonnel(id: any, next: (res: any) => any) {
        loadPage();
        this.http.put(`${apiUrl}/api/employee/${id}/activate`, null).subscribe(
            CheckError((res) => {
                next(res);
                closeLoad();

            })
        );
    }
}

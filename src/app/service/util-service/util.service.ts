import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Manager, TokenObject } from 'src/app/models/models';

// export const API_URL = 'http://localhost:5050';

export const API_URL = 'https://salon-beauty.onrender.com';
// h
// export const API_URL= process.env['API_URL'];

@Injectable({
    providedIn: 'root',
})
//  process.env.API_URL;
// export const API_URL= process.env['API_URL'];//"http://localhost:5050";
export class UtilService {
    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
        const tokenObjectString = localStorage.getItem('sessionId');
        return JSON.parse(tokenObjectString || '{}');
    }

    saveDataStorage(key: any, value: any) {
        localStorage.setItem(key, value);
    }
    saveCart(value: any) {
        localStorage.setItem('cartId', JSON.stringify(value));
    }
    noCart() {
        let i = localStorage.getItem('cartId');
        return i;
    }
    getCart() {
        const tokenObjectString = localStorage.getItem('cartId');
        return JSON.parse(tokenObjectString || '{}');
    }
    formatted(price: number) {
        return price.toLocaleString('en-FR');
    }

    getDataStorage(key: any) {
        return localStorage.getItem(key);
    }
    removeDataStorage(key: any) {
        localStorage.removeItem(key);
    }

    navigateTo(url: string) {
        this.router.navigate([url]);
    }
    navigateToByUrl(url: string) {
        this.router.navigateByUrl(url);
    }

    getTimeFromDate(date: any) {
        const fullTime = date.split('T')[1];
        const hourPart = fullTime.split(':')[0];
        const minutePart = fullTime.split(':')[1].split(':')[0];
        return hourPart + ':' + minutePart;
    }

    extractDateFromDate(date: any) {
        const datePart = date.split('T')[0];
        return datePart;
    }

    toDateFr(date: any) {
        const originalDate = new Date(date);
        const moisFr = [
            'Janvier',
            'Février',
            'Mars',
            'Avril',
            'Mai',
            'Juin',
            'Juillet',
            'Août',
            'Septembre',
            'Octobre',
            'Novembre',
            'Décembre',
        ];
        const day = originalDate.getDate();
        const month = originalDate.getMonth();
        const year = originalDate.getFullYear();
        const formatedDate = `${day} ${moisFr[month]} ${year}`;
        return formatedDate;
    }

    toTimeFr(time: any) {
        const date = new Date(time);
        const heures = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const heureMinute = `${heures.toString().padStart(2, '0')}h${minutes
            .toString()
            .padStart(2, '0')}`;
        return heureMinute;
    }

    toDatetimeFr(datetime: any) {
        const date = this.toDateFr(datetime);
        const time = this.toTimeFr(datetime);
        return `${date} ${time}`;
    }

    subtractDatePart(date: any, hours: any) {
        const newDate = new Date(date);
        newDate.setHours(newDate.getHours() - hours);
        const datePart = {
            day: new Date(newDate).getDate(),
            month: new Date(newDate).getMonth() + 1,
            hour: new Date(newDate).getHours(),
            minute: new Date(newDate).getMinutes(),
        };
        return datePart;
    }

    getRealDate(date: any) {
        return this.addToDate(date, 3);
    }
    getRealDate2(date: any) {
        return this.addToDate2(date, 3);
    }

    addToDate(date: any, hours: any) {
        const newDate = new Date(date);
        newDate.setHours(newDate.getHours() + hours);
        return newDate;
    }
    addToDate2(date: any, hours: any) {
        const newDate = new Date(date);
        newDate.setHours(newDate.getHours() + hours);
        newDate.setDate(newDate.getDate() -1);
        return newDate;
    }
    format(number: any) {
        const options = {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        };

        const formatter = new Intl.NumberFormat('fr-FR', options);
        const numberFormat = formatter.format(number);
        return numberFormat;
    }

    convertMinutesToHours(minutes: any) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (hours <= 0) {
            return `${remainingMinutes} min`;
        }
        return `${hours} h ${remainingMinutes}`;
    }
    subtractDatePartExpiration(date: any, hours: any) {
        const newDate = new Date(date);
        newDate.setHours(newDate.getHours() + hours);

        return new Date(
            new Date(newDate).getFullYear(),
            new Date(newDate).getMonth(),
            new Date(newDate).getDate(),
            new Date(newDate).getHours(),
            new Date(newDate).getMinutes()
        );
    }

    checkExpiration(): boolean {
        const token: TokenObject = this.getToken();
        let news = this.subtractDatePartExpiration(new Date(), 0);
        let token_date = this.subtractDatePartExpiration(new Date(token.expiration), -3);
        const retours: boolean =
            token_date.getTime() <= new Date(news).getTime();

        console.log('EXPIRATION:'+token_date);
        if (retours) {
            return true;
        }
        return false;
    }
}

import { Component, OnInit } from '@angular/core';
import { CountryService } from 'src/app/demo/service/country.service';
import { Account, TokenObject } from 'src/app/models/models';
import { AccountService } from 'src/app/service/account/account.service';
import { UtilService } from 'src/app/service/util-service/util.service';

@Component({
    templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
    countries: any[] = [];
    actualAmount: string = 'Ar';
    moves:Account[]=[];
    credit: number = 0;
     debit: number = 0;
    value2: any = 1234235;
    amount: any;
    unit: string = 'Ar';

    constructor(
        private countryService: CountryService,
        private uService: UtilService,
        private accountService: AccountService
    ) {}
    pay() {
        const token: TokenObject = this.uService.getToken();
        const account: Account = {};
        account.customer = token.info;
        account.date = new Date();
        account.description = 'Rechargement de compte';
        account.debit = 0;
        account.credit = this.amount;
        this.accountService.saveAccount(account, (res) => {
            this.reload();
        });
    }
    setAmount() {
        const token: TokenObject = this.uService.getToken();
        this.accountService.getAccountState(token.info._id, (res) => {
            let amount = res[0].total_credit - res[0].total_debit;
            this.actualAmount = this.uService.formatted(amount) + this.unit ;
        });
        // this.ngOnInit
    }
    reload() {
        this.setAmount();
        this.accountMovement();

        this.amount = 0;
    }
    accountMovement(){
        let sumC=0;
        let sumD=0;
          this.accountService.getAccount('', (res) => {
            this.moves = res;
            this.moves.forEach((element) => {
                if (element.credit != undefined && element.debit != undefined) {
                    sumC += element.credit;
                    sumD += element.debit;
                }
            });
            this.credit = sumC;
            this.debit = sumD;
        });
    }
    ngOnInit() {
        this.accountMovement();
        this.setAmount();
    }
}

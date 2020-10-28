import { td_rd_installment } from './../../Models';
import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InAppMessageService, RestService } from 'src/app/_service';

@Component({
  selector: 'app-dw-rd-instl-view',
  templateUrl: './dw-rd-instl-view.component.html',
  styleUrls: ['./dw-rd-instl-view.component.css']
})
export class DwRdInstlViewComponent implements OnInit, OnDestroy {

  constructor(private svc: RestService, private msg: InAppMessageService) {
    this.subscription = this.msg.getCommonAccountNum().subscribe(
      res => {
        debugger;
        this.accNum = res;
        this.getRdIntallementDtls();
      },
      err => { }
    );
  }
  subscription: Subscription;
  accNum: string;
  installemnts: td_rd_installment[] = [];
  ngOnInit(): void {
    this.getRdIntallementDtls();
  }

  private getRdIntallementDtls(): void {
    debugger;
    if (null !== this.accNum && '' !== this.accNum) {
      let rdInstallament = new td_rd_installment();
      rdInstallament.acc_num = this.accNum
      this.svc.addUpdDel<any>('Deposit/GetRDInstallment', rdInstallament).subscribe(
        res => {
          this.installemnts = res;
        },
        err => { }
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

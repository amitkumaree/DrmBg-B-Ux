import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestService, InAppMessageService } from 'src/app/_service';
import { td_intt_dtls, tm_deposit } from '../../Models';

@Component({
  selector: 'app-dw-td-intt-dtls-view',
  templateUrl: './dw-td-intt-dtls-view.component.html',
  styleUrls: ['./dw-td-intt-dtls-view.component.css']
})
export class DwTdInttDtlsViewComponent implements OnInit, OnDestroy {

  constructor(private svc: RestService, private msg: InAppMessageService) {
    this.subscription = this.msg.getCommonAcctInfo().subscribe(
      res => {
        debugger;
        this.acctDtls = res;
        this.getInterestList();
      },
      err => { }
    );
  }
  subscription: Subscription;
  acctDtls: tm_deposit;
  interestDetails: td_intt_dtls[] = [];

  ngOnInit(): void {
  }

  private getInterestList() {
    debugger;
    if (undefined !== this.acctDtls &&
      null !== this.acctDtls) {
        let tdIntDtl = new td_intt_dtls();
        tdIntDtl.acc_type_cd = this.acctDtls.acc_type_cd;
        tdIntDtl.acc_num = this.acctDtls.acc_num;
        this.svc.addUpdDel<any>('Deposit/GetInttDetails', tdIntDtl).subscribe(
          res => {
            debugger;
            this.interestDetails = res[0];
          },
          err => { }
        );
      }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

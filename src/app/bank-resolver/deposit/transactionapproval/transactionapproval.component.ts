import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExportAsService } from 'ngx-export-as';
import { RestService } from 'src/app/_service';
import { MessageType, ShowMessage, td_def_trans_trf } from '../../Models';

@Component({
  selector: 'app-transactionapproval',
  templateUrl: './transactionapproval.component.html',
  styleUrls: ['./transactionapproval.component.css'],

})
export class TransactionapprovalComponent implements OnInit {
  isLoading = false;
  showMsg: ShowMessage;
  tdDepTrans = new td_def_trans_trf();
  tdDepTransRet: td_def_trans_trf[] = [];
  tdDepTransGroup: any;
  constructor(private svc: RestService, private elementRef: ElementRef) { }

  ngOnInit(): void {
    debugger;
    // this.elementRef.nativeElement.style.setProperty('--bkcolor', 'white');
    this.GetUnapprovedDepTrans();

  }

  /** Below method handles message show/hide */
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }

  private GetUnapprovedDepTrans(): void {
    this.isLoading = true;
    this.tdDepTrans.brn_cd = localStorage.getItem('__brnCd');
    this.svc.addUpdDel<any>('Common/GetUnapprovedDepTrans', this.tdDepTrans).subscribe(
      res => {
        debugger;
        this.tdDepTransRet = res;
        // this.tdDepTransGroup = this.groupBy(this.tdDepTransRet, (c) => c.acc_type_cd);
        this.isLoading = false;
      },
      err => { }
    );
  }

  // groupBy(xs, f) {
  //   const gc = xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {})
  //   return Object.keys(gc).map(acc_type_cd => ({ acc_type_cd: acc_type_cd, events: gc[acc_type_cd] }));;
  // }
  // toggleSelection(i) {
  //   this.tdDepTransGroup[i].open = !this.tdDepTransGroup[i].open;
  // }
  // OnSelectTransaction(ev: any) {
  //   debugger;
  //   this.elementRef.nativeElement.style.setProperty('--bkcolor', 'red');
  // }

}

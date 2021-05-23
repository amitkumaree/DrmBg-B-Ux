import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MessageType, mm_acc_type, m_acc_master, p_loan_param, ShowMessage, SystemValues } from 'src/app/bank-resolver/Models';
import { InAppMessageService, RestService } from 'src/app/_service';

@Component({
  selector: 'app-loan-accwiseinttcalc',
  templateUrl: './loan-accwiseinttcalc.component.html',
  styleUrls: ['./loan-accwiseinttcalc.component.css']
})
export class LoanAccwiseinttcalcComponent implements OnInit {

  constructor(private svc: RestService, private elementRef: ElementRef,
    private msg: InAppMessageService, private modalService: BsModalService,
    private router: Router) { }
    sys = new SystemValues();
    accountTypeList: mm_acc_type[]= [];
    param :p_loan_param[]=[];
    isTrade: boolean = false;
    isLoading = false;
    showMsg: ShowMessage;
  
  ngOnInit(): void {
    this.getAccountTypeList();
  }
  
  onBackClick() {
    this.router.navigate([this.sys.BankName + '/la']);
  }

  getAccountTypeList() {
    debugger;
    
    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {
        debugger;
        this.accountTypeList = res;
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'L');
        this.accountTypeList.forEach(x=>x.calc=false);
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      },
      err => {
        debugger;
      }
    );
  }
  changeTradesByCategory(event) {
    debugger;
    if (this.accountTypeList[event].calc) 
      this.accountTypeList[event].calc=false;
    else
    this.accountTypeList[event].calc=true;
  }
  allTrades(event) {
    debugger;
    const checked = event.target.checked;
    if(checked)
    this.accountTypeList.forEach(item => item.calc = true);
    else
    this.accountTypeList.forEach(item => item.calc = false);
  }
  onApproveClick()
  {
    debugger
    this.param=[]
    for (let i=0;i<this.accountTypeList.length;i++)
    {
      if (this.accountTypeList[i].calc)
      {
        var p = new p_loan_param();
        p.acc_cd=this.accountTypeList[i].acc_type_cd.toString();
        p.intt_dt=this.sys.CurrentDate;
        this.param.push(p)
      }
    }
    if (this.param.length>0)
    {
      this.isLoading=true;
      this.svc.addUpdDel<any>('Loan/CalculateLoanAccWiseInterest', this.param).subscribe(
        res => {
          debugger;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess, 'Interest Calculation Done!!!!!!!!!!');    
        },
        err => {
          debugger;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Error, 'Interest Calculation Failed!!!!!!!!!!');    
        }
      );

    }
    else
    this.HandleMessage(true, MessageType.Warning, 'Please select at least one Account Type!!!!!!!!!!');    
  }

  /** Below method handles message show/hide */
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }

}

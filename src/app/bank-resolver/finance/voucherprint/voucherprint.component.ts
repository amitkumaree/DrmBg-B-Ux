import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { p_report_param } from '../../Models';
import { T_VOUCHER_NARRATION } from '../../Models/T_VOUCHER_NARRATION';
import { RestService } from 'src/app/_service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-voucherprint',
  templateUrl: './voucherprint.component.html',
  styleUrls: ['./voucherprint.component.css']
})
export class VoucherprintComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  prp =new p_report_param();
  tvn:  T_VOUCHER_NARRATION[]=[];
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  alertMsg = '';
  fromdate: Date;
  toDate:Date;
  isLoading = false;
  
  constructor(private svc: RestService,private formBuilder: FormBuilder, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
    this.onLoadScreen(this.content);
  }
  private onLoadScreen(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    },
      (reason) => {
        this.closeResult = 'Dismissed ${this.getDismissReason(reason)}';
      });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  public closeAlert() {
    this.showAlert = false;
  }
  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = "Invalid Input.";
      return false;
    }
    else if (new Date(this.reportcriteria.value['fromDate']) > new Date(this.reportcriteria.value['toDate'])) {
      this.showAlert = true;
      this.alertMsg = "To Date cannot be greater than From Date!";
      return false;
    }
    else {
      this.showAlert = false;
      this.fromdate=this.reportcriteria.value['fromDate'];
      this.toDate=this.reportcriteria.value['toDate'];
      this.getmVoucherDetails();
      this.modalService.dismissAll(this.content);
    }
  }

  private getmVoucherDetails(): void {
    this.prp.brn_cd='101';
    this.prp.from_dt= this.fromdate;
    this.prp.to_dt=this.toDate;
    this.isLoading=true;
    this.svc.addUpdDel<any>('Voucher/GetTVoucherDtlsForPrint', this.prp).subscribe(
      res => {
        debugger;
        this.tvn = res;
        this.isLoading=false;
      },
      err => { }
    );
  }


}

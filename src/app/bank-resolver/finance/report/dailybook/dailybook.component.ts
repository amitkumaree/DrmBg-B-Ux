import { Component, OnInit, TemplateRef, ViewChild, Input, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import { RestService } from 'src/app/_service';
import { tt_cash_account, p_report_param } from 'src/app/bank-resolver/Models';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-dailybook',
  templateUrl: './dailybook.component.html',
  styleUrls: ['./dailybook.component.css']
})
export class DailybookComponent implements OnInit {
  reportcriteria: FormGroup;
  closeResult = '';
  fd: any;
  td: any;
  dt: any;
  showReport = false;
  showAlert = false;
  alertMsg = '';
  dailyCash: tt_cash_account[] = [];
  prp = new p_report_param();
  totalDr: number = 0;
  totalCr: number = 0;
  constructor(private svc: RestService, private formBuilder: FormBuilder, private modalService: NgbModal) { }

  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('reportcontent') reportcontent: ElementRef;
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
      this.RunReport(this.reportcriteria.value['fromDate'], this.reportcriteria.value['toDate']);
      this.modalService.dismissAll(this.content);
    }
  }

  public closeAlert() {
    this.showAlert = false;
  }

  private RunReport(fdate, tdate) {
    this.prp.brn_cd = '101';
    this.prp.from_dt = fdate;
    this.prp.to_dt = tdate;
    this.prp.acc_cd = 28101;
    fdate = new Date(fdate);
    tdate = new Date(tdate);
    this.fd = (("0" + fdate.getDate()).slice(-2)) + "/" + (("0" + (fdate.getMonth() + 1)).slice(-2)) + "/" + (fdate.getFullYear());
    this.td = (("0" + tdate.getDate()).slice(-2)) + "/" + (("0" + (tdate.getMonth() + 1)).slice(-2)) + "/" + (tdate.getFullYear());
    this.dt = new Date();
    this.dt = (("0" + this.dt.getDate()).slice(-2)) + "/" + (("0" + (this.dt.getMonth() + 1)).slice(-2)) + "/" + (this.dt.getFullYear()) + " " + this.dt.getHours() + ":" + this.dt.getMinutes();
    this.svc.addUpdDel<any>('Report/PopulateDailyCashBook', this.prp).subscribe(
      res => {
        this.dailyCash = res;
        this.dailyCash.forEach(x => this.totalCr += x.cr_amt);
        this.dailyCash.forEach(x => this.totalDr += x.dr_amt);
        this.showReport = true;
      },
      err => { }
    );
  }

  // public downloadPDF() {
  //   debugger;
  //   let content = this.reportcontent.nativeElement;
  //   let doc = new jsPDF();
  //   let _elementHandlers =
  //   {
  //     '#editor': function (element, renderer) {
  //       return true;
  //     }
  //   };
  //   doc.fromHTML(content.innerHTML, 30, 30, {

  //     'width': 250,
  //     'elementHandlers': _elementHandlers
  //   });

  //   doc.save("CashAccountReport_" + this.dt + ".pdf");



  // }

  public downloadPDF() {
    const option = {
      name: 'output.pdf',
      image: { type: 'jpeg' },
      html2pdf: {},
      jsPDF: { orientation: 'landscape' }
    }
    const element: Element = document.getElementById('reportcontent');

    html2pdf()
      .from(element)
      .set(option)
      .save()
  }


}

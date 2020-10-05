import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { p_report_param } from '../../Models';
import { T_VOUCHER_NARRATION } from '../../Models/T_VOUCHER_NARRATION';
import { RestService } from 'src/app/_service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-voucherprint',
  templateUrl: './voucherprint.component.html',
  styleUrls: ['./voucherprint.component.css']
})
export class VoucherprintComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('reportcontent') reportcontent: ElementRef;
  prp =new p_report_param();
  tvn:  T_VOUCHER_NARRATION[]=[];
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  alertMsg = '';
  fromdate: Date;
  todate:Date; 
  isLoading = false;
  
  constructor(private svc: RestService,private formBuilder: FormBuilder,
     private modalService: NgbModal) { }

  ngOnInit(): void {
    debugger;
    this.fromdate=new Date(localStorage.getItem('__currentDate'));
    this.todate=new Date(localStorage.getItem('__currentDate'));
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
    this.onLoadScreen(this.content);
  }
  private onLoadScreen(content) {
    debugger;
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
      this.todate=this.reportcriteria.value['toDate'];
      this.getmVoucherDetails();
      this.modalService.dismissAll(this.content);
    }
  }

  private getmVoucherDetails(): void {
    this.prp.brn_cd=localStorage.getItem('__brnCd');
    this.prp.from_dt= this.fromdate;
    this.prp.to_dt=this.todate;
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

  //   public downloadPDF() {
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
  //   doc.save("VoucherPrint.pdf");
  // }

  // public downloadPDF () {
  //   debugger;
  //   {
  //     // download the file using old school javascript method
  //     this.exportAsService.save(this.exportAsConfig, 'VoucherPrint').subscribe(() => {
  //       // save started
  //     });
  //     // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
  //    // this.exportAsService.get(this.config).subscribe(content => {
  //    //   console.log(content);
  //    // });
  //   }
  // }

  // public downloadPDF() {
  //   const option = {
  //     name: 'VoucherPrint.pdf',
  //     image: { type: 'jpeg' },
  //     html2pdf: {},
  //     jsPDF: { orientation: 'portrait' }
  //   }
  //   const element: Element = document.getElementById('reportcontent');

  //   html2pdf()
  //     .from(element)
  //     .set(option)
  //     .save()
  // }
  public downloadPDF() {
  var element = document.getElementById('reportcontent');
  var option = {
margin:       0,
filename:     'Voucher_'+this.fromdate.toString()+'.pdf',
image:        { type: 'jpeg', quality: 0.98 },
html2canvas:  { scale:1},
jsPDF:        { unit: 'mm', format: 'a4', orientation: 'p' }
};
html2pdf()
       .from(element)
       .set(option)
       .save()
  }
 public FormatNumber(num) {
  try {
      return parseFloat(num).toFixed(2);
  } catch (error) {
      return 0;
  }
}


}

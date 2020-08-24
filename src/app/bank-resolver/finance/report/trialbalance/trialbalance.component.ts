import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { RestService } from 'src/app/_service';
import { WebDataRocksPivot } from 'src/app/webdatarocks/webdatarocks.angular4';
import { tt_cash_account, p_report_param } from 'src/app/bank-resolver/Models';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { STRING_TYPE } from '@angular/compiler';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';

@Component({
  selector: 'app-trialbalance',
  templateUrl: './trialbalance.component.html',
  styleUrls: ['./trialbalance.component.css']
})
export class TrialbalanceComponent implements OnInit {

  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('TrialBalance') child: WebDataRocksPivot;
  trailbalance: tt_trial_balance[] = [];
  prp =new p_report_param();
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  toDate:Date;
  constructor(private svc: RestService,private formBuilder: FormBuilder, private modalService: NgbModal ) { }
  ngOnInit(): void {
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, null]
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
   
    else {
      this.showAlert = false;
      this.fromdate=this.reportcriteria.value['fromDate'];
      //this.toDate=this.reportcriteria.value['toDate'];
      this.onReportComplete();
      this.modalService.dismissAll(this.content);
    }
  }

  public closeAlert() {
    this.showAlert = false;
  }
  //private pdfmake : pdfMake;
  onPivotReady(TrialBalance: WebDataRocksPivot): void {
    console.log("[ready] WebDataRocksPivot", this.child);
  } 
  
  
  onReportComplete(): void {
    debugger;
    this.prp.brn_cd='101';
    this.prp.trial_dt= this.fromdate;
    this.prp.pl_acc_cd=28101;
    this.prp.gp_acc_cd=28101;
    let fdate = new Date(this.fromdate);
    let tdate = new Date(this.toDate);
    this.fd = (("0" + fdate.getDate()).slice(-2)) + "/" + (("0" + (fdate.getMonth() + 1)).slice(-2)) + "/" + (fdate.getFullYear());
    this.td = (("0" + tdate.getDate()).slice(-2)) + "/" + (("0" + (tdate.getMonth() + 1)).slice(-2)) + "/" + (tdate.getFullYear());
    this.dt = new Date();
    this.dt = (("0" + this.dt.getDate()).slice(-2)) + "/" + (("0" + (this.dt.getMonth() + 1)).slice(-2)) + "/" + (this.dt.getFullYear()) + " " + this.dt.getHours() + ":" + this.dt.getMinutes();
    this.child.webDataRocks.off("reportcomplete");
    this.svc.addUpdDel<any>('Report/PopulateTrialBalance',this.prp).subscribe(
      (data: tt_trial_balance[]) => this.trailbalance = data,
      error => { console.log(error); },
      () => {
          debugger;
          //this.showReport = true;
         // this.generatePdf();
         let totalCr=0;
         let totalDr=0;
         this.child.webDataRocks.setReport({
          dataSource: {
             data:this.trailbalance
          },
          tableSizes: {
            columns: [
              {
                idx: 0,
                width: 75
              },
              {
                idx: 1,
                width: 400
              },
              {
                idx: 2,
                width: 100
              },
              {
                idx: 3,
                width: 100
              }
            ]
          },
          "options": {
            "grid": {
                "type": "flat",
                "showTotals": "off",
                "showGrandTotals": "off"
            }            
            },
            "slice": {
              "rows": [
                  {
                      "uniqueName": "acc_cd",
                      "caption": "Account Code",
                      "sort": "unsorted"
                      
                  },
                  {
                      "uniqueName": "acc_name",
                      "caption": "Account Name",
                      "sort": "unsorted"
                  },
                  {
                      "uniqueName": "dr",
                      "caption": "Debit",
                      "sort": "unsorted"
                  },
                  {
                    "uniqueName": "cr",
                    "caption": "Credit",
                      "sort": "unsorted"
                }
              ],
              "measures": [
                {
                  uniqueName: "acc_cd",
                  format: "decimal0"
                }],
              "flatOrder": [
                  "Debit",
                  "Dr Description",
                  "Dr Amount",
                  "Credit",
                  "Cr Description",
                  "Cr Amount",
              ]
          },
          
            "formats": [{
              "name": "",
              "thousandsSeparator": ",",
              "decimalSeparator": ".",
              "decimalPlaces": 2,
              "maxSymbols": 20,
              "currencySymbol": "",
              "currencySymbolAlign": "left",
              "nullValue": " ",
              "infinityValue": "Infinity",
              "divideByZeroValue": "Infinity"
          },
          {
            name: "decimal0",
            decimalPlaces: 0,
            thousandsSeparator: "",
            textAlign:"left"
          }
        ]
        });
      }
    );
  }
//   setCustomizeFunction() {
//     this.child.webDataRocks.customizeCell(this.customizeCellFunction);
// }

 setOption(option, value) {
  this.child.webDataRocks.setOptions({
        grid: {
            [option]: value
        }
    });
    debugger;
    this.child.webDataRocks.refresh();
}

exportPDFTitle() {
  var options = this.child.webDataRocks.getOptions();
  this.child.webDataRocks.setOptions( {
    grid: {
      title: 'Trial Balance as on ' +this.fd 
    }
  } 
  );
  this.child.webDataRocks.refresh();
  this.child.webDataRocks.exportTo('pdf', { pageOrientation:'potrait',header:"<div>##CURRENT-DATE##</div>",filename:"TrialBalance"});
  this.child.webDataRocks.on('exportcomplete', function () {
    this.child.webDataRocks.off('exportcomplete')
    this.child.webDataRocks.setOptions(options);
    this.child.webDataRocks.refresh();
  });
}



}

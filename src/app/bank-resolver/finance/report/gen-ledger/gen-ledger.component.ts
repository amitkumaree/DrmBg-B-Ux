import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { RestService } from 'src/app/_service';
import { WebDataRocksPivot } from 'src/app/webdatarocks/webdatarocks.angular4';
import {  p_report_param, tt_gl_trans } from 'src/app/bank-resolver/Models';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { STRING_TYPE } from '@angular/compiler';
import { Router } from '@angular/router';


@Component({
  selector: 'app-gen-ledger',
  templateUrl: './gen-ledger.component.html',
  styleUrls: ['./gen-ledger.component.css']
})
export class GenLedgerComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('GenLedger') child: WebDataRocksPivot;
  genLdgerTrans: tt_gl_trans[] = [];
  prp = new p_report_param();
  reportcriteria: FormGroup;
  closeResult = '';
  isLoading = false;
  showAlert = false;
  urlToCall: '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  todate: Date;
  constructor(private svc: RestService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,private router: Router ) { }

  ngOnInit(): void {
    this.fromdate=new Date(localStorage.getItem('__currentDate'));
    this.todate=new Date(localStorage.getItem('__currentDate'));
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      fromAcc: [null, Validators.required],
      toAcc: [null, Validators.required],
    });
    this.onLoadScreen(this.content);
  }

  //get r() { return this.reportcriteria.controls; }

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
    this.isLoading = true;
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }
    else if (new Date(this.reportcriteria.value['fromDate']) > new Date(this.reportcriteria.value['toDate'])) {
      this.showAlert = true;
      this.alertMsg = 'To Date cannot be greater than From Date!';
      return false;
    }
    else {
      this.showAlert = false;
      this.fromdate=this.reportcriteria.value['fromDate'];
      this.todate=this.reportcriteria.value['toDate'];
      this.isLoading=true;
      this.onReportComplete();
      this.modalService.dismissAll(this.content);
    }
  }

  public closeAlert() {
    this.showAlert = false;
  }
  // private pdfmake : pdfMake;
  onPivotReady(GenLedger: WebDataRocksPivot): void {
    console.log('[ready] WebDataRocksPivot', this.child);
  }


  onReportComplete(): void {
    debugger;
    if (!this.isLoading)return ;
    this.prp.brn_cd = localStorage.getItem('__brnCd');;
    this.prp.from_dt = this.fromdate;
    this.prp.to_dt = this.todate;
    this.prp.ad_from_acc_cd = parseInt(this.reportcriteria.value['fromAcc']);
    this.prp.ad_to_acc_Cd = parseInt (this.reportcriteria.value['toAcc']);
    const fdate = new Date(this.fromdate);
    const tdate = new Date(this.todate);
    this.fd = (('0' + fdate.getDate()).slice(-2)) + '/' + (('0' + (fdate.getMonth() + 1)).slice(-2)) + '/' + (fdate.getFullYear());
    this.td = (('0' + tdate.getDate()).slice(-2)) + '/' + (('0' + (tdate.getMonth() + 1)).slice(-2)) + '/' + (tdate.getFullYear());
    this.dt = new Date();
    this.dt = (('0' + this.dt.getDate()).slice(-2)) + '/' + (('0' + (this.dt.getMonth() + 1)).slice(-2)) + '/' + (this.dt.getFullYear()) + ' ' + this.dt.getHours() + ':' + this.dt.getMinutes();
    this.child.webDataRocks.off('reportcomplete');
    this.svc.addUpdDel<any>('Report/GLTD', this.prp).subscribe(
      (data: tt_gl_trans[]) =>
      {
        this.genLdgerTrans = data;
        debugger;
      },
      error => { console.log(error); },
      () => {
        this.isLoading = false;
        debugger;
        this.child.webDataRocks.setReport({
          dataSource: {
             data:this.genLdgerTrans
          },
          tableSizes: {
            columns: [
              {
                idx: 0,
                width: 75
              },
              {
                idx: 1,
                width: 200
              },
              {
                idx: 2,
                width: 100
              },
              {
                idx: 3,
                width: 75
              },
              {
                idx: 4,
                width: 200
              },
              {
                idx: 5,
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
                  "uniqueName": "dr_amt",
                  "caption": "Debit Amount",
                  "sort": "unsorted"
              },
              {
                "uniqueName": "cr_amt",
                "caption": "Credit Amount",
                  "sort": "unsorted"
            },
            {
                "uniqueName": "trans_month",
                "caption": "Month of Transaction",
                  "sort": "unsorted"
            },
            {
              "uniqueName": "trans_year",
              "caption": "Year of Transaction",
                "sort": "unsorted"
          },
            {
                "uniqueName": "opng_bal",
                "caption": "Opening Balance",
                  "sort": "unsorted"
            }
              ],
              "measures": [
                {
                  uniqueName: "trans_month",
                  format: "decimal0"
                },
                {
                  uniqueName: "trans_year",
                  format: "decimal0"
                },
                {
                  uniqueName: "acc_cd",
                  format: "decimal0"
                }],
              "flatOrder": [
                "Account Code",
                "Debit Amount",
                "Credit Amount",
                "Month of Transaction",
                "Year of Transaction",
                "Opening Balance"
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
    const options = this.child.webDataRocks.getOptions();
    this.child.webDataRocks.setOptions({
      grid: {
        title: 'GL Transaction Details For The Period ' + this.fd + '-' + this.td
      }
    }
    );
    this.child.webDataRocks.refresh();
    this.child.webDataRocks.exportTo('pdf', { pageOrientation:'potrait',header:"<div>##CURRENT-DATE##&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Synergic Banking&emsp;&emsp;&emsp;Branch : "+localStorage.getItem('__brnName')+"<br>&nbsp</div>",filename:"GeneralLedgerTransactions"});
    this.child.webDataRocks.on('exportcomplete', function() {
      this.child.webDataRocks.off('exportcomplete');
      this.child.webDataRocks.setOptions(options);
      this.child.webDataRocks.refresh();
    });
  }
  closeScreen()
{
  this.router.navigate(['vccb' + '/la']);
}
}

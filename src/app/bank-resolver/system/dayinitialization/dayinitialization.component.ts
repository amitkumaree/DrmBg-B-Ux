import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from 'src/app/_service';
import { MessageType, ShowMessage } from '../../Models';
import { p_gen_param } from '../../Models/p_gen_param';
import { sd_day_operation } from '../../Models/sd_day_operation';

@Component({
  selector: 'app-dayinitialization',
  templateUrl: './dayinitialization.component.html',
  styleUrls: ['./dayinitialization.component.css']
})
export class DayinitializationComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  constructor(private router: Router,private formBuilder: FormBuilder,private svc: RestService,
    // private modalService: NgbModal,
    ) { }
  isLoading = false;
  sdoRet: sd_day_operation[] = [];
  showMsg: ShowMessage;
  initcriteria: FormGroup;
  fromdate: Date;
  alertMsg = '';
  closeResult='';
  showAlert = false;
  isRetrieve=false;
  isOk=false;
  ngOnInit(): void {
    //this.fromdate=this.convertDate(localStorage.getItem('__currentDate'));
    this.initcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required]
    });
    this.isRetrieve=true;
    this.isOk=false;
  }
private getDayOpertion ()
{
  debugger;
  this.showMsg =null;
  var sdo = new sd_day_operation();
  //sdo.operation_dt =this.convertDate(localStorage.getItem('__currentDate'));// new Date();
  sdo.operation_dt =new Date(this.convertDate(localStorage.getItem('__currentDate'))+" UTC")
  debugger;
  this.svc.addUpdDel<any>('Sys/GetDayOperation', sdo).subscribe(
    res => {
      debugger;
      this.isLoading = false;
      //var a=res.find(x=>x.cls_flg==="N").cls_flg ;
      if (res.findIndex(x=>x.cls_flg==='N')==0)
      {
        this.HandleMessage(true, MessageType.Info,'Branches Are Opened' );
        this.sdoRet = res;
        this.isRetrieve=true;
        this.isOk=false;
      }
      else
      {
      this.sdoRet = res;
      this.isRetrieve=false;
      this.isOk=true;
      }
    },
    err => { debugger;  this.isLoading = false;}
  );
}
dayInitialize()
{
  this.onLoadScreen(this.content)
}

private onLoadScreen(content) {
  // this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
  // },
  //   (reason) => {
  //     this.closeResult = 'Dismissed ${this.getDismissReason(reason)}';
  //   });
}
// private getDismissReason(reason: any): string {
//   if (reason === ModalDismissReasons.ESC) {
//     return 'by pressing ESC';
//   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
//     return 'by clicking on a backdrop';
//   } else {
//     return `with: ${reason}`;
//   }
// }
public SubmitInit() {
  if (this.initcriteria.invalid) {
    this.HandleMessage(true, MessageType.Error,'Invalid Input.' );
    return false;
  }
  else
  {
    this.isLoading = true;
    this.dayInitiationCall(this.initcriteria.value['fromDate']);
  }
}
private dayInitiationCall (opnDt :any)
{
  this.showMsg =null;
  var pgp = new p_gen_param();
  pgp.adt_trans_dt = opnDt;
  pgp.gs_user_id= localStorage.getItem('__userId');

  debugger;
  this.svc.addUpdDel<any>('Sys/W_DAY_OPEN', pgp).subscribe(
    res => {
      debugger;
      this.isLoading = false;
      this.alertMsg = res.output;
      this.HandleMessage(true, MessageType.Sucess,this.alertMsg );
      this.isRetrieve=true;
      this.isOk=false;
    },
    err => { debugger;  this.isLoading = false;
      this.isRetrieve=true;
      this.isOk=false;
    }
  );
}
closeScreen()
{
  this.router.navigate([localStorage.getItem('__bName') + '/la']);
}
dayRetrieve()
{
  this.getDayOpertion();
}
private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
  this.showMsg = new ShowMessage();
  this.showMsg.Show = show;
  this.showMsg.Type = type;
  this.showMsg.Message = message;
}
private  convertDate(datestring:string):Date
{
var parts = datestring.match(/(\d+)/g);
return new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
}

}

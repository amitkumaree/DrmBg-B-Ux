import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, ShowMessage } from '../../Models';
import { m_branch } from '../../Models/m_branch';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {
  brnDtls: m_branch[]=[];
  
  isLoading=false;
  addUser: FormGroup;
  showMsg: ShowMessage;
  constructor(private router: Router,private formBuilder: FormBuilder,private svc: RestService) { }

  ngOnInit(): void {
    this.GetBranchMaster();
    this.addUser = this.formBuilder.group({
      userid: ['', Validators.required],
      password: ['', Validators.required],
      fname: ['', Validators.required],
      mname: ['', null],
      lname: ['', Validators.required],
      utype: ['', Validators.required],
      branch: ['', Validators.required]
    });
  }
  get f() { return this.addUser.controls; }
  closeScreen()
  {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
  }
  new()
  {
    this.GetBranchMaster();
  }
  GetBranchMaster()
  {
    this.isLoading=true;
    debugger;
    this.svc.addUpdDel('Mst/GetBranchMaster', null).subscribe(
      res => {
        debugger;
        this.brnDtls=res;
        this.isLoading=false;
        
      },
      err => {this.isLoading=false; debugger;}
    )
  }
  retrieve ()
  {
    debugger;
    let login = new LOGIN_MASTER();
    login.user_id = this.f.userid.value;
    login.brn_cd = this.f.branch.value;
    this.svc.addUpdDel<any>('Sys/GetUserIDDtls', login).subscribe(
      res => {
        debugger;
        if (res.length==0)
        {
          this.HandleMessage(true, MessageType.Sucess,'User Not found !!!' );
        }
        else
        {
        this.f.fname.setValue(res[0].user_first_name);
        this.f.mname.setValue(res[0].user_middle_name);
        this.f.lname.setValue(res[0].user_last_name);
        this.f.utype.setValue(res[0].user_type);
        }
        
      },
      err => { debugger;  this.HandleMessage(true, MessageType.Error,'User Not found !!!' );}
    )

  }
  saveuser()
  {
    this.isLoading=true;
    this.showMsg =null;
    let login = new LOGIN_MASTER();
    login.user_id = this.f.userid.value;
    login.brn_cd = this.f.branch.value;
    login.user_first_name=this.f.fname.value;
    login.user_middle_name=this.f.mname.value;
    login.user_last_name=this.f.lname.value;
    login.user_type=this.f.utype.value;
    login.password=this.f.password.value;
    login.login_status='N';
    debugger;
    this.svc.addUpdDel('Sys/InsertUserMaster', login).subscribe(
      res => {
        debugger;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'Sucessfully Saved the User Details' );
        
      },
      err => {this.isLoading=false; debugger; this.HandleMessage(true, MessageType.Error,'Insertion Failed!!' );}
    )

  }
  updateuser()
  {
    this.isLoading=true;
    this.showMsg =null;
    let login = new LOGIN_MASTER();
    login.user_id = this.f.userid.value;
    login.brn_cd = this.f.branch.value;
    login.user_first_name=this.f.fname.value;
    login.user_middle_name=this.f.mname.value;
    login.user_last_name=this.f.lname.value;
    login.user_type=this.f.utype.value;
    login.password=this.f.password.value;
    //login.login_status='N';
    debugger;
    this.svc.addUpdDel('Sys/UpdateUserMaster', login).subscribe(
      res => {
        debugger;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'Sucessfully Updated the User Details' );
        
      },
      err => {this.isLoading=false; debugger; this.HandleMessage(true, MessageType.Error,'Updation Failed!!' );}
    )

  }
  deleteeuser()
  {
    this.isLoading=true;
    this.showMsg =null;
    let login = new LOGIN_MASTER();
    login.user_id = this.f.userid.value;
    login.brn_cd = this.f.branch.value;

    //login.login_status='N';
    debugger;
    this.svc.addUpdDel('Sys/DeleteUserMaster', login).subscribe(
      res => {
        debugger;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'User Details Deleted' );
        
      },
      err => {this.isLoading=false; debugger; this.HandleMessage(true, MessageType.Error,'Deletion Failed!!' );}
    )

  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }

}

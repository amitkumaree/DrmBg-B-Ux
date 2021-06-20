import { RestService } from './../../_service/rest.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LOGIN_MASTER } from '../Models';
import { InAppMessageService } from 'src/app/_service';
import { m_branch } from '../Models/m_branch';
import { sm_parameter } from '../Models/sm_parameter';
import { p_gen_param } from '../Models/p_gen_param';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  returnUrl: string;
  isError = false;
  brnDtls: m_branch[] = [];
  systemParam: sm_parameter[] = [];
  //genparam=new p_gen_param();
  isLoading = false;
  showAlert = false;
  alertMsg = '';
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private rstSvc: RestService,
    private msg: InAppMessageService) { }

  ngOnInit(): void {
    ;
    this.GetBranchMaster();
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      branch: ['', Validators.required]
    });

  }
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    // this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    ;
    this.isLoading = true;
    const __bName = localStorage.getItem('__bName');
    // this.router.navigate([__bName + '/la']); // TODO remove this it will be after login
    let login = new LOGIN_MASTER();
    let toreturn = false;
    login.user_id = this.f.username.value;
    login.password = this.f.password.value;;
    login.brn_cd = this.f.branch.value;
    this.rstSvc.addUpdDel<any>('Mst/GetUserDtls', login).subscribe(
      res => {
        ;
        if (res.length == 0) {
          this.isLoading = false;
          this.showAlert = true;
          this.alertMsg = 'Invalid Credential !!!!!';
        }
        else {
          // console.log('Login Sucess');
          this.rstSvc.addUpdDel('Mst/GetSystemParameter', null).subscribe(
            res => {
              ;
              try {
                this.systemParam = res;
                console.log('ParameterList Sucess');
                localStorage.setItem('__brnCd', this.f.branch.value); // "101"
                localStorage.setItem('__brnName', this.brnDtls.find(x => x.brn_cd === this.f.branch.value).brn_name);//"101"
                localStorage.setItem('__currentDate', this.systemParam.find(x => x.param_cd === '206').param_value);//Day initilaze
                localStorage.setItem('__cashaccountCD', this.systemParam.find(x => x.param_cd === '213').param_value);//28101
                localStorage.setItem('__ddsPeriod', this.systemParam.find(x => x.param_cd === '220').param_value); // 12
                localStorage.setItem('__userId', this.f.username.value); // feather
                localStorage.setItem('__minBalWdChq', this.systemParam.find(x => x.param_cd === '301').param_value);
                localStorage.setItem('__minBalNoChq', this.systemParam.find(x => x.param_cd === '302').param_value);
                this.isLoading = false;
                this.msg.sendisLoggedInShowHeader(true);
                this.router.navigate([__bName + '/la']);
              }
              catch (exception) {
                this.isLoading = false;
                this.showAlert = true;
                this.alertMsg = 'Initialization Failed. Contact Administrator !';
              }
            },
            err => { }
          )
        }
      },
      err => {
        this.isLoading = false;
        this.showAlert = true;
        this.alertMsg = 'Invalid Credential !!!!!';
      }
    )
  }
  closeAlert() {
    this.showAlert = false;
  }
  cancel() {
    localStorage.removeItem('__bName');
    localStorage.removeItem('__brnName');
    localStorage.removeItem('__brnCd');
    localStorage.removeItem('__currentDate');
    localStorage.removeItem('__cashaccountCD');
    localStorage.removeItem('__ddsPeriod');
    localStorage.removeItem('__userId');

    this.router.navigate(['/']);
  }

  GetBranchMaster() {
    ;
    this.rstSvc.addUpdDel('Mst/GetBranchMaster', null).subscribe(
      res => {
        ;
        this.brnDtls = res;
        // this.genparam.brn_cd="101";
        // this.genparam.gs_acc_type_cd=11;
        // this.genparam.ls_catg_cd=0;
        // this.genparam.ls_cons_cd=0;
        //
        // this.rstSvc.addUpdDel('Deposit/PopulateAccountNumber', this.genparam).subscribe(
        //   res => {
        //     ;
        //     res;
        //     ;
        //   },
        //   err => { ;}
        // )
      },
      err => { ; }
    )
  }
}

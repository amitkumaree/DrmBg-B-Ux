import { RestService } from './../../_service/rest.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LOGIN_MASTER } from '../Models';
import { InAppMessageService } from 'src/app/_service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  returnUrl: string;
  isError = false;
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private rstSvc: RestService,
    private msg: InAppMessageService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    // this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    debugger;
    const __bName = localStorage.getItem('__bName');
    // this.router.navigate([__bName + '/la']); // TODO remove this it will be after login
    let login = new LOGIN_MASTER();
    let toreturn = false;
    login.user_id = this.f.username.value;
    login.password = this.f.password.value;;
    login.brn_cd = '101';
    this.rstSvc.addUpdDel('AccMst/GetUserDtls', login).subscribe(
      res => {
        debugger;
        console.log('Login Sucess');
        this.msg.sendisLoggedInShowHeader(true);
        this.router.navigate([__bName + '/la']);
      },
      err => { }
    )
  }

  cancel() {
    localStorage.removeItem('__bName');
    this.router.navigate(['/']);
  }
}

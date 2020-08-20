import { ConfigurationService } from './../_service/configuration.service';
import { BankConfiguration } from './Models/bankConfiguration';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InAppMessageService } from '../_service';


@Component({
  selector: 'app-bank-resolver',
  templateUrl: './bank-resolver.component.html',
  styleUrls: ['./bank-resolver.component.css']
})
export class BankResolverComponent implements OnInit, OnDestroy {

  passedValue: BankConfiguration;
  subscription: Subscription;
  showHeader = false;
  constructor(private route: ActivatedRoute, private confSvc: ConfigurationService,
    private msg: InAppMessageService, private router: Router) {
    this.subscription = this.msg.getisLoggedInShowHeader().subscribe(
      res => {
        debugger;
        if (res === null) {
          const __bName = localStorage.getItem('__bName');
          if (__bName !== null) {
            this.router.navigate([__bName]);
          }
          // localStorage.removeItem('__bName');
          // this.router.navigate(['/']);
        } else {
          this.showHeader = res;
        }
      },
      err => { }
    );

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      // this.passedValue =
      debugger;
      const paramValue = param.get('bankName');
      if (null !== paramValue) {
        localStorage.setItem('__bName', paramValue);
        this.confSvc.getConfigurationForName(paramValue).then(
          res => {
            debugger;
            if (undefined === res) {
              // need to block the user

            }
            this.passedValue = res;
          },
          err => { }
        );
      } else {
        // TODO need to think what we will do if the bank name doesnt come
      }
      // console.log(param);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    // this.getSubDomain(1);
  }
}

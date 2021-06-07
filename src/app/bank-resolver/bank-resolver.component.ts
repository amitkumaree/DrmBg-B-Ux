import { ConfigurationService } from './../_service/configuration.service';
import { BankConfiguration } from './Models/bankConfiguration';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InAppMessageService } from '../_service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-bank-resolver',
  templateUrl: './bank-resolver.component.html',
  styleUrls: ['./bank-resolver.component.css']
})
export class BankResolverComponent implements OnInit, OnDestroy {

  passedValue: BankConfiguration;
  subscription: Subscription;
  showHeader = false;
  showTitle = true;
  constructor(private route: ActivatedRoute, private confSvc: ConfigurationService,
    private msg: InAppMessageService, private router: Router, private titleService: Title) {
    this.subscription = this.msg.getisLoggedInShowHeader().subscribe(
      res => {
        ;
        if (res === null) {
          this.route.paramMap.subscribe(param => {
            // this.passedValue =
            ;
            const paramValue = param.get('bankName');
            if (null !== paramValue) {
              localStorage.setItem('__bName', paramValue);
              const __bName = localStorage.getItem('__bName');
              if (__bName !== null) {
                this.router.navigate([__bName]);
              }
              // localStorage.removeItem('__bName');
              // this.router.navigate(['/']);
            } else {
              // TODO need to think what we will do if the bank name doesnt come
            }
            // console.log(param);
          });
        } else {
          this.showHeader = res;
          this.showTitle = false;
          this.titleService.setTitle('Welcome to ' + this.passedValue.description);
        }
      },
      err => { }
    );

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      // this.passedValue =
      ;
      const paramValue = param.get('bankName');
      if (null !== paramValue) {
        localStorage.setItem('__bName', paramValue);
        this.confSvc.getConfigurationForName(paramValue).then(
          res => {
            ;
            if (undefined === res) {
              // need to block the user

            }
            this.passedValue = res;
            this.titleService.setTitle('Welcome to ' + this.passedValue.description);
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

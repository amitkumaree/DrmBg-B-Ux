import { Component, OnInit } from '@angular/core';
import { BankConfiguration } from '../bank-resolver/Models';
import { ConfigurationService } from '../_service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-bank-wise-config',
  templateUrl: './bank-wise-config.component.html',
  styleUrls: ['./bank-wise-config.component.css']
})
export class BankWiseConfigComponent implements OnInit {

  BC: BankConfiguration[] = [];
  // masterConfig: BankConfiguration[] = [];
  allBankConfig: any;

  constructor(private confSvc: ConfigurationService,
              private router: Router,
              private location: Location) { }

  ngOnInit(): void {
    this.getAllConfiguration();
  }


  private getAllConfiguration() {
    this.confSvc.getAllConfiguration().then(
      res => {
        debugger;
        this.BC = res;
        // this.masterConfig = this.BC.filter(
        //   m => m.name === 'MasterConfig');

        this.allBankConfig = this.BC.filter(
            // tslint:disable-next-line: triple-equals
            a => a.name != 'MasterConfig');
      },
      err => { }
    );
  }

  navigateBack() {
    this.location.back();
  }

  navBankConfig(data1: string, data2: string, data3: string) {
    debugger;
    this.router.navigate(['/BankConfig'], {
      queryParams: { bankName: data1, bankUrl: data2 , bankDesc: data3}
    });
  }

}

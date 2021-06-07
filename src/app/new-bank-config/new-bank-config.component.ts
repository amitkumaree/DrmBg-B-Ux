import { Component, OnInit } from '@angular/core';
import { BankConfiguration } from '../bank-resolver/Models';
import { ConfigurationService } from '../_service';
import { Location } from '@angular/common';
import { RestService } from '../_service/rest.service';

@Component({
  selector: 'app-new-bank-config',
  templateUrl: './new-bank-config.component.html',
  styleUrls: ['./new-bank-config.component.css']
})
export class NewBankConfigComponent implements OnInit {


  bcUx: BankConfiguration[] = [];
  bcMst: BankConfiguration[] = [];
  masterConfig: BankConfiguration[] = [];

  tempBankConfiguration = new BankConfiguration();

  spinner = true;
  addFlg = true;
  SaveFlg = false;
  addRec = false;
  showAlert = false;
  alertMsg = '';

  constructor(private confSvc: ConfigurationService,
              private rstSvc: RestService,
              private location: Location) { }

  ngOnInit(): void {
    this.getAllConfigFromMaster();
  }

  private getAllConfigFromMaster() {
    this.spinner = true;
    this.confSvc.getAllConfiguration().then(
      res => {
        ;
        this.bcUx = res;
        this.masterConfig = this.bcUx.filter(
          m => m.name === 'MasterConfig');
           ;
        this.getConfigData(this.masterConfig[0].apiUrl);

      },
      err => { }
    );
  }


  private getConfigData(url: string) {
    url = url + 'api/BankConfigUx';
   ;
    this.rstSvc.getBankJsonConfigUx<any>(url).subscribe(
      res => {
        this.bcMst = res;
        ;
        this.spinner = false;
      },
      err => { }
    );
  }

  private putConfigData(url: string) {
    url = url + 'api/BankConfigUx';
   ;
    this.rstSvc.postBankJsonConfigUx<any>(url , this.bcMst).subscribe(
      res => {
        this.getConfigData(this.masterConfig[0].apiUrl);
        ;
        this.spinner = false;
      },
      err => { }
    );
  }

addBank()
{
  this.addFlg = false;
  this.SaveFlg = true;
  this.addRec = true;
}

saveData()
{

  // tslint:disable-next-line: max-line-length
  if ( this.tempBankConfiguration.name !== '' && this.tempBankConfiguration.description !== '' && this.tempBankConfiguration.apiUrl !== '') {
  ;
  this.spinner = true;
  this.bcMst.push(this.tempBankConfiguration);
  this.tempBankConfiguration = new BankConfiguration();
  this.putConfigData(this.masterConfig[0].apiUrl);
  this.addFlg = true;
  this.SaveFlg = false;
  this.addRec = false;
  }
  else
  {
    ;
    this.showAlert = true;
    this.alertMsg = 'Can not be blank';

  }
}

cancel()
{
  this.getConfigData(this.masterConfig[0].apiUrl);
  this.addRec = false;
  this.SaveFlg = false;
  this.addFlg = true;
  this.showAlert = false;

}

closeAlert() {
  this.showAlert = false;
}

  navigateBack() {
    this.location.back();
  }

}

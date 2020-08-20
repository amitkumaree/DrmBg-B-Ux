
import { BankConfiguration } from '../bank-resolver/Models';
import { ConfigurationService } from '../_service';
import { Router } from '@angular/router';
import { OnInit, Component } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  BC: BankConfiguration[] = [];
  masterConfig: BankConfiguration[] = [];
  allBankConfig: any;

  constructor(private confSvc: ConfigurationService,
              private router: Router) { }

  ngOnInit(): void {
    this.getAllConfiguration();
  }


  private getAllConfiguration() {
    this.confSvc.getAllConfiguration().then(
      res => {
        this.BC = res;

        this.masterConfig = this.BC.filter(
          m => m.name === 'MasterConfig');

        this.allBankConfig = this.BC.filter(
            // tslint:disable-next-line: triple-equals
            a => a.name != 'MasterConfig');
      },
      err => { }
    );
  }

  navMasterConfig() {
    this.router.navigate(['/MasterConfig'], );
  }

  navBankWiseConfig() {
    this.router.navigate(['/BankWiseConfig'], );
  }

  configNewBank() {
    this.router.navigate(['/NewBankConfig'], );
  }


}

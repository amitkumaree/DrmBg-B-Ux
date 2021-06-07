import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RestService } from '../_service/rest.service';
import { mainmenu, BankConfigMst, submenu, screenlist, NewConfigRec } from '../bank-resolver/Models';
import { BankConfiguration } from '../bank-resolver/Models';
import { ConfigurationService } from '../_service';





@Component({
  selector: 'app-master-config',
  templateUrl: './master-config.component.html',
  styleUrls: ['./master-config.component.css']
})
export class MasterConfigComponent implements OnInit {

  constructor(private router: ActivatedRoute,
    private location: Location,
    private rstSvc: RestService,
    private confSvc: ConfigurationService
  ) { }

  bankUrl: string;
  BC: BankConfiguration[] = [];
  masterConfig: BankConfiguration[] = [];
  allBankConfig: any;

  masterBankConfigMst = new BankConfigMst();

  tempMenu = new mainmenu();
  tempManuName: string;
  tempSubManuName: string;
  tempSubMenu = new submenu();
  viewSubmenu: submenu[];
  tempScreenlist = new screenlist();
  viewScreenlist: screenlist[];

  tempMasterNewConfigRec = new NewConfigRec();
  // tempNewConfigRec = new NewConfigRec();
  tempAllBankNewConfigRecList: NewConfigRec[] = [];


spinner = true;

addScreenFlg = true;
addMenuFlg = true;
addModuleFlg = true;

  menuFlg = false;
  showSubMenuFlg = false;
  createSubMenuFlg = false;
  showScreenFlg = false;
  createScreenFlg = false;
  showJsonFlg = false;
  saveAllFlg = false;

  alertMsg = '';
  showAlert = false;

  ngOnInit(): void {
    this.getAllConfiguration();
  }


  private getAllConfiguration() {
    this.confSvc.getAllConfiguration().then(
      res => {
        this.BC = res;

        this.masterConfig = this.BC.filter(
          m => m.name === 'MasterConfig');

        this.getMasterBankJsonConfigData(this.masterConfig[0].apiUrl);

        this.allBankConfig = this.BC.filter(
          a => {
            return a.name !== 'MasterConfig';
          });
        ;
        this.getAllBankJsonConfigData(this.allBankConfig);

      },
      err => { }
    );
  }

  private getMasterBankJsonConfigData(url: string) {
    url = url + 'api/BankConfigMst';
    ;
    this.spinner = true;
    this.rstSvc.getBankJsonConfig<any>(url).subscribe(
      res => {
        ;
        this.masterBankConfigMst = res;
        this.spinner = false;
      },
      err => { }
    );
  }

  private getAllBankJsonConfigData(allBankConfig: any) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < allBankConfig.length; i++) {
      const ur = allBankConfig[i].apiUrl + 'api/BankConfigMst';
      const configRec = new NewConfigRec();

      this.rstSvc.getBankJsonConfig<any>(ur).subscribe(
        res => {
          configRec.connstring = ur;
          configRec.BankConfigMst = res;
          this.tempAllBankNewConfigRecList.push(configRec);
          ;
        },
        err => { }
      );
    }
  }

  private postJsonConfigData(url: string, data: BankConfigMst, bankTyp: string) {
    this.spinner = true;

    if (bankTyp === 'MASTER') {
      const tempUrl = url + 'api/BankConfigMst';
      this.rstSvc.postBankJsonConfig<any>(tempUrl, data).subscribe(res => {
        this.getMasterBankJsonConfigData(url);
      },
        err => { });
    }
    else {
      this.rstSvc.postBankJsonConfig<any>(url, data).subscribe(res => {
      },
        err => { });
    }
  }

  navigateBack() {
    this.location.back();
  }

  updateData() {

    this.spinner = true;
    this.showSubMenuFlg = false;
    this.showScreenFlg = false;

    this.createSubMenuFlg = false;
    this.createScreenFlg = false;

    this.postJsonConfigData(this.masterConfig[0].apiUrl, this.masterBankConfigMst, 'MASTER');
    ;
    this.populateAllBankJsonData();
    this.updateAllBankJsonData();
    this.addScreenFlg = true;
    this.saveAllFlg = false;

    this.addMenuFlg = true;
    this.addModuleFlg = true;

  }

  updateAllBankJsonData() {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.tempAllBankNewConfigRecList.length; i++) {
      this.postJsonConfigData(this.tempAllBankNewConfigRecList[i].connstring, this.tempAllBankNewConfigRecList[i].BankConfigMst, 'ALL');

    }
  }

  showJson() {
    this.showJsonFlg = true;
  }

  hideJson() {
    this.showJsonFlg = false;
  }

  createMenu() {
    this.menuFlg = true;

    this.showSubMenuFlg = false;
    this.showScreenFlg = false;
  }

  acceptMenu() {
    ;
    if (this.tempMenu.name !== '') {
      this.masterBankConfigMst.menu.push(this.tempMenu);
      this.menuFlg = false;
      this.tempMenu = new mainmenu();

      this.showAlert = false;
    }
    else {
      this.showAlert = true;
      this.alertMsg = 'Blank module name!!';
    }
  }

  cancelMenu() {
    this.menuFlg = false;
    this.tempMenu = new mainmenu();
  }

  // ----------------------------------------
  showSubMenu(menuName: string, subMenu: submenu[]) {
    this.tempMasterNewConfigRec.module = menuName;
    this.showSubMenuFlg = true;
    this.showScreenFlg = false;
    this.viewSubmenu = subMenu;
    this.tempManuName = menuName;
  }

  createSubMenu() {
    this.createSubMenuFlg = true;
    this.showScreenFlg = false;
  }

  acceptSubMenu() {
    ;
    if (this.tempSubMenu.name !== '') {
      this.viewSubmenu.push(this.tempSubMenu);
      this.createSubMenuFlg = false;
      this.tempSubMenu = new submenu();

      this.showAlert = false;
    }
    else {
      this.showAlert = true;
      this.alertMsg = 'Blank menu name!!';
    }
  }

  closeAlert() {
    this.showAlert = false;
  }

  cancelSubMenu() {
    this.createSubMenuFlg = false;
    this.tempSubMenu = new submenu();
  }

  // ----------------------------------------


  showScreenList(subMenuName: string, screenList: screenlist[]) {
    this.tempMasterNewConfigRec.menu = subMenuName;
    this.showScreenFlg = true;
    this.viewScreenlist = screenList;
    this.tempSubManuName = subMenuName;
  }

  createScreenList() {
    this.createScreenFlg = true;
    this.addScreenFlg = false;
  }

  acceptScreenList() {

    if (this.tempScreenlist.screen !== '' && this.tempScreenlist.value !== '') {
      this.tempMasterNewConfigRec.screen = this.tempScreenlist.screen;
      this.tempMasterNewConfigRec.value = this.tempScreenlist.value;
      this.saveAllFlg = true;

      this.viewScreenlist.push(this.tempScreenlist);
      this.createScreenFlg = false;
      this.tempScreenlist = new screenlist();
      this.addScreenFlg = false;
      this.addMenuFlg = false;
      this.addModuleFlg = false;

      this.showAlert = false;
    }
    else {
      this.showAlert = true;
      this.alertMsg = 'Blank screen/value name!!';
    }
  }


  populateAllBankJsonData() {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.tempAllBankNewConfigRecList.length; i++) {
      let moduleFoundFlg = 0;
      let menuFoundFlg = 0;

      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < this.tempAllBankNewConfigRecList[i].BankConfigMst.menu.length; j++) {
        if (this.tempAllBankNewConfigRecList[i].BankConfigMst.menu[j].name === this.tempMasterNewConfigRec.module) {
          moduleFoundFlg = 1;
          // tslint:disable-next-line: prefer-for-of
          for (let k = 0; k < this.tempAllBankNewConfigRecList[i].BankConfigMst.menu[j].menu.length; k++) {
            if (this.tempAllBankNewConfigRecList[i].BankConfigMst.menu[j].menu[k].name === this.tempMasterNewConfigRec.menu) {
              menuFoundFlg = 1;

              const newScreen = new screenlist();
              newScreen.screen = this.tempMasterNewConfigRec.screen;
              newScreen.value = this.tempMasterNewConfigRec.value;
              ;
              newScreen.activeflag = this.tempAllBankNewConfigRecList[i].active;

              this.tempAllBankNewConfigRecList[i].BankConfigMst.menu[j].menu[k].menu.push(newScreen);
            } // end if
          } // end loop

          if (menuFoundFlg === 0) {
            const newSubmenu = new submenu();
            const newScreen = new screenlist();

            newSubmenu.name = this.tempMasterNewConfigRec.menu;

            newScreen.screen = this.tempMasterNewConfigRec.screen;
            newScreen.value = this.tempMasterNewConfigRec.value;
            newScreen.activeflag = this.tempAllBankNewConfigRecList[i].active;

            newSubmenu.menu.push(newScreen);
            this.tempAllBankNewConfigRecList[i].BankConfigMst.menu[j].menu.push(newSubmenu);

          } // end if
        }  // end if
      } // end loop

      if (moduleFoundFlg === 0) {

        const newMainmenu = new mainmenu();
        const newSubmenu = new submenu();
        const newScreen = new screenlist();

        newMainmenu.name = this.tempMasterNewConfigRec.module;
        newSubmenu.name = this.tempMasterNewConfigRec.menu;

        newScreen.screen = this.tempMasterNewConfigRec.screen;
        newScreen.value = this.tempMasterNewConfigRec.value;
        newScreen.activeflag = this.tempMasterNewConfigRec.active;

        newSubmenu.menu.push(newScreen);
        newMainmenu.menu.push(newSubmenu);

        this.tempAllBankNewConfigRecList[i].BankConfigMst.menu.push(newMainmenu);

      } // end if

    }
  }


  cancelScreen() {
    this.createScreenFlg = false;
    this.tempMenu = new mainmenu();
    this.addScreenFlg = true;

  }

  cancelReset() {
      this.getAllConfiguration();

      this.showSubMenuFlg = false;
      this.showScreenFlg = false;

      this.addScreenFlg = true;
      this.addMenuFlg = true;
      this.addModuleFlg = true;

      this.saveAllFlg = false;
    }

    showEvent(x: any) {
      ;
      console.log(x);
    }

}

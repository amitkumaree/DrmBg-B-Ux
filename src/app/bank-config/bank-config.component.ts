import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RestService } from '../_service/rest.service';
import { mainmenu, BankConfigMst, submenu, screenlist } from '../bank-resolver/Models';


@Component({
  selector: 'app-bank-config',
  templateUrl: './bank-config.component.html',
  styleUrls: ['./bank-config.component.css']
})
export class BankConfigComponent implements OnInit {

  constructor(private router: ActivatedRoute,
              private location: Location,
              private rstSvc: RestService,
              ) { }


  // scr = new screenlist();
  bankUrl: string;
  bankDescUx: string;
  bankConfigMst = new BankConfigMst();

  tempMenu = new mainmenu();
  tempManuName: string;
  tempSubManuName: string;
  tempSubMenu = new submenu();
  viewSubmenu: submenu [];
  tempScreenlist = new screenlist();
  viewScreenlist: screenlist [];

spinner = true;
menuFlg = false;
showSubMenuFlg = false;
createSubMenuFlg = false;
showScreenFlg = false;
createScreenFlg = false;
showJsonFlg = false;

passFlg = false;
showPass = false;


  ngOnInit(): void {
    this.router.queryParams.subscribe(
      params => {
        // console.log('Got the JWT as: ', params['bankName']);
        // this.BankName =  params['bankName'];
        // this.BankUrl = params['bankUrl'];
        this.bankUrl = params['bankUrl'];
        this.bankDescUx = params['bankDesc'];

        debugger;
        this.getBankJsonConfigData(this.bankUrl);


      }
    )
  }

  private getBankJsonConfigData(url: string)
    {
      url = url + 'api/BankConfigMst';

      debugger;
      this.rstSvc.getBankJsonConfig<any>(url).subscribe(
        res => {
          debugger;
          this.bankConfigMst = res;
          // tslint:disable-next-line: triple-equals
          if ( this.bankConfigMst.bankname != this.bankDescUx)
          {
             this.bankConfigMst.bankname = this.bankDescUx;
          }
          this.spinner = false;
               },
        err => { }
      );
    }


    private postBankJsonConfigData()
    {
      this.spinner = true;

      let url = this.bankUrl + 'api/BankConfigMst';
      debugger;
      this.rstSvc.postBankJsonConfig<any>(url, this.bankConfigMst).subscribe(res => {
        this.getBankJsonConfigData(this.bankUrl);
             },
      err => { });
    }

navigateBack(){
      this.location.back();
       }

updateData()
{

  this.spinner = true;
  this.showSubMenuFlg = false;
  this.showScreenFlg = false;

  this.postBankJsonConfigData();
  this.createSubMenuFlg = false;
  this.createScreenFlg = false;

}

showJson()
{
this.showJsonFlg = true;
}

hideJson()
{
this.showJsonFlg = false;
}
// --------------------------

// createMenu()
// {
//   this.menuFlg = true;
// }

//
// acceptMenu()
// {
//   this.bankConfigMst.menu.push(this.tempMenu);
//   this.menuFlg = false;
//   this.tempMenu = new mainmenu();
// }

// cancelMenu()
// {
//   this.menuFlg = false;
//   this.tempMenu = new mainmenu();
// }

// ----------------------------------------
showSubMenu(menuName: string, subMenu: submenu[])
{
  this.showSubMenuFlg = true;
  this.showScreenFlg = false;
  this.viewSubmenu = subMenu;
  this.tempManuName = menuName;
}

// createSubMenu()
// {
//   this.createSubMenuFlg = true;
// }

// acceptSubMenu()
// {
//   this.viewSubmenu.push(this.tempSubMenu);
//   this.createSubMenuFlg = false;
//   this.tempSubMenu = new submenu();
// }

// cancelSubMenu()
// {
//   this.createSubMenuFlg = false;
//   this.tempSubMenu = new submenu();
// }

// ----------------------------------------


showScreenList(subMenuName: string, screenList: screenlist[])
{
  this.showScreenFlg = true;
  this.viewScreenlist = screenList;
  this.tempSubManuName = subMenuName;
}

showPassword()
{
  if (this.showPass)
  { this.showPass = false;
  }
  else
  {
    this.showPass = true;
  }
}

showEvent(x: any)
{
  debugger;
  console.log(x);
}

}

import { BankConfiguration } from './../Models/bankConfiguration';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { InAppMessageService, RestService } from 'src/app/_service';
import { BankConfigMst, mainmenu, submenu, screenlist, SystemValues } from '../Models';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private rstSvc: RestService, private router: Router,
              private msg: InAppMessageService) {
      this.subscription = this.msg.gethideTitleOnHeader().subscribe(
        res => {
          ;
          if (res){
            this.hideScreenTitle();
          }
        },
        err => { }
      );
  }

  subscription: Subscription;
  collapsed = true;
  bankConfig: BankConfigMst;
  bankName: string;
  childMenu: mainmenu;
  subMenu: submenu;
  showMenu = false;
  showChildMenu = false;
  showSubMenu = false;
  showScreenTitle = false;
  selectedScreenToShow: string;
  sys = new SystemValues();

  ngOnInit(): void {
    this.bankName = localStorage.getItem('__bName');
    this.getBankConfigMaster();

  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  getBankConfigMaster() {
    this.rstSvc.getAll<BankConfigMst>('BankConfigMst').subscribe(
      res => {
        ;
        console.log(res);
        this.bankConfig = res;
        this.showMenu = true;
        this.showChildMenu = false;
        this.showSubMenu = false;
        // TODO roles if required.
      },
      err => { }
    )
  }

  logout() {
    // localStorage.removeItem('__bName');
    // this.router.navigate(['/']);
    localStorage.removeItem('__brnName');
    localStorage.removeItem('__brnCd');
    localStorage.removeItem('__currentDate');
    localStorage.removeItem('__cashaccountCD');
    localStorage.removeItem('__ddsPeriod');
    localStorage.removeItem('__userId');
    this.msg.sendisLoggedInShowHeader(false);
    this.router.navigate([this.bankName + '/login']);
  }

  goToHome() {
    this.router.navigate([this.bankName + '/la']);
    this.showMenu = true;
    this.showChildMenu = false;
    this.showSubMenu = false;
    this.showScreenTitle = false;
  }

  showChildMenuFor(menu: mainmenu): void {
    ;
    this.childMenu = menu;
    this.subMenu = null;
    this.showMenu = false;
    this.showChildMenu = true;
    this.showSubMenu = false;
    this.router.navigate([this.bankName + '/la']);
  }

  showSubChildMenuFor(submenu: submenu): void {
    ;
    this.subMenu = submenu;
    this.showMenu = false;
    this.showChildMenu = false;
    this.showSubMenu = true;
    this.router.navigate([this.bankName + '/la']);
  }

  gotoScreen(screen: screenlist): void {
    this.showScreenTitle = true;
    this.selectedScreenToShow = ''; // reset values;
    this.selectedScreenToShow = screen.screen;
    this.router.navigate([this.bankName + '/' + screen.value]);
  }

  back(fromwhere: string) {
    if (fromwhere === 'sub') {
      this.showMenu = false;
      this.showChildMenu = true;
      this.showSubMenu = false;
    } else if (fromwhere === 'child') {
      this.showMenu = true;
      this.showChildMenu = false;
      this.showSubMenu = false;
    }
    this.hideScreenTitle();
    this.router.navigate([this.bankName + '/la']);
  }

  private hideScreenTitle(): void {
    this.showScreenTitle = false;
    // this.selectedScreenToShow = '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

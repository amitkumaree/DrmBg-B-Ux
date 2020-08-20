import { BankConfiguration } from './../Models/bankConfiguration';
import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/_service';
import { BankConfigMst, mainmenu, submenu, screenlist } from '../Models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  collapsed = true;
  bankConfig: BankConfigMst;
  bankName: string;
  childMenu: mainmenu;
  subMenu: submenu;
  showMenu = false;
  showChildMenu = false;
  showSubMenu = false;
  constructor(private rstSvc: RestService, private router: Router) { }

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
        debugger;
        console.log(res);
        this.bankConfig = res;
        this.showMenu = true;
        this.showChildMenu = false;
        this.showSubMenu = false;
      },
      err => { }
    )
  }
  logout() {
    localStorage.removeItem('__bName');
    this.router.navigate(['/']);
  }
  showChildMenuFor(menu: mainmenu): void {
    debugger;
    this.childMenu = menu;
    this.subMenu = null;
    this.showMenu = false;
    this.showChildMenu = true;
    this.showSubMenu = false;
    this.router.navigate([this.bankName + '/la']);
  }

  showSubChildMenuFor(submenu: submenu): void {
    debugger;
    this.subMenu = submenu;
    this.showMenu = false;
    this.showChildMenu = false;
    this.showSubMenu = true;
    this.router.navigate([this.bankName + '/la']);
  }

  gotoScreen(screen: screenlist): void {
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
    this.router.navigate([this.bankName + '/la']);
  }
}

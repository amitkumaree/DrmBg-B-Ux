import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/_service';
import { mm_customer } from '../Models';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private svc: RestService) { }
  custTitle: string;
  cust: mm_customer;
  showCust = false;

  ngOnInit(): void {
    this.getAccInfo();
  }
  private getAccInfo(): void {
    this.showCust = false;
    const cust = new mm_customer(); cust.cust_cd = 1011686;
    this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
      res => {
        this.custTitle = 'Personal Information';
        this.cust = res[0];
        this.showCust = true;
      },
      err => {  }
    );

  }
}

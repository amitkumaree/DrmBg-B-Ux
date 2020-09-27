import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor() { }

  transTypeFlg = 0;
  accountType = 1;

  ngOnInit(): void {
  }


setTransType(val: any)
{
  this.transTypeFlg = val;
}

setAccountType(val: any)
{
  debugger;
  if (val == "?")
  {
    val = 1;
  }
   this.accountType = val;
}


xxxxxxxx(val: any)
{
   null;
}


}

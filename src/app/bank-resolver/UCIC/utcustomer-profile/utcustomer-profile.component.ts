import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-utcustomer-profile',
  templateUrl: './utcustomer-profile.component.html',
  styleUrls: ['./utcustomer-profile.component.css']
})
export class UTCustomerProfileComponent implements OnInit {

  custMstrFrm: FormGroup;
  constructor(private frmBldr: FormBuilder) { }

  ngOnInit(): void {
    // this.custMstrFrm = this.frmBldr.group(
    //   {
    //     CustType:
    //   }
    )
  }

}

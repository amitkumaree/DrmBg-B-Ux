import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestService } from 'src/app/_service';

@Component({
  selector: 'app-acc-opening',
  templateUrl: './acc-opening.component.html',
  styleUrls: ['./acc-opening.component.css']
})
export class AccOpeningComponent implements OnInit {

  constructor() { }

  showScreen = 1;

  ngOnInit(): void {

    // debugger;
    // this.showScreen = 1;
    // console.log(this.showScreen);


  }

}

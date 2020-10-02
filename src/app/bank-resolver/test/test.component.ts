import { Component, OnInit } from '@angular/core';
import { InAppMessageService } from 'src/app/_service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private msg: InAppMessageService) { }

  ngOnInit(): void {
    this.msg.sendCommonCustInfoCustCd(1011686);
  }

}

import { InAppMessageService } from './../../_service/in-app-message.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private msg: InAppMessageService) { }

  ngOnInit(): void {
    // when ever landing is loaded screen title should be hidden
    this.msg.sendhideTitleOnHeader(true);
  }

}

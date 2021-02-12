import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ng-init',
  templateUrl: './ng-init.component.html',
  styleUrls: ['./ng-init.component.scss']
})
export class NgInitComponent implements OnInit {
  title = 'pp-fal-front';
  constructor() { }

  ngOnInit(): void {
  }

}

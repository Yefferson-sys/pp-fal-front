import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dynamic-modal',
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.scss']
})
export class DynamicModalComponent implements OnInit {
  @Input() optionsModal: any;
  @Input() type: string;
  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dynamic-modal',
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.scss']
})
export class DynamicModalComponent implements OnInit {
  @Input() optionsModal: any;
  @Input() type: string;
  @Output() confirm = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }
  onConfirm() {
    this.confirm.emit(this.type);
  }
}

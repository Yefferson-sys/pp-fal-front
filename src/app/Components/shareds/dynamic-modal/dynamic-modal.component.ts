import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { OptionsModal } from 'src/app/Models/dynamic-modal.model';

@Component({
  selector: 'app-dynamic-modal',
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.scss']
})
export class DynamicModalComponent implements OnInit {
  @Input() optionsModal: OptionsModal;
  @Input() type: string;
  @Output() confirm = new EventEmitter<string>();
  @Output() denied = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }
  onConfirm() {
    this.confirm.emit(this.type);
  }
  onDenied() {
    this.denied.emit('denied');
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-popup',
  templateUrl: './modal-popup.component.html'
})
export class ModalPopupComponent implements OnInit {
  @Input('openPopup') openPopup;
  @Input('meetingListObject') meetingListObject;
  @Input('viewMeetingList') viewMeetingList;
  @Output() closePopup: EventEmitter<any> = new EventEmitter();
  showScroll;
  showStaticMsg;
  showWarningMsg = false;
  showLists;
  initialArray;
  selectedId;
  warningMsg = `Are you sure you want to delete this meeting ?`;

  constructor() { }

  ngOnInit(): void {
    this.checkListLength();
  }

  checkListLength() {
    this.showScroll = this.meetingListObject.meetingList.length > 2;
    this.showStaticMsg = this.meetingListObject.meetingList.length === 0;
    this.showLists = this.meetingListObject.meetingList.length > 0;
  }

  closeModalPopup() {
    this.openPopup = false;
    this.closePopup.emit(true);
  }

  deleteRecord(id) {
    this.selectedId = id;
    this.showWarningMsg = true;
  }

  confirmDelete() {
    this.showWarningMsg = false;
    this.meetingListObject.meetingList = this.meetingListObject.meetingList.filter(element => {
      return element.meetingId != this.selectedId;
    });
    this.checkListLength();
  }

  cancelDelete() {
    this.showWarningMsg = false;
    this.checkListLength();
  }

}

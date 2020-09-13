import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RoomConfig } from '../../shared/config';
import * as _ from 'lodash';

@Component({
  selector: 'app-room-element',
  templateUrl: './room-element.component.html'
})
export class RoomElementComponent implements OnInit {
  roomConfig = RoomConfig;
  showError = false;
  openPopup = false;
  disableButton = true;
  meetingStartTimeInAmorPm;
  meetingEndTimeInAmorPm;
  currentDate = new Date();
  selectedId;
  formattedDate;
  errorMsg = `The meeting rooms can be booked between 9:00AM and 6:00PM on Monday to Friday. The duration for the meetings to be scheduled
  should be minimum 30 minutes. Please check the entries and try again.`;
  dateTimeForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.dateTimeForm = this.fb.group({
      Date: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      Agenda: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    let month = String(this.currentDate.getMonth() + 1).padStart(2, '0');
    let date = String(this.currentDate.getDate()).padStart(2, '0');
    let year = this.currentDate.getFullYear();
    this.formattedDate = year + '-' + month + '-' + date;
    this.dateTimeForm.valueChanges.subscribe(value => {
      this.disableButton = true;
    });
  }

  openModalPupup(id) {
    this.selectedId = id;
    this.roomConfig.forEach((element) => {
      if (element.id === id) {
        element['openPopup'] = true;
        element['viewMeetingList'] = true;
      } else {
        element['openPopup'] = false;
        element['viewMeetingList'] = false;
      }
    })
  }

  openModalPupupForMeeetingsBooking(id) {
    this.selectedId = id;
    this.roomConfig.forEach((element) => {
      element['viewMeetingList'] = false;
      if (element.id === id) {
        element['openPopup'] = true;
        element.meetingList.push({
          meetingId: element.meetingList.length + Math.random(),
          userName: this.dateTimeForm.controls['userName'].value,
          Agenda: this.dateTimeForm.controls['Agenda'].value,
          startTime: this.dateTimeForm.controls['startTime'].value,
          endTime: this.dateTimeForm.controls['endTime'].value,
          meetingDate: this.dateTimeForm.controls['Date'].value,
          displayStartTime: this.meetingStartTimeInAmorPm,
          displayEndTime: this.meetingEndTimeInAmorPm
        });
      } else {
        element['openPopup'] = false;
      }
    });
  }

  closeModalPopup(event) {
    _.find(this.roomConfig, { id: this.selectedId }).openPopup = false;
    this.checkAvailability();
  }

  onCheckAvailabilityClick() {
    let selectedDate = new Date(this.dateTimeForm.controls['Date'].value);
    let startingTime = this.dateTimeForm.controls['startTime'].value;
    let endTime = this.dateTimeForm.controls['endTime'].value;
    let startingHour = (new Date(this.formattedDate + ' ' + startingTime)).getHours();
    let amOrPmStartTime = startingHour > 12 ? ' PM' : ' AM';
    let endingHour = (new Date(this.formattedDate + ' ' + endTime)).getHours();
    let amOrPmEndTime = endingHour > 12 ? ' PM' : ' AM';
    let startingMin = (new Date(this.formattedDate + ' ' + startingTime)).getMinutes();
    let endingMin = (new Date(this.formattedDate + ' ' + endTime)).getMinutes();
    let totalMinDiff = (Math.abs(endingHour - startingHour) * 60 + Math.abs(startingMin - endingMin));
    this.meetingStartTimeInAmorPm = amOrPmStartTime === ' PM' ? (startingHour - 12) + ':' + startingMin + amOrPmStartTime :
      startingHour + ':' + startingMin + amOrPmStartTime;
    this.meetingEndTimeInAmorPm = amOrPmEndTime === ' PM' ? (endingHour - 12) + ':' + endingMin + amOrPmEndTime :
      endingHour + ':' + endingMin + amOrPmEndTime;
    if (selectedDate.getDay() <= 5 && selectedDate.getDay() >= 1 && startingTime >= '09:00'
      && endTime <= '18:00' && (endTime > startingTime) && totalMinDiff >= 30) {
      this.showError = false;
      this.checkAvailability();
    } else {
      this.showError = true;
    }
  }

  checkAvailability() {
    this.disableButton = false;
    this.roomConfig.forEach((element) => {
      if (element.meetingList.length > 0) {
        element.meetingList.some((value) => {
          if ((new Date(this.dateTimeForm.controls['Date'].value)).getTime() ===
            (new Date(value.meetingDate)).getTime()) {
            if (this.dateTimeForm.controls['startTime'].value >= value.endTime &&
              this.dateTimeForm.controls['endTime'].value >= value.startTime) {
              element.available = true;
              element.inUse = false;
              element.booked = false;
            } else {
              if (this.dateTimeForm.controls['userName'].value === value.userName) {
                element.inUse = false;
                element.available = false;
                element.booked = true;
              } else {
                element.inUse = true;
                element.available = false;
                element.booked = false;
              }
              return true;
            }
          } else {
            element.available = true;
            element.inUse = false;
            element.booked = false;
          }
        });
      } else {
        element.available = true;
        element.inUse = false;
        element.booked = false;
      }
    });
  }

  onResetClick() {
    this.disableButton = true;
    this.showError = false;
    this.dateTimeForm.controls['Date'].reset('');
    this.dateTimeForm.controls['startTime'].reset('');
    this.dateTimeForm.controls['endTime'].reset('');
    this.dateTimeForm.controls['userName'].reset('');
    this.dateTimeForm.controls['Agenda'].reset('');
    this.roomConfig.forEach((element) => {
      element.available = false;
      element.inUse = false;
      element.booked = false;
    });
  }

}

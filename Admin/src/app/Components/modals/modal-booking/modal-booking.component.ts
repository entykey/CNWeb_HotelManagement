import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder, Validator, Validators } from '@angular/forms';
import { RoomtypeService } from '../../../Services/roomtype.service';
import { ReservationService } from '../../../Services/reservation.service';
import { RoomService } from '../../../Services/room.service';
import { SnackbarService } from '../../../Services/snackbar.service';
@Component({
  selector: 'app-modal-booking',
  templateUrl: './modal-booking.component.html',
  styleUrls: ['./modal-booking.component.css']
})
export class ModalBookingComponent {
  // roomtypes: any[] = [];
  // mangSoLuongPhong: any = [];
  // dateCheckin: string = ""
  // dateCheckout: string = ""
  // FormBooking!: FormGroup;
  // submitted = false;
  roomtypes?: any[];
  mangSoLuongPhong: any = []
  mindateCheckin?: string
  mindateCheckout?: string
  dateCheckin?: string
  dateCheckout?: string
  FormBooking!: FormGroup;
  submitted = false;

  constructor(public dialogRef: MatDialogRef<ModalBookingComponent>,
    private formBuilder: FormBuilder,
    private roomTypeService: RoomtypeService,
    private reservationService: ReservationService,
    private snkbr: SnackbarService,
    private roomService: RoomService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  DateToString(date: Date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`
  }

  async LaySoLuongPhongTrong(roomtypes: any[], dateCheckin: string, dateCheckout: string) {
    let data = {
      "guestFullName": "string",
      "guestPhoneNumber": "+0",
      "guestEmail": "string",
      "roomTypeId": "",
      "startTime": dateCheckin,
      "endTime": dateCheckout,
      "numberOfRooms": 1,
      "specialNote": "string"
    }

    for (let roomtype of roomtypes) {
      data.roomTypeId = roomtype.roomTypeID
      let slp = await this.roomService.getRoomNotServe(data).toPromise()
      roomtype.slp = new Array(slp?.length)
    }
    return roomtypes
  }

  async ngOnInit() {
    this.FormBooking = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      sodienthoai: ['', [Validators.required, Validators.maxLength(10)]],
      yeucau: ['']
    })
    this.roomtypes = await this.roomTypeService.getAllRoomTypes().toPromise()
    let date = new Date()
    date.setDate(date.getDate() + 1)
    this.mindateCheckin = this.dateCheckin = this.DateToString(date)
    date.setDate(date.getDate() + 1)
    this.mindateCheckout = this.dateCheckout = this.DateToString(date)

    this.roomtypes = await this.LaySoLuongPhongTrong(this.roomtypes!, this.dateCheckin, this.dateCheckout)
  }

  async onChange() {
    let Ddate2 = new Date(this.dateCheckout!)
    let Ddate1 = new Date(this.dateCheckin!)
    let date = new Date(this.dateCheckin!)
    date.setDate(date.getDate() + 1)
    if (Ddate1 >= Ddate2) {
      this.dateCheckout = this.DateToString(date)
    }
    this.mindateCheckout = this.DateToString(date)

    this.roomtypes = await this.LaySoLuongPhongTrong(this.roomtypes!, this.dateCheckin!, this.dateCheckout!)
  }

  async onChange2(){
    this.roomtypes = await this.LaySoLuongPhongTrong(this.roomtypes!, this.dateCheckin!, this.dateCheckout!)
  }


  async onSubmit() {
    this.submitted = true;
    if (this.FormBooking.invalid) {
      return
    }
    else {
      let check = false;
      this.mangSoLuongPhong = []
      let inputSoLuongPhong: any = document.getElementsByClassName("soluongphong")
      inputSoLuongPhong = [...inputSoLuongPhong]
      for (let i of inputSoLuongPhong) {
        let item = { id: i.id, name: i.name, number: i.value }
        this.mangSoLuongPhong.push(item);
        if (i.value > 0) check = true
      }
      if (!check) {
        this.snkbr.openSnackBar("Bạn phải chọn số lượng phòng", "failed")
        return
      }
      let data = {
        "guestFullName": this.FormBooking.value.name,
        "guestPhoneNumber": "+" + this.FormBooking.value.sodienthoai,
        "guestEmail": this.FormBooking.value.email,
        "roomTypeId": "",
        "startTime": this.dateCheckin,
        "endTime": this.dateCheckout,
        "numberOfRooms": 0,
        "specialNote": this.FormBooking.value.yeucau
      }
      let checkSoLuongPhong = true
      for (let i of this.mangSoLuongPhong) {
        if (i.number == 0) continue
        data.roomTypeId = i.id
        data.numberOfRooms = Number(i.number)
        let slp = await this.roomService.getRoomNotServe(data).toPromise()
        if (slp!.length < data.numberOfRooms) {
          checkSoLuongPhong = false
        }
      }

      if (checkSoLuongPhong) {
        for (let i of this.mangSoLuongPhong) {
          if (i.number == 0) continue
          data.roomTypeId = i.id
          data.numberOfRooms = Number(i.number)
          await this.reservationService.Book(data).toPromise()
          this.onNoClick()
        }
        this.snkbr.openSnackBar("Bạn đã đặt phòng thành công", "success")
      }
      else {
        this.snkbr.openSnackBar("Khách sạn không đủ phòng", "failed")
      }


    }
  }

}

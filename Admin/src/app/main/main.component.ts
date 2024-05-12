import { Component } from '@angular/core';
import { UserStorageService } from '../Services/userStorage.service';
import { ReservationService } from '../Services/reservation.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  thongbao:number=0
  constructor (private usrSvc: UserStorageService, private reservayionService:ReservationService) {
    this.reservayionService.addEventFirstTime((data:any)=>{
      this.thongbao = this.thongbao+1
    })
  };
  delete(){
    this.thongbao = 0
  }
  user : string = this.usrSvc.getUserName();
  role: string = this.usrSvc.getUserRole();
  onLogout()
  {
    this.usrSvc.clearLocalStorage();
    console.log(localStorage.getItem('accessToken')??'null')
  }

}

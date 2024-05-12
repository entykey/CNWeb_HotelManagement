import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private api ="https://qlkhachsanapi20231224125247.azurewebsites.net/api/Reservation/NewReserveRooms"
  
  constructor(private http:HttpClient) { }
  DatPhong(data: any):any{
    return this.http.post<any>(this.api, data)
  }
}

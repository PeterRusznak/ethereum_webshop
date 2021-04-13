import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentIdConfig {
  paymentId: string;
}
export interface DownloadUrlConfig {
  url: string;
}
@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http_client: HttpClient) { }

  url: string = "http://localhost:4000/api/";

  getPaymentId(id: string): Observable<PaymentIdConfig> {
    const requestUrl = this.url + "getPaymentId/" + id;
    console.log(requestUrl);
    return this.http_client.get<PaymentIdConfig>(requestUrl);
  }

  getDownloadableUrl(paymentId: string): Observable<DownloadUrlConfig> {
    const requestUrl = this.url + "getUrl/" + paymentId;
    console.log(requestUrl);
    return this.http_client.get<DownloadUrlConfig>(requestUrl);
  }

}

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, map, Observable, Subscriber, takeUntil, throwError } from 'rxjs';
import { CustomResponse } from 'src/app/services/custome.response';
import { environment } from 'src/environments/environment';
import { Teachers } from '../teachers';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  loading: boolean = false
  filters: any = {};
  id: number;
  teachers: Teachers = new Teachers()
  form: FormGroup;
  private subscriber: Subscriber<any>;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService,
    private _http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.find(this.id)
  }

  get f() {
    return this.form.controls;
  }
  async find(id: number) {
    try {
      let o = new Observable(obs => {
        this.subscriber = obs;
        return obs;
      });
      this.loading = true;
      let headers = new HttpHeaders({
        Accept: "application/json",
      });
      let apiUrl = `${environment.CommonService}teachers/${id}`;
      let server: any = await this._http
        .get(apiUrl, { params: this.filters, headers: headers })
        .pipe(
          takeUntil(o),
          map((res: CustomResponse) => {
            return CustomResponse.fromJSON(res);
          }),
          catchError(this.errorHandler)
        ).toPromise();
      this.subscriber.unsubscribe();
      if (server instanceof HttpErrorResponse) {
        throw new Error(server.error.error);
      }
      if (server.error) {
        throw new Error(server.error);
      }
      if (server instanceof CustomResponse) {
        if (server.getError()) {
          throw new Error(server.response.error);
        }
        if (server.response && server.response.data) {
          this.teachers = Teachers.fromJSON(server.response.data);
          console.log(this.teachers);

        }
      }
    }
    catch (error) {
      this.notification.error(error.code || "Error!!!", error.message);
    } finally {
      this.loading = false;
    }
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }



}

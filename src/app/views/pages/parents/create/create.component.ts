import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, map, Observable, Subscriber, takeUntil, throwError } from 'rxjs';
import { CustomResponse } from 'src/app/services/custome.response';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styles: [
    `
      [nz-form] {
        max-width: 600px;
      }

      .phone-select {
        width: 70px;
      }

      .register-are {
        margin-bottom: 8px;
      }
    `
  ]
})
export class CreateComponent implements OnInit {
  form: FormGroup;
  loading:boolean=false;
  private subscriber: Subscriber<any>;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService,
    private _http: HttpClient,
  ) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZÁáÀàÉéÈèÍíÌìÓóÒòÚúÙùÑñüÜ \-\']+')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      gender: new FormControl('', [Validators.required]),
      id_number: new FormControl('', [Validators.required]),
      religion: new FormControl(''),
      occupation: new FormControl(''),
    });
  }

  ngOnInit(): void {
  }

  get f(){
    return this.form.controls;
  }

  async submit() {
    try {
      let o = new Observable(obs => {
        this.subscriber = obs;
        return obs;
      });
      this.loading = true;
      let headers = new HttpHeaders({
        Accept: "application/json",
      });
      const dd: any = this.form.value
      let apiUrl = `${environment.CommonService}parents`;
      let server: any = await this._http
        .post(apiUrl,dd, { params: {}, headers: headers })
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
        if (server.response && server.response.success) {
          this.notification.success(
            "Success!!!",
            "New student created successfully'"
          );
          this.router.navigateByUrl('/parents');
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

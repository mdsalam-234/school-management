import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, map, Observable, Subscriber, takeUntil, throwError } from 'rxjs';
import { CustomResponse } from 'src/app/services/custome.response';
import { environment } from 'src/environments/environment';
import { Parents } from '../parents';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styles: [
    `
      nz-select {
        width: 100%;
      }
    `
  ]
})
export class EditComponent implements OnInit {
  loading: boolean = false
  filters: any = {};
  id: number;
  parents: Parents;
  form: FormGroup;
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
    this.id = this.route.snapshot.params['id'];
    this.find(this.id)
  }

  patchFormValues() {
    if (this.id) {
      this.form.get("name").patchValue(this.parents.name);
      this.form.get("email").patchValue(this.parents.email);
      this.form.get("phone").patchValue(this.parents.phone);
      this.form.get("gender").patchValue(this.parents.gender);
      this.form.get("id_number").patchValue(this.parents.id_number);
      this.form.get("religion").patchValue(this.parents.religion);
    }
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
      let apiUrl = `${environment.CommonService}parents/${id}`;
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
          this.parents = Parents.fromJSON(server.response.data);
          this.patchFormValues();
        }
      }
    }
    catch (error) {
      this.notification.error(error.code || "Error!!!", error.message);
    } finally {
      this.loading = false;
    }
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
      dd.id = this.id
      let apiUrl = `${environment.CommonService}parents/${this.id}`;
      let server: any = await this._http
        .put(apiUrl,dd, { params: {}, headers: headers })
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
            "Student details updated successfully'"
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

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, map, Observable, Subscriber, takeUntil, throwError } from 'rxjs';
import { CustomResponse } from 'src/app/services/custome.response';
import { environment } from 'src/environments/environment';
import { Teachers } from '../teachers';

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
  teachers: Teachers = new Teachers()

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
      class: new FormControl('', [Validators.required]),
      section: new FormControl('', [Validators.required]),
      subject: new FormControl('', [Validators.required]),
      dob: new FormControl(''),
      father_name: new FormControl(''),
      mother_name: new FormControl(''),
      joining_date: new FormControl(''),
      religion: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.find(this.id)
  }

  patchFormValues() {
    if (this.id) {
      this.form.get("id_number").patchValue(this.teachers.id_number);
      this.form.get("name").patchValue(this.teachers.name);
      this.form.get("email").patchValue(this.teachers.email);
      this.form.get("phone").patchValue(this.teachers.phone);
      this.form.get("gender").patchValue(this.teachers.gender);
      this.form.get("class").patchValue(this.teachers.class);
      this.form.get("section").patchValue(this.teachers.section);
      this.form.get("subject").patchValue(this.teachers.subject);

      this.form.get("dob").patchValue(this.teachers.dob);
      this.form.get("father_name").patchValue(this.teachers.father_name);
      this.form.get("mother_name").patchValue(this.teachers.mother_name);
      this.form.get("joining_date").patchValue(this.teachers.joining_date);
      this.form.get("religion").patchValue(this.teachers.religion);
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
        console.log(server.response.data);

        if (server.response && server.response.data) {
          // this.teachers = server.response.data.fromJSON(server.response.data);
          this.teachers = server.response.data
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
      let apiUrl = `${environment.CommonService}teachers/${this.id}`;
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
          this.router.navigateByUrl('/teachers');
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

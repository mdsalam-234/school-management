import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, map, Observable, Subscriber, takeUntil, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CustomResponse } from 'src/app/services/custome.response';
import { Students } from 'src/app/services/database.objects';


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
  students: Students;
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
      roll_number: new FormControl('', [Validators.required]),
      class: new FormControl('', [Validators.required]),
      section: new FormControl('', [Validators.required]),
      dob: new FormControl(''),
      father_name: new FormControl(''),
      mother_name: new FormControl(''),
      admission_date: new FormControl(''),
      father_occupation: new FormControl(''),
      religion: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.find(this.id)
  }

  patchFormValues() {
    if (this.id) {
      this.form.get("name").patchValue(this.students.name);
      this.form.get("email").patchValue(this.students.email);
      this.form.get("phone").patchValue(this.students.phone);
      this.form.get("gender").patchValue(this.students.gender);
      this.form.get("roll_number").patchValue(this.students.roll_number);
      this.form.get("class").patchValue(this.students.class);
      this.form.get("section").patchValue(this.students.section);

      this.form.get("dob").patchValue(this.students.dob);
      this.form.get("father_name").patchValue(this.students.father_name);
      this.form.get("mother_name").patchValue(this.students.mother_name);
      this.form.get("admission_date").patchValue(this.students.admission_date);
      this.form.get("father_occupation").patchValue(this.students.father_occupation);
      this.form.get("religion").patchValue(this.students.religion);
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
      let apiUrl = `${environment.CommonService}students/${id}`;
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
          this.students = Students.fromJSON(server.response.data);
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
      let apiUrl = `${environment.CommonService}students/${this.id}`;
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
        console.log(server.response);

        if (server.response && server.response.success) {
          this.notification.success(
            "Success!!!",
            "Student details updated successfully'"
          );
          this.router.navigateByUrl('/students');
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

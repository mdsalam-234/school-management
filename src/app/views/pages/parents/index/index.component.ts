import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, map, Observable, Subscriber, takeUntil, throwError } from 'rxjs';
import { CustomResponse } from 'src/app/services/custome.response';
import { Parents } from 'src/app/services/database.objects';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styles: [
    `
      .search-box {
        padding: 8px;
      }
      .datepic {
        margin-bottom: 10px;
      }

      .search-box input {
        width: 188px;
        margin-bottom: 8px;
        display: block;
      }

      .search-box button {
        width: 90px;
      }
      nz-select {
        width: 100%;
      }

      .search-button {
        margin-right: 8px;
      }
      .dot {
        margin-left: 833px;
      }
    `,
  ]
})
export class IndexComponent implements OnInit {
  loading:boolean=false
  parents: Parents[] = [];
  filters: any = {};
  pageIndex = 1;
  pageSize = 10;
  total = 1;
  sortValue: string | null = "desc";
  sortName: string | null = "id";
  searchdate1: any = [];
  searchdate2: any = [];
  private subscriber: Subscriber<any>;
  datas: Parents[] = [];
  constructor(
    private _router: Router,
    private _http: HttpClient,
    private notification: NzNotificationService,
  ) { }

  reload(){
    this.getLists(true);
  }

  ngOnInit(): void {
    this.getLists(true);
  }

  pageSizeChange(e) {
    this.pageSize = e;
    this.getLists(true);
  }

  sort(sort: string, column): void {
    this.sortName = column;
    this.sortValue = sort == "descend" ? "desc" : "asc";
    this.getLists(true);
  }

  // view(data: Places) {
  //   this._router.navigate(["/places/view/", data.id]);
  // }

  reset(): void {
    delete this.filters["filter[id_number-like]"];
    delete this.filters["filter[name-like]"];
    delete this.filters['filter[gender-like]']
    delete this.filters['filter[email-like]']
    delete this.filters['filter[phone-like]']
    delete this.filters["filter[created_at-daterange][0]"];
    delete this.filters["filter[created_at-daterange][1]"];
    this.searchdate1 = [];
    this.searchdate2 = [];
    this.getLists(true);
  }

  search() {
    if (this.searchdate1.length) {
      this.filters["filter[dob-daterange][0]"] =
        moment(this.searchdate1[0]).format("YYYY-MM-DD") + " 00:00:00";
      this.filters["filter[dob-daterange][1]"] =
        moment(this.searchdate1[1]).format("YYYY-MM-DD") + " 23:59:59";
    }
    if (this.searchdate2.length) {
      this.filters["filter[created_at-daterange][0]"] =
        moment(this.searchdate2[0]).format("YYYY-MM-DD") + " 00:00:00";
      this.filters["filter[created_at-daterange][1]"] =
        moment(this.searchdate2[1]).format("YYYY-MM-DD") + " 23:59:59";
    }
    this.getLists(true);
  }

  async getLists(reset: boolean = false) {
    try {
      let o = new Observable(obs => {
        this.subscriber = obs;
        return obs;
      });
      this.loading = true;
      let headers = new HttpHeaders({
        Accept: "application/json",
      });
      this.filters.page = this.pageIndex.toString();
      this.filters.limit = this.pageSize.toString();
      this.filters.sort = this.sortName;
      this.filters.sort_dir = this.sortValue;
      let apiUrl = `${environment.CommonService}parents`;
      let server:any = await this._http
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
            // this.students = Students.fromJSON(server.response.data);
            this.datas = <Parents[]>(
              server.response.data.map((d: any) => Parents.fromJSON(d))
            );
            this.total = server.response.total;
            this.pageIndex = server.response.current_page;
          }
        }
    }
    catch (error) {
      this.notification.error(error.code || "Error!!!", error.message);
    } finally {
      this.loading = false;
    }
  }

  async deletePerson(id:number){
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
      let server:any = await this._http
        .delete(apiUrl, { params: {}, headers: headers })
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
          if (server.response.success) {
            this.notification.success(
              "Success!!!",
              "Record Deleted successfully"
            );
            this.getLists(true);
          }
        }
    }
    catch (error) {
      this.notification.error(error.code || "Error!!!", error.message);
    } finally {
      this.loading = false;
    }
  }
  errorHandler(error:any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

}

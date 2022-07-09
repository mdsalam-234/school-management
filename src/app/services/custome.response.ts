import * as _ from 'lodash';
export class CustomResponse {
  data: any;
  response: any;
  error: any;
  message: string = ''
  code: number | undefined;
  success: boolean = false

  static fromJSON(json: any): CustomResponse {
    let obj = Object.create(CustomResponse.prototype);
    return Object.assign(obj, json, {});
  }

  getError(): string {
    if (!this.success) {
      return this.message;
    }
    return '';
  }

  getResponse(path? : any) {
    return path ? _.get(this.data,path) : this.data;
  }

  isSuccess() : boolean {
    return this.success;
  }
}

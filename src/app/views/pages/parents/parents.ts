export class Parents {
  id: number;
  name: string;
  email: string;
  phone: number;
  gender: string;
  religion:string;
  occupation:string;
  id_number:string;
  address:string;
  created_at:string;
  data:any
  static fromJSON(json: any): Parents {
    let obk = Object.create(Parents.prototype);
    return Object.assign(obk, json, {});
  }
}

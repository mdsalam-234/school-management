export class Teachers {
  id: number;
  name: string;
  email: string;
  dob: string;
  phone: number;
  gender: string;
  father_name:string;
  mother_name:string;
  religion:string;
  joining_date:string;
  class:string;
  section:string;
  id_number:string;
  address:string;
  subject:string;
  created_at:string;
  data:any
  static fromJSON(json: any): Teachers {
    let obk = Object.create(Teachers.prototype);
    return Object.assign(obk, json, {});
  }
}

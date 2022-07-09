export class Students {
  id: number;
  name: string;
  email: string;
  dob: string;
  phone: number;
  gender: string;
  father_name:string;
  mother_name:string;
  religion:string;
  father_occupation:string;
  admission_date:string;
  class:string;
  section:string;
  roll_number:string;
  address:string;
  created_at:string;
  data:any
  static fromJSON(json: any): Students {
    let obk = Object.create(Students.prototype);
    return Object.assign(obk, json, {});
  }
}


export class Subject {
  id: number;
  subject_name: string;
  subject_type: string;
  class: string;
  created_at: string;
  updated_at: string;

  getId(): number {
    return this.id || 0;
  }

  static fromJSON(json: any): Subject {
    let obk = Object.create(Subject.prototype);
    return Object.assign(obk, json, {});
  }
}

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

export class Category {
  id: number;
  title: string;
  description: string;
  code: string;
  parent_id: number;
  icon: string;
  icon_type: string;
  marker_icon: string;

  getId(): number {
    return this.id || 0;
  }

  static fromJSON(json: any): Category {
    let obk = Object.create(Category.prototype);
    return Object.assign(obk, json, {});
  }
}


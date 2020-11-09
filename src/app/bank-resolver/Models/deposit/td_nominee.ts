import { baseModel } from '../baseModel';

export class td_nominee extends baseModel{
  public brn_cd: string;
  public acc_type_cd: number;
  public acc_num: string;
  public nom_id: number;
  public nom_name: string;
  public nom_addr1: string;
  public nom_addr2: string;
  public phone_no: string;
  public percentage: number;  // decimal
  public relation: string;

  td_nominee()
  {
    this.percentage = 0;
  }
}

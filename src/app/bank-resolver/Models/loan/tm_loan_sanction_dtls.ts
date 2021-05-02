import { baseModel } from '../baseModel';

export class tm_loan_sanction_dtls extends baseModel {
  public loan_id: string;
  public sanc_no: number;
  public sector_cd: string;
  public activity_cd: string;
  public crop_cd: string;
  public sanc_amt: number;
  public due_dt: Date;
  public sanc_status: string;
  public srl_no: number;
  public approval_status: string;
}

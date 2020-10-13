import { baseModel } from './baseModel';

export class tm_deposit extends baseModel{
  public brn_cd: string;
  public acc_type_cd: number;
  public acc_num: string;
  public renew_id: number;
  public cust_cd: number;
  public intt_trf_type: string;
  public constitution_cd: number;
  public oprn_instr_cd: number;
  public opening_dt: Date;
  public prn_amt: number;
  public intt_amt: number;
  public dep_period: string;
  public instl_amt: number;
  public instl_no: number;
  public mat_dt: Date;
  public intt_rt: number;
  public tds_applicable: string;
  public last_intt_calc_dt: Date;
  public acc_close_dt: Date;
  public closing_prn_amt: number;
  public closing_intt_amt: number;
  public penal_amt: number;
  public ext_instl_tot: number;
  public mat_status: string;
  public acc_status: string;
  public curr_bal: number;
  public clr_bal: number;
  public standing_instr_flag: string;
  public cheque_facility_flag: string;
  public approval_status: string;
  public approved_by: string;
  public approved_dt: Date;
  public user_acc_num: string;
  public lock_mode: string;
  public loan_id: string;
  public cert_no: string;
  public bonus_amt: number;
  public penal_intt_rt: number;
  public bonus_intt_rt: number;
  public transfer_flag: string;
  public transfer_dt: Date;
  public agent_cd: string;
  public cust_name: string;  // this is added extra for UX operation only
  public cust_type: string;
  public gurdain_name: string;
  public date_of_birth: Date;
  public sex: string;
  public phone: string;
  public category: string;
  public occupation: string;
  public email: string;
  public present_addr: string;
  public acc_type_desc: string; // this is added extra for UX operation only
  public constitution_desc : string;
  public oprn_instr_desc : string;

}

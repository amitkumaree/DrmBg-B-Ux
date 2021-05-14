import { baseModel } from '../baseModel';
<<<<<<< HEAD

export class p_loan_param {  
  public  brn_cd: string;
  public intt_dt: Date;
  public  loan_id: string;
  public  acc_type_cd: number;
  public  recov_amt : number; 
 public  curr_intt_rate : number;  
 public  curr_prn_recov : number; 
 public   ovd_prn_recov : number; 
public  	curr_intt_recov : number; 
 public    ovd_intt_recov : number; 
 public  gs_user_type:string;
 public  gs_user_id :string;
 public  output :string
 public  commit_roll_flag : number; 
 public  crop_cd : string;
 public  cust_cd : number;
 public due_dt : Date;
 public  status : number;
=======
export class p_loan_param extends baseModel {
  public brn_cd: string;
  public intt_dt: Date;
  public loan_id: string;
  public acc_type_cd: number;
  public recov_amt: number;
  public curr_intt_rate: number;
  public curr_prn_recov: number;
  public ovd_prn_recov: number;
  public curr_intt_recov: number;
  public ovd_intt_recov: number;
  public gs_user_type: string;
  public gs_user_id: string;
  public output: string
  public commit_roll_flag: number;
  public crop_cd: string;
  public cust_cd: number;
  public due_dt: Date;
  public status: number;
>>>>>>> 03df011d2a5a06ce31a166c3042d2052e70065d1
}

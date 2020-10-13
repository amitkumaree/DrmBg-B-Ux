import { mm_acc_type, td_def_trans_trf } from '.';
import { baseModel } from './baseModel';

export class TranApprovalVM {
  public td_def_trans_trf: td_def_trans_trf;
  public mm_acc_type: mm_acc_type;

  TranApprovalVM(){
    this.mm_acc_type = new mm_acc_type();
    this.td_def_trans_trf = new td_def_trans_trf();
  }
}

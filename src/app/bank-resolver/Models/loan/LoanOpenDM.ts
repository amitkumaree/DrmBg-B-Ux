import { td_def_trans_trf } from '..';
import { td_accholder } from '../deposit/td_accholder';
import { tm_denomination_trans } from '../deposit/tm_denomination_trans';
import { tm_transfer } from '../deposit/tm_transfer';
import { tm_guaranter } from './tm_guaranter';
import { tm_loan_all } from './tm_loan_all';
import { tm_loan_sanction } from './tm_loan_sanction';
import { tm_loan_sanction_dtls } from './tm_loan_sanction_dtls';

export class LoanOpenDM {
  public tmloanall: tm_loan_all;
  public tmguaranter: tm_guaranter;
  public tdaccholder: td_accholder[] = [];
  public tmlaonsanction: tm_loan_sanction[] = [];
  public tmlaonsanctiondtls: tm_loan_sanction_dtls[] = [];

  public tmdenominationtrans: tm_denomination_trans[] = [];
  public tmtransfer: tm_transfer[] = [];
  public tddeftranstrf: td_def_trans_trf[] = [];
  public tddeftrans: td_def_trans_trf;

}

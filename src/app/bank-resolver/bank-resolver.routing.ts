import { GenLedgerComponent } from './finance/report/gen-ledger/gen-ledger.component';

import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { BankResolverComponent } from './bank-resolver.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceComponent } from './finance/finance.component';
import { VoucherComponent } from './finance/voucher/voucher.component';
import { UTCustomerProfileComponent } from './UCIC/utcustomer-profile/utcustomer-profile.component';
import { UTSelfHelpComponent } from './UCIC/utself-help/utself-help.component';
import { AdminPanelComponent } from '../admin-panel/admin-panel.component';
import { BankConfigComponent } from '../bank-config/bank-config.component';
import { MasterConfigComponent } from '../master-config/master-config.component';
import { DailybookComponent } from './finance/report/dailybook/dailybook.component';
import { BankWiseConfigComponent } from '../bank-wise-config/bank-wise-config.component';
import { NewBankConfigComponent } from '../new-bank-config/new-bank-config.component';
import { CashaccountComponent } from './finance/report/cashaccount/cashaccount.component';
import { CashcumtrialComponent } from './finance/report/cashcumtrial/cashcumtrial.component';
import { TrialbalanceComponent } from './finance/report/trialbalance/trialbalance.component';
import { VoucherprintComponent } from './finance/voucherprint/voucherprint.component';
import { GenLedger2Component } from './finance/report/gen-ledger2/gen-ledger2.component';
import { TransactionapprovalComponent } from './deposit/transactionapproval/transactionapproval.component';
import { AccOpeningComponent } from './deposit/acc-opening/acc-opening.component';
import { TestComponent } from '../test/test/test.component';
import { ScrollbookComponent } from './finance/report/scrollbook/scrollbook.component';
import { VoucherapprovalComponent } from './finance/voucherapproval/voucherapproval.component';

const routes: Routes = [
  { path: 'Admin', component: AdminPanelComponent },
  { path: 'admin', component: AdminPanelComponent },
  // { path: 'te-st', component: AccounTransactionsComponent },
  { path: 'BankConfig', component: BankConfigComponent },
  { path: 'MasterConfig', component: MasterConfigComponent },
  {path: 'BankWiseConfig', component: BankWiseConfigComponent},
  {path: 'NewBankConfig', component: NewBankConfigComponent},
  {path: 'test', component: TestComponent},
  {
    path: ':bankName', component: BankResolverComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'la', component: LandingComponent },
      { path: 'UT_CustomerProfile', component: UTCustomerProfileComponent },
      { path: 'UT_SelfHelp', component: UTSelfHelpComponent },
      { path: 'FT_Voucher', component: VoucherComponent },
      { path: 'FT_ApproveTrns', component: VoucherapprovalComponent },
      { path: 'FT_PrintVoucher', component: VoucherprintComponent },
      { path: 'FR_DayBook', component: DailybookComponent },
      { path: 'FR_CashAccount', component: CashaccountComponent },
      { path: 'FR_CashCumTrial', component: CashcumtrialComponent },
      { path: 'FR_TrialBalance', component: TrialbalanceComponent },
      { path: 'FR_GeneralLadger', component: GenLedgerComponent },
      { path: 'FR_DayScrollBook', component: ScrollbookComponent },
      { path: 'FR_GLTD', component: GenLedger2Component },
      { path: 'DT_ApproveTran', component: TransactionapprovalComponent },
      { path: 'DT_OpenAcc', component: AccOpeningComponent },
      
      // { path: '**', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'finance', component: FinanceComponent,
        children: [
          { path: 'voucher', component: VoucherComponent },
          // { path: 'voucherNew', component: VoucherNewComponent },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BankResolverRouting { }

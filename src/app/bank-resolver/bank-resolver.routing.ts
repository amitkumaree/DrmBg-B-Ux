
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { BankResolverComponent } from './bank-resolver.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceComponent } from './finance/finance.component';
import { VoucherComponent } from './finance/voucher/voucher.component';
import { VoucherNewComponent } from './finance/voucher-new/voucher-new.component';
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

const routes: Routes = [
  { path: 'Admin', component: AdminPanelComponent },
  { path: 'admin', component: AdminPanelComponent },
  { path: 'BankConfig', component: BankConfigComponent },
  { path: 'MasterConfig', component: MasterConfigComponent },
  {path: 'BankWiseConfig', component: BankWiseConfigComponent},
  {path: 'NewBankConfig', component: NewBankConfigComponent},
  {
    path: ':bankName', component: BankResolverComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'la', component: LandingComponent },
      { path: 'UT_CustomerProfile', component: UTCustomerProfileComponent },
      { path: 'UT_SelfHelp', component: UTSelfHelpComponent },
      { path: 'FT_Voucher', component: VoucherComponent },
      { path: 'FR_DayBook', component: DailybookComponent },
      { path: 'FR_CashAccount', component: CashaccountComponent },
      { path: 'FR_CashCumTrial', component: CashcumtrialComponent },
      { path: 'FR_TrialBalance', component: TrialbalanceComponent },
      
      // { path: '**', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'finance', component: FinanceComponent,
        children: [
          { path: 'voucher', component: VoucherComponent },
          { path: 'voucherNew', component: VoucherNewComponent }
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

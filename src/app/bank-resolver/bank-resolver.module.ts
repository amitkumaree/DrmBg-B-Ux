import { LoginComponent } from './login/login.component';
import { BankResolverComponent } from './bank-resolver.component';
import { NgModule, ErrorHandler } from '@angular/core';
import { BankResolverRouting } from './bank-resolver.routing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GlobalErrorHandler, ServerErrorInterceptor } from '../_utility';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { LandingComponent } from './landing/landing.component';
import { UTCustomerProfileComponent } from './UCIC/utcustomer-profile/utcustomer-profile.component';
import { UTSelfHelpComponent } from './UCIC/utself-help/utself-help.component';
import { DailybookComponent } from './finance/report/dailybook/dailybook.component';
import { CashaccountComponent } from './finance/report/cashaccount/cashaccount.component';
import { WebDataRocksPivot } from '../webdatarocks/webdatarocks.angular4';
import { TrialbalanceComponent } from './finance/report/trialbalance/trialbalance.component';
import { CashcumtrialComponent } from './finance/report/cashcumtrial/cashcumtrial.component';
import { GenLedgerComponent } from './finance/report/gen-ledger/gen-ledger.component';

import { VoucherprintComponent } from './finance/voucherprint/voucherprint.component';
import { LoadingComponent } from './loading';
import { GenLedger2Component } from './finance/report/gen-ledger2/gen-ledger2.component';
import { TransactionapprovalComponent } from './deposit/transactionapproval/transactionapproval.component';

@NgModule({
  declarations: [
    BankResolverComponent, LoginComponent, HeaderComponent, LandingComponent, LoadingComponent,
    UTCustomerProfileComponent, UTSelfHelpComponent, DailybookComponent, CashaccountComponent,
    WebDataRocksPivot, TrialbalanceComponent, CashcumtrialComponent, GenLedgerComponent,
    VoucherprintComponent,
    GenLedger2Component,
    TransactionapprovalComponent
  ],
  imports: [
    CommonModule, BankResolverRouting, ReactiveFormsModule, FormsModule
  ],
  providers: [
    // { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true  }
  ],
})

export class BankResolverModule { }

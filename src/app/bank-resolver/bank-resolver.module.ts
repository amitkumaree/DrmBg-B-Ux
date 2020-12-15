import { LoginComponent } from './login/login.component';
import { BankResolverComponent } from './bank-resolver.component';
import { NgModule } from '@angular/core';
import { BankResolverRouting } from './bank-resolver.routing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { AccOpeningComponent } from './deposit/acc-opening/acc-opening.component';
import { CustomerInfoComponent } from './common/customer-info/customer-info.component';
import { TestComponent } from './test/test.component';
import { VoucherComponent } from './finance/voucher/voucher.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AccountDetailsComponent } from './Common/account-details/account-details.component';
import { TransactionDetailsComponent } from './Common/transaction-details/transaction-details.component';
import { ScrollbookComponent } from './finance/report/scrollbook/scrollbook.component';
import { DwRdInstlViewComponent } from './Common/dw-rd-instl-view/dw-rd-instl-view.component';
import { DwTdInttDtlsViewComponent } from './Common/dw-td-intt-dtls-view/dw-td-intt-dtls-view.component';
import { DwRenewalViewComponent } from './Common/dw-renewal-view/dw-renewal-view.component';
<<<<<<< HEAD
import { AccounTransactionsComponent } from './deposit/accoun-transactions/accoun-transactions.component';
import { AccountDetailsForAcctTransComponent } from './Common/account-details-for-acct-trans/account-details-for-acct-trans.component';
=======
import { VoucherapprovalComponent } from './finance/voucherapproval/voucherapproval.component';
import { DayinitializationComponent } from './system/dayinitialization/dayinitialization.component';
import { DaycomplitionComponent } from './system/daycomplition/daycomplition.component';
import { AdduserComponent } from './system/adduser/adduser.component';
>>>>>>> 6bda49036145a48726270f620ab1d8cc91f51790


@NgModule({
  declarations: [
    BankResolverComponent, LoginComponent, HeaderComponent, LandingComponent, LoadingComponent,
    UTCustomerProfileComponent, UTSelfHelpComponent, DailybookComponent, CashaccountComponent,
    WebDataRocksPivot, TrialbalanceComponent, CashcumtrialComponent, GenLedgerComponent,
    VoucherprintComponent, AccountDetailsComponent, TransactionDetailsComponent,
    GenLedger2Component,
    TransactionapprovalComponent,
    AccOpeningComponent,
    CustomerInfoComponent, VoucherComponent,
    TestComponent,
    ScrollbookComponent,
    DwRdInstlViewComponent,
    DwTdInttDtlsViewComponent,
    DwRenewalViewComponent,
<<<<<<< HEAD
    AccounTransactionsComponent,
    AccountDetailsForAcctTransComponent
=======
    VoucherapprovalComponent,
    DayinitializationComponent,
    DaycomplitionComponent,
    AdduserComponent
>>>>>>> 6bda49036145a48726270f620ab1d8cc91f51790
  ],
  imports: [
    CommonModule, BankResolverRouting, ReactiveFormsModule, FormsModule, AutocompleteLibModule  ],
  providers: [
    // { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true  }
  ],
})

export class BankResolverModule { }

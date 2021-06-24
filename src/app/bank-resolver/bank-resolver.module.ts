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
import { AccounTransactionsComponent } from './deposit/accoun-transactions/accoun-transactions.component';
import { AccountDetailsForAcctTransComponent } from './Common/account-details-for-acct-trans/account-details-for-acct-trans.component';
import { VoucherapprovalComponent } from './finance/voucherapproval/voucherapproval.component';
import { DayinitializationComponent } from './system/dayinitialization/dayinitialization.component';
import { DaycomplitionComponent } from './system/daycomplition/daycomplition.component';
import { AdduserComponent } from './system/adduser/adduser.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { KycComponent } from './Common/kyc/kyc.component';
import { MemberListComponent } from './UCIC/Report/member-list/member-list.component';
import { OpenLoanAccountComponent } from './loan/transaction/open-loan-account/open-loan-account.component';
import { LoanaccountTransactionComponent } from './loan/transaction/loanaccount-transaction/loanaccount-transaction.component';
import { LoanTransactionApprovalComponent } from './loan/transaction/loan-transaction-approval/loan-transaction-approval.component';
import { LoanTransactionDetailsComponent } from './Common/loan-transaction-details/loan-transaction-details.component';
import { LoanAccwiseinttcalcComponent } from './loan/transaction/loan-accwiseinttcalc/loan-accwiseinttcalc.component';
import { INRCurrencyPipe } from '../_utility/filter';


@NgModule({
  declarations: [
    BankResolverComponent, LoginComponent, HeaderComponent, LandingComponent, LoadingComponent,
    UTCustomerProfileComponent, UTSelfHelpComponent, DailybookComponent, CashaccountComponent,
    WebDataRocksPivot, TrialbalanceComponent, CashcumtrialComponent, GenLedgerComponent,
    VoucherprintComponent, AccountDetailsComponent, TransactionDetailsComponent,
    GenLedger2Component, TransactionapprovalComponent, AccOpeningComponent,
    CustomerInfoComponent, VoucherComponent, TestComponent,
    ScrollbookComponent,
    DwRdInstlViewComponent,
    DwTdInttDtlsViewComponent,
    DwRenewalViewComponent,
    AccounTransactionsComponent,
    AccountDetailsForAcctTransComponent,
    VoucherapprovalComponent,
    DayinitializationComponent,
    DaycomplitionComponent,
    AdduserComponent,
    KycComponent,
    MemberListComponent,
    OpenLoanAccountComponent,
    LoanaccountTransactionComponent,
    LoanTransactionApprovalComponent, INRCurrencyPipe,
    LoanTransactionDetailsComponent,
    LoanAccwiseinttcalcComponent
  ],
  imports: [
    CommonModule,
    BankResolverRouting,
    ReactiveFormsModule, FormsModule, AutocompleteLibModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [
    // { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true  }
  ],
})

export class BankResolverModule { }

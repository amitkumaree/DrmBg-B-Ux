import { LoginComponent } from './login/login.component';
import { BankResolverComponent } from './bank-resolver.component';
import { NgModule, ErrorHandler } from '@angular/core';
import { BankResolverRouting } from './bank-resolver.routing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GlobalErrorHandler, ServerErrorInterceptor } from '../_utility';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { VoucherNewComponent } from './finance/voucher-new/voucher-new.component';
import { HeaderComponent } from './header/header.component';
import { LandingComponent } from './landing/landing.component';
import { UTCustomerProfileComponent } from './UCIC/utcustomer-profile/utcustomer-profile.component';
import { UTSelfHelpComponent } from './UCIC/utself-help/utself-help.component';
import { DailybookComponent } from './finance/report/dailybook/dailybook.component';

@NgModule({
  declarations: [
    BankResolverComponent, LoginComponent, VoucherNewComponent, HeaderComponent, LandingComponent,
    UTCustomerProfileComponent, UTSelfHelpComponent, DailybookComponent
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

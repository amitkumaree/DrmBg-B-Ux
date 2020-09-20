import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { FinanceComponent } from './bank-resolver/finance/finance.component';
import { VoucherComponent } from './bank-resolver/finance/voucher/voucher.component';
import { BankConfigComponent } from './bank-config/bank-config.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { MasterConfigComponent } from './master-config/master-config.component';
import { BankWiseConfigComponent } from './bank-wise-config/bank-wise-config.component';
import { NewBankConfigComponent } from './new-bank-config/new-bank-config.component';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    FinanceComponent,
    VoucherComponent,
    BankConfigComponent,
    AdminPanelComponent,
    MasterConfigComponent,
    BankWiseConfigComponent,
    NewBankConfigComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule,
    NgbModule, NgxJsonViewerModule, FormsModule, AutocompleteLibModule, ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

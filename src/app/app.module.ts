import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { FinanceComponent } from './bank-resolver/finance/finance.component';
import { BankConfigComponent } from './bank-config/bank-config.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MasterConfigComponent } from './master-config/master-config.component';
import { BankWiseConfigComponent } from './bank-wise-config/bank-wise-config.component';
import { NewBankConfigComponent } from './new-bank-config/new-bank-config.component';
import { TestComponent } from './test/test/test.component';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    FinanceComponent,
    BankConfigComponent,
    AdminPanelComponent,
    MasterConfigComponent,
    BankWiseConfigComponent,
    NewBankConfigComponent,
    TestComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule,
    NgbModule, NgxJsonViewerModule, FormsModule, ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

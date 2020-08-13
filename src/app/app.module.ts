import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { TableTopComponent } from './table-top/table-top.component';
import { CommandLineComponent } from './command-line/command-line.component';
import { CommandLineInputHandlerComponent } from './command-line-input-handler/command-line-input-handler.component';
import { CommandHistoryComponent } from './command-history/command-history.component';

import { tableTopReducer, commandHistoryReducer } from './store.reducers';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TableTopComponent,
    CommandLineComponent,
    CommandLineInputHandlerComponent,
    CommandHistoryComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot({ commandHistory: commandHistoryReducer, tableTop: tableTopReducer }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    WjGridModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

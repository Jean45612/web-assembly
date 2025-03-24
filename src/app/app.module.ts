import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FibonacciComparisonComponent } from './components/fibonacci-comparison/fibonacci-comparison.component';
import { FormsModule } from '@angular/forms';
import { WasmService } from './services/wasm.service';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    FibonacciComparisonComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [WasmService],
  bootstrap: [AppComponent]
})
export class AppModule { }

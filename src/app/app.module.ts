import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FibonacciComparisonComponent } from './components/fibonacci-comparison/fibonacci-comparison.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FibonacciService } from './services/fibonacci.service';
import { ImageComparisonComponent } from './components/image-comparison/image-comparison.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  declarations: [
    AppComponent,
    FibonacciComparisonComponent,
    ImageComparisonComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    MatTabsModule
  ],
  providers: [FibonacciService, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }

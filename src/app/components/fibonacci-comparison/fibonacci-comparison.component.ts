// src/app/components/fibonacci-comparison/fibonacci-comparison.component.ts

import { Component } from '@angular/core';
import { WasmService } from '../../services/wasm.service';

@Component({
  selector: 'app-fibonacci-comparison',
  templateUrl: './fibonacci-comparison.component.html',
  styleUrls: ['./fibonacci-comparison.component.scss'],
})
export class FibonacciComparisonComponent {
  inputValue = 30;
  results: { method: string; result: number; time: number }[] = [];
  calculating = false;
  wasmLoaded = false;
  maxTime = 30;

  constructor(private wasmService: WasmService) {
    this.checkWasmLoaded();
  }

  async checkWasmLoaded() {
    await this.wasmService.waitForWasmLoaded();
    this.wasmLoaded = true;
  }

  async runComparison() {
    if (this.calculating) return;

    this.calculating = true;
    this.results = [];
    setTimeout(() => {
      this.executeCalculations();
    }, 50);
  }

  private async executeCalculations() {
    const n = this.inputValue;
    
    // Ejecutamos todas las versiones y medimos el tiempo
    await this.measurePerformance('JavaScript (Recursivo)', () => this.wasmService.fibonacciRecursiveJS(n));
    await this.measurePerformance('JavaScript (Iterativo)', () => this.wasmService.fibonacciIterativeJS(n));
    await this.measurePerformance('WebAssembly (Recursivo)', async () => await this.wasmService.fibonacciRecursiveWasm(n));
    await this.measurePerformance('WebAssembly (Iterativo)', async () => await this.wasmService.fibonacciIterativeWasm(n));
    
    this.calculating = false;
  }

  async measurePerformance(method: string, func: () => any) {
    const start = performance.now();
    const result = await func();
    const end = performance.now();

    this.results.push({
      method,
      result,
      time: parseFloat((end - start).toFixed(2)),
    });
  }
}

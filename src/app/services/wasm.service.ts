// src/app/services/wasm.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WasmService {
  private wasmModule: any;
  private isLoaded = false;

  constructor() {
    this.loadWasm();
  }

  private async loadWasm() {
    try {
      // Importamos el módulo WebAssembly compilado
      const importObject = {
        env: {
          memory: new WebAssembly.Memory({ initial: 256, maximum: 256 })
        }
      };

      const response = await fetch('assets/fibonacci.wasm');
      const bytes = await response.arrayBuffer();
      const wasmModule = await WebAssembly.instantiate(bytes, importObject);
      
      this.wasmModule = wasmModule.instance.exports;
      this.isLoaded = true;
      console.log('WebAssembly módulo cargado correctamente');
    } catch (error) {
      console.error('Error al cargar el módulo WebAssembly:', error);
    }
  }

  // Método para esperar a que WASM esté cargado
  async waitForWasmLoaded(): Promise<void> {
    if (this.isLoaded) return Promise.resolve();
    
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.isLoaded) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  // Método para calcular Fibonacci usando WebAssembly (versión recursiva)
  async fibonacciRecursiveWasm(n: number): Promise<number> {
    await this.waitForWasmLoaded();
    try {
      const result = (this.wasmModule.fibonacci_recursive as Function)(n);
      return typeof result === 'number' ? result : 0;
    } catch (error) {
      console.error('Error en fibonacciRecursiveWasm:', error);
      return 0;
    }
  }

  // Método para calcular Fibonacci usando WebAssembly (versión iterativa)
  async fibonacciIterativeWasm(n: number): Promise<number> {
    await this.waitForWasmLoaded();
    try {
      const result = (this.wasmModule.fibonacci_iterative as Function)(n);
      return typeof result === 'number' ? result : 0;
    } catch (error) {
      console.error('Error en fibonacciIterativeWasm:', error);
      return 0;
    }
  }

  // Implementación en JavaScript para comparación (recursiva)
  fibonacciRecursiveJS(n: number): number {
    if (n <= 1) return n;
    return this.fibonacciRecursiveJS(n - 1) + this.fibonacciRecursiveJS(n - 2);
  }

  // Implementación en JavaScript para comparación (iterativa)
  fibonacciIterativeJS(n: number): number {
    if (n <= 1) return n;
    
    let a = 0, b = 1, c;
    for (let i = 2; i <= n; i++) {
      c = a + b;
      a = b;
      b = c;
    }
    return b;
  }
}
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
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
          memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
        },
      };

      const response = await fetch('assets/image.wasm');
      const bytes = await response.arrayBuffer();
      const wasmModule = await WebAssembly.instantiate(bytes, importObject);

      this.wasmModule = wasmModule.instance.exports;
      this.isLoaded = true;
      console.log('WebAssembly Image módulo cargado correctamente');
    } catch (error) {
      console.error('Error al cargar el módulo WebAssembly Image:', error);
    }
  }

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

  grayscaleJs(imageData: Uint8ClampedArray): Uint8ClampedArray {
    const data = imageData;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }
    return data;
  }

  async grayScaleWasm(
    imageData: Uint8ClampedArray,
    width: number,
    height: number
  ): Promise<any> {
    await this.waitForWasmLoaded();
    try {
      const dataPtr = this.wasmModule._malloc(imageData.length); // Allocate memory
      this.wasmModule.HEAPU8.set(imageData, dataPtr); // Copy data to Wasm memory
      (this.wasmModule.grayscale as Function)(dataPtr, width, height); // Call grayscale
  
      const processedData = new Uint8ClampedArray(imageData.length);
      processedData.set(this.wasmModule.HEAPU8.subarray(dataPtr, dataPtr + imageData.length)); // Copy data from wasm memory.
  
      this.wasmModule._free(dataPtr); // Free memory
  
      return processedData;
    } catch (error) {
      console.error('Error en grayScaleWasm:', error);
      return new Uint8ClampedArray(imageData); // Return original if error
    }
  }
}

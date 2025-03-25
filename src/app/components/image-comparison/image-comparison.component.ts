import { Component } from '@angular/core';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-image-comparison',
  templateUrl: './image-comparison.component.html',
  styleUrl: './image-comparison.component.scss',
})
export class ImageComparisonComponent {
  imageSrc: string = ''; // Coloca una imagen en assets
  imageTsData: string | null = null;
  imageWasmData: string | null = null;
  imageTsTime: number | null = null;
  imageWasmTime: number | null = null;
  wasmLoaded = false;

  constructor(private imageService: ImageService) {
    this.checkWasmLoaded();
  }

  async checkWasmLoaded() {
    await this.imageService.waitForWasmLoaded();
    this.wasmLoaded = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSrc = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async processImage() {
    if (!this.imageSrc) {
      return;
    }

    const image = new Image();
    image.src = this.imageSrc;
    image.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      ctx!.drawImage(image, 0, 0);
      const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);

      // TypeScript
      const startTs = performance.now();
      const grayscaleTs = this.imageService.grayscaleJs(imageData.data);
      this.imageTsTime = performance.now() - startTs;
      const canvasTs = document.createElement('canvas');
      canvasTs.width = image.width;
      canvasTs.height = image.height;
      const ctxTs = canvasTs.getContext('2d');
      const imageDataTs = new ImageData(
        grayscaleTs,
        canvasTs.width,
        canvasTs.height
      );
      ctxTs!.putImageData(imageDataTs, 0, 0);
      this.imageTsData = canvasTs.toDataURL();

      // WebAssembly
      const startWasm = performance.now();
      const grayscaleWasm = await this.imageService.grayScaleWasm(
        imageData.data,
        canvas.width,
        canvas.height
      );
      this.imageWasmTime = performance.now() - startWasm;
      const canvasWasm = document.createElement('canvas');
      canvasWasm.width = image.width;
      canvasWasm.height = image.height;
      const ctxWasm = canvasWasm.getContext('2d');
      const imageDataWasm = new ImageData(
        new Uint8ClampedArray(grayscaleWasm),
        canvasWasm.width,
        canvasWasm.height
      );
      ctxWasm!.putImageData(imageDataWasm, 0, 0);
      this.imageWasmData = canvasWasm.toDataURL();
    };
  }
}

#include <stdio.h>
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
void grayscale(unsigned char *data, int width, int height) {
  for (int i = 0; i < width * height * 4; i += 4) {
    int avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;     // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }
}
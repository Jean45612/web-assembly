// src/app/wasm/fibonacci.c
// Este es el código C que se compilará a WebAssembly

#include <emscripten.h>

// Función para calcular Fibonacci de forma recursiva (ineficiente a propósito para demostración)
EMSCRIPTEN_KEEPALIVE
int fibonacci_recursive(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2);
}

// Función para calcular Fibonacci de forma iterativa (eficiente)
EMSCRIPTEN_KEEPALIVE
int fibonacci_iterative(int n) {
    if (n <= 1) {
        return n;
    }
    
    int a = 0, b = 1, c;
    for (int i = 2; i <= n; i++) {
        c = a + b;
        a = b;
        b = c;
    }
    return b;
}
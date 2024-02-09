#include <stdio.h>
#include <emscripten/emscripten.h>

#ifdef __cplusplus
#else
#define EXTERN
#endif

EXTERN EMSCRIPTEN_KEEPALIVE void exploreSurface(char* test) {
    printf("%s\n", test);
}
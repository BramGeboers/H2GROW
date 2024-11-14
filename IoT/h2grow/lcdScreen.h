#include <Arduino.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ST7789.h>
#include <SPI.h>
#include "Images.h"

#define TFT_MOSI 23
#define TFT_SCLK 18
#define TFT_CS   15
#define TFT_DC    2
#define TFT_RST   4

Adafruit_ST7789 tft = Adafruit_ST7789(TFT_CS, TFT_DC, TFT_RST);

void displayImage(const uint16_t *image, int16_t x, int16_t y, int16_t w, int16_t h, int16_t screen_w, int16_t screen_h) {
  tft.startWrite(); // Start write transaction
  int16_t scale_x = screen_w / w;
  int16_t scale_y = screen_h / h;

  for (int16_t j = 0; j < h; j++) {
    for (int16_t i = 0; i < w; i++) {
      uint16_t color = pgm_read_word(&image[j * w + i]); // Write the pixel
      for (int16_t dy = 0; dy < scale_y; dy++){
        for (int16_t dx = 0; dx < scale_x; dx++){
          tft.writePixel(x + i * scale_x + dx, y + j * scale_y + dy, color);
        }
      }
    }
  }
  tft.endWrite(); // End write transaction
}
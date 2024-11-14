/*
 * This ESP32 code is created by esp32io.com
 *
 * This ESP32 code is released in the public domain
 *
 * For more detail (instruction and wiring diagram), visit https://esp32io.com/tutorials/esp32-ultrasonic-sensor
 */

#define TRIG_PIN 13 // ESP32 pin GPIO23 connected to Ultrasonic Sensor's TRIG pin
#define ECHO_PIN 22 // ESP32 pin GPIO22 connected to Ultrasonic Sensor's ECHO pin

float duration_us, distance_cm;

int distance_full = 3.30;
int distance_empty = 11.22;

float distanceDiff;
float range;
float percentage;

float calculateWaterLevel(float distance_cm){
  distanceDiff = distance_cm - distance_full;
  range = distance_empty - distance_full;
  percentage = 100 * (1 - (distanceDiff/range));

  if (percentage < 0.0) {
    percentage = 0.0;
  } else if (percentage > 100.0) {
    percentage = 100.0;
  }
  return percentage;
}

float readDistanceSensor(){
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // measure duration of pulse from ECHO pin
  duration_us = pulseIn(ECHO_PIN, HIGH);

  // calculate the distance
  distance_cm = 0.017 * duration_us;

  // print the value to Serial Monitor
  return calculateWaterLevel(distance_cm);
}



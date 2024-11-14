const int ldrPin = 33; // Pin waar de LDR is aangesloten
const int standardResistance = 30; // Standaard weerstandswaarde in ohm
const int standardLux = 100; // Bijbehorende standaard lichtinvalwaarde in lux

int luxConversion(){

  int ldrValue = analogRead(ldrPin);
    // Bereken de weerstand van de LDR
  float ldrResistance = standardResistance / ((1023.0 / ldrValue) - 1);
  
  // Bereken de luxwaarde
  float lux = standardLux * (standardResistance / ldrResistance);
  return lux;
}
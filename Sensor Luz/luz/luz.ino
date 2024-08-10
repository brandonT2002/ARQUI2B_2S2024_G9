#define lightPin A4 // Pin analógico para el sensor de luz
#define globalDelay 2000 // Delay global

float lightLevel = 0;

void setup(){
  Serial.begin(9600);
}

void loop(){
  light_sensor(); // Funcion para calcular el nivel de luz
}

void light_sensor(){ 
  int lightValue = analogRead(lightPin);
  Serial.println(1024-lightValue);
  delay(globalDelay); 
}
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);  // Dirección I2C de la pantalla

const int button1Pin = 7;  // Pin del botón 1
const int button2Pin = 8;  // Pin del botón 2
const int button3Pin = 9;  // Pin del botón 3

int currentScreen = 0;  // Para rastrear el menú actual

void setup() {
  lcd.init();          // Inicializa la pantalla LCD
  lcd.backlight();     // Enciende la retroiluminación

  pinMode(button1Pin, INPUT);
  pinMode(button2Pin, INPUT);
  pinMode(button3Pin, INPUT);

  showWelcomeMenu();   // Muestra el menú de bienvenida al iniciar
}

void loop() {
  // Leer estado de los botones
  if (digitalRead(button1Pin) == HIGH) {
    advanceMenu();     // Avanza entre los menús
    delay(300);        // Debounce
  } 
  else if (digitalRead(button2Pin) == HIGH) {
    showRealTimeData();  // Muestra la información en tiempo real
    delay(300);          // Debounce
  } 
  else if (digitalRead(button3Pin) == HIGH) {
    showStoredData();  // Muestra la información guardada
    delay(300);        // Debounce
  }
}

void showWelcomeMenu() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Bienvenido!");
  lcd.setCursor(0, 1);
  lcd.print("Presione Boton 1");
}

void temperatureHumidity() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Temp y Humedad:");
  lcd.setCursor(0, 1);
  lcd.print("12.3C, 12%"); // Muestra datos ficticios
}

void ambientLight() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Luz ambiente:");
  lcd.setCursor(0, 1);
  lcd.print("Nivel: 75%"); // Muestra datos ficticios
}

void airQuality() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Calidad de aire:");
  lcd.setCursor(0, 1);
  lcd.print("CO2: 400ppm"); // Muestra datos ficticios
}

void proximitySensor() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Proximidad:");
  lcd.setCursor(0, 1);
  lcd.print("Objeto cerca"); // Muestra datos ficticios
}

void advanceMenu() {
  currentScreen = (currentScreen + 1) % 4;  // 4 pantallas: 0, 1, 2, 3
  switch (currentScreen) {
    case 0:
      temperatureHumidity();
      break;
    case 1:
      ambientLight();
      break;
    case 2:
      airQuality();
      break;
    case 3:
      proximitySensor();
      break;
  }
}

void showRealTimeData() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Real Time Data:");
  lcd.setCursor(0, 1);
  lcd.print("Datos en tiempo");
  // Aquí se incluiría la lógica para mostrar datos en tiempo real
}

void showStoredData() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Stored Data:");
  lcd.setCursor(0, 1);
  lcd.print("Datos guardados");
  // Aquí se incluiría la lógica para mostrar datos guardados en EEPROM
}


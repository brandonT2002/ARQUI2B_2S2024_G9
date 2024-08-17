#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include <EEPROM.h>

// -------- LCD --------
LiquidCrystal_I2C lcd(0x27, 16, 2); // Dirección I2C de la pantalla

// -------- BUTTONS --------
const int button1Pin = 7; // Pin del botón 1
const int button2Pin = 8; // Pin del botón 2
const int button3Pin = 9; // Pin del botón 3
int currentScreen = 0;    // Para rastrear el menú actual

// -------- LIGHT --------
#define lightPin A3 // Pin analógico para el sensor de luz

// --------  ULTRASONIC --------
#define SENSOR_US_TRIG 12
#define SENSOR_US_ECHO 13

// -------- MQ-135 --------
const int mq2Pin = A0;

// -------- DHT-11 --------
#define DHTPIN 11
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

struct DHTValues
{
  float temperatura;
  float humedad;
};

// -------- EEPROM --------
const int startAddress = 2; // Dirección inicial para leer datos
// int dataQuantity = EEPROM.read(0); -> extraer la cantidad de datos guardados
int dataQuantity = 0;

struct Data
{
  int humidity;
  float temperature;
  byte light;
  int air;
  float proximity;
};
const int dataSize = sizeof(Data);
const int maxData = 10;

void setup()
{
  lcd.init();      // Inicializa la pantalla LCD
  lcd.backlight(); // Enciende la retroiluminación
  dht.begin();
  pinMode(button1Pin, INPUT);
  pinMode(button2Pin, INPUT);
  pinMode(button3Pin, INPUT);

  showWelcomeMenu(); // Muestra el menú de bienvenida al iniciar
}

void loop()
{
  sendData();
  // Leer estado de los botones
  if (digitalRead(button1Pin) == HIGH)
  {
    advanceMenu(); // Avanza entre los menús
    delay(300);    // Debounce
  }
  else if (digitalRead(button2Pin) == HIGH)
  {
    saveData(); // Guardar data
    delay(300); // Debounce
  }
  else if (digitalRead(button3Pin) == HIGH)
  {
    showStoredData(); // Muestra la información guardada
    delay(300);       // Debounce
  }
}

void showWelcomeMenu()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Bienvenido!");
  lcd.setCursor(0, 1);
  lcd.print("Presione Boton 1");
}

void temperatureHumidity()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Temp y Humedad:");
  lcd.setCursor(0, 1);
  DHTValues values = getDHT();
  lcd.print(String(values.humedad) + ", " + String(values.temperatura)); // Muestra datos ficticios
}

void ambientLight()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Luz ambiente:");
  lcd.setCursor(0, 1);
  lcd.print("Nivel: " + getLight()); // Muestra datos ficticios
}

void airQuality()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Calidad de aire:");
  lcd.setCursor(0, 1);
  lcd.print("CO2: " + getMQ()); // Muestra datos ficticios
}

void proximitySensor()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Proximidad:");
  lcd.setCursor(0, 1);
  lcd.print(getDistance()); // Muestra datos ficticios
}

void advanceMenu()
{
  currentScreen = (currentScreen + 1) % 4; // 4 pantallas: 0, 1, 2, 3
  switch (currentScreen)
  {
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

void showRealTimeData()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Real Time Data:");
  lcd.setCursor(0, 1);
  lcd.print("Datos en tiempo");
  // Aquí se incluiría la lógica para mostrar datos en tiempo real
}

void showStoredData()
{
  Data data;
  // String hum, light, air, prox;
  int count = 0;

  if (dataQuantity == 0)
  {
    lcd.setCursor(0, 0);
    lcd.print("No hay información guardada");
  }

  // for (int i = 0; i < maxData; i++) {
  int i = 0;
  Serial.print("dataQ");
  Serial.println(dataQuantity);

  while (i < dataQuantity && i < maxData)
  {
    Data data;
    int address = startAddress + i * dataSize;

    // Lee los datos de la EEPROM
    EEPROM.get(address, data);

    // Imprime los datos
    Serial.print("Data ");
    Serial.print(i);
    Serial.print(": ");
    Serial.print("Humidity = ");
    Serial.print(data.humidity);
    Serial.print(", ");
    Serial.print("Temperature = ");
    Serial.print(data.temperature);
    Serial.print(", ");
    Serial.print("Light = ");
    Serial.print(data.light);
    Serial.print(", ");
    Serial.print("Proximity = ");
    Serial.println(data.proximity);
    i++;
  }
}

void sendData(){
  Data data;
  DHTValues values = getDHT();
  data.humidity = values.humedad;
  data.temperature = values.temperatura;
  data.light = getLight();
  data.air = getMQ();
  data.proximity = getDistance();
  Serial.print(data.temperature);
  Serial.print(",");
  Serial.print(data.humidity);
  Serial.print(",");
  Serial.print(data.light);
  Serial.print(",");
  Serial.print(data.air);
  Serial.print(",");
  Serial.println(data.proximity);
}

void saveData()
{
  Data data;
  DHTValues values = getDHT();
  data.humidity = values.humedad;
  data.temperature = values.temperatura;
  data.light = getLight();
  data.proximity = getDistance();
  EEPROM.put(2 + dataQuantity * sizeof(Data), data);
  dataQuantity++;
  Serial.println("guardado");
  EEPROM.put(0, dataQuantity);
}

void showLCD(Data data, int count)
{
  lcd.setCursor(0, 0);
  lcd.print(count);
  lcd.setCursor(2, 0);
  lcd.print(":");
  // humedad
  lcd.setCursor(3, 0);
  lcd.write(byte(1));
  lcd.setCursor(4, 0);
  lcd.print(data.humidity);
  // temperatura
  lcd.setCursor(8, 0);
  lcd.write(byte(2));
  lcd.setCursor(9, 0);
  lcd.print(data.temperature);
  lcd.setCursor(14, 0);
  lcd.write(byte(6));
  lcd.setCursor(15, 0);
  lcd.print("C");
  // Luz
  lcd.setCursor(0, 1);
  lcd.write(byte(4));
  lcd.setCursor(1, 1);
  lcd.print(data.light);
  // aire
  lcd.setCursor(8, 1);
  lcd.write(byte(3));
  lcd.setCursor(9, 1);
  lcd.print(data.air);
  delay(3500);
  // lcd.autoscroll();
  for (int pos = 0; pos < 16; pos++)
  {
    lcd.scrollDisplayLeft();
  }
  lcd.setCursor(16, 0);
  lcd.write(byte(5));
  lcd.setCursor(17, 0);
  lcd.print(data.proximity);
  delay(3500);
  lcd.noAutoscroll();
  lcd.clear();
  lcd.setCursor(0, 0);
}

void showLastStoredData()
{
  Data data;
  int count = 0;

  if (dataQuantity == 0)
  {
    lcd.setCursor(0, 0);
    lcd.print("No hay información guardada");
  }

  int address = 2 + dataQuantity * sizeof(Data);
  EEPROM.get(address, data);
  showLCD(data, dataQuantity);
}

float getDistance()
{
  digitalWrite(SENSOR_US_TRIG, LOW);
  delayMicroseconds(2);

  digitalWrite(SENSOR_US_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(SENSOR_US_TRIG, LOW);

  long duration = pulseIn(SENSOR_US_ECHO, HIGH);

  float distance = duration * 0.034 / 2;
  return distance;
}

int getMQ()
{
  return analogRead(mq2Pin);
}

int getLight()
{
  int lightValue = analogRead(lightPin);
  lightValue = 1024 - lightValue;
  int porcent = (lightValue * 100) / 1024;
  return porcent;
}

DHTValues getDHT()
{
  DHTValues valores;

  // Lee la humedad y la temperatura
  valores.humedad = dht.readHumidity();
  valores.temperatura = dht.readTemperature();

  // Verifica si las lecturas fallaron
  if (isnan(valores.humedad))
  {
    valores.humedad = 0; // Valor de error
  }
  if (isnan(valores.temperatura))
  {
    valores.temperatura = 0; // Valor de error
  }
  return valores;
}

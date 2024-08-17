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
int proximity;
long duration;

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
  int proximity;
};
const int dataSize = sizeof(Data);
const int maxData = 10;

// -------- ICONS --------
byte gota_icon[8] = {
    B00000,
    B00100,
    B00100,
    B01110,
    B11111,
    B11111,
    B01110,
    B00000};
byte termo_icon[8] = {
    B01110,
    B01010,
    B01010,
    B01010,
    B01110,
    B01110,
    B01110,
    B01110};
byte aire_icon[8] = {
    B01101,
    B10010,
    B00000,
    B01001,
    B10110,
    B00000,
    B01101,
    B10010};
byte linterna_icon[8] = {
    B00100,
    B10101,
    B01110,
    B00000,
    B01110,
    B01010,
    B01010,
    B01110};
byte grado_icon[8] = {
    B00110,
    B01001,
    B01001,
    B00110,
    B00000,
    B00000,
    B00000,
    B00000};
byte persona_icon[8] = {
    B01110,
    B01110,
    B00100,
    B01111,
    B10100,
    B00100,
    B01010,
    B10001};

bool start = false;
void setup()
{
  Serial.begin(9600);
  lcd.init(); // Inicializa la pantalla LCD
  lcd.createChar(1, gota_icon);
  lcd.createChar(2, termo_icon);
  lcd.createChar(3, aire_icon);
  lcd.createChar(4, linterna_icon);
  lcd.createChar(5, persona_icon);
  lcd.createChar(6, grado_icon);
  lcd.backlight(); // Enciende la retroiluminación
  dht.begin();
  pinMode(button1Pin, INPUT_PULLUP);
  pinMode(button2Pin, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(button2Pin), saveData, FALLING);
  pinMode(button3Pin, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(button3Pin), showLastStoredData, FALLING);
  pinMode(SENSOR_US_TRIG, OUTPUT);
  pinMode(SENSOR_US_ECHO, INPUT);
  showWelcomeMenu(); // Muestra el menú de bienvenida al iniciar
}

void loop()
{
  sendData();
  bool button1State = digitalRead(button1Pin) == LOW;
  bool button2State = digitalRead(button2Pin) == LOW;
  bool button3State = digitalRead(button3Pin) == LOW;

  if (button1State)
  {
    advanceMenu();
    start = true;
  }
  else if (button2State)
  {
    saveData();
  }
  else if (button3State)
  {
    showLastStoredData();
  }

  if (start)
  {
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
    delay(200);
  }
  // Actualizar la pantalla actual en tiempo real
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
  String text = String(values.temperatura) + ", " + String(values.humedad);
  lcd.print(text);
}

void ambientLight()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Luz ambiente:");
  lcd.setCursor(0, 1);
  String text = String(getLight());
  lcd.print(text); // Muestra datos ficticios
}

void airQuality()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Calidad de aire:");
  lcd.setCursor(0, 1);
  // lcd.print("CO2: 400ppm"); // Muestra datos ficticios
  String text = String(getMQ()) + "ppm";
  lcd.print(text);
}

void proximitySensor()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Proximidad:");
  lcd.setCursor(0, 1);
  String text = String(getDistance()) + "cm";
  lcd.print(text);
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
    Serial.print(analogRead(lightPin));
    Serial.print(", ");
    Serial.print("Proximity = ");
    Serial.println(data.proximity);
    i++;
  }
}

void sendData()
{
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
  data.air = getMQ();
  data.proximity = getDistance();
  EEPROM.put(2 + dataQuantity * sizeof(Data), data);
  dataQuantity++;
  String text = "guardado, distancia " + String(data.proximity);
  Serial.println(text);
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
  EEPROM.get(0, dataQuantity);

  // Verificar si hay datos almacenados
  if (dataQuantity == 0)
  {
    Serial.println("No hay datos guardados en la EEPROM.");
    return;
  }

  // Calcular la dirección del último conjunto de datos
  int address = 2 + (dataQuantity - 1) * sizeof(Data);

  // Leer el último conjunto de datos
  Data data;
  EEPROM.get(address, data);
  showLCD(data, dataQuantity);
}

int getDistance()
{
  digitalWrite(SENSOR_US_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(SENSOR_US_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(SENSOR_US_TRIG, LOW);

  duration = pulseIn(SENSOR_US_ECHO, HIGH);
  proximity = duration * 0.034 / 2; // Calculamos la proximidad en cm

  // Limitar la proximidad a un máximo de 15 cm
  if (proximity > 15)
  {
    proximity = 15; // Si la proximidad es mayor a 15 cm, la limitamos a 15 cm
  }
  return proximity;
}

int getMQ()
{
  return analogRead(mq2Pin);
}

int getLight()
{
  return analogRead(lightPin);
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
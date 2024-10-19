#include <SPI.h>
#include <MFRC522.h>
#include <Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "DHT.h"

// === ULTRASONICO Y LEDS ===
const int trigPin = 12;
const int echoPin = 13;
const int ledAmarillo = 7;
const int ledRojo = 8;

// === SENSOR DE LUZ Y LED ===
const int lightSensorPin = A0;
const int ledLuz1Pin = 5;
const int ledLuz2Pin = 4;
const int darknessThreshold = 700;

// === SENSOR TEMPERATURA Y HUMEDAD ===
#define DHTPIN 22
#define DHTTYPE DHT11
DHT dht (DHTPIN, DHTTYPE);

// === SENSOR MQ ===
const int mqPin = A1;

// === RFID Y SERVO ===
#define SS_PIN 10
#define RST_PIN 9
MFRC522 rfid(SS_PIN, RST_PIN);
Servo myServo;

const int servoPin = 6;
const int angleOpen = 90;
const int angleClose = 180;

// === UID AUTORIZADO RFID ===
byte authorizedUID[] = {0x87, 0xAB, 0x61, 0x63};  // UID autorizado

// === INFRARROJO ===
const int infrarrojoPin = 11;

// === PANTALLA LCD ===
LiquidCrystal_I2C lcd(0x27, 16, 2);

// === DISTANCIAS PARA ULTRASONICO ===
long duration;
int distance;
const int minDistance = 2;  // Espacio ocupado
const int maxDistance = 8;  // Espacio a medias

// === VARIABLES PARA TEMPORIZADOR ===
unsigned long lastDetectionTime = 0;  // Tiempo de la última detección
const unsigned long closeDelay = 5000; // 5 segundos para cerrar
bool objectDetected = false;  // Estado de detección del objeto

// === COMPARACION DE ID ===
bool compareUID(byte *cardUID, byte *authorizedUID, byte size) {
  for (byte i = 0; i < size; i++) {
    if (cardUID[i] != authorizedUID[i]) {
      return false;
    }
  }
  return true;
}

void setup() {
  // Inicialización para el monitor serial
  Serial.begin(9600);

  // === INICIALIZACION DE RFID Y SERVO ===
  SPI.begin();
  rfid.PCD_Init();
  myServo.attach(servoPin);
  myServo.write(angleClose);  // Paso cerrado
  // Serial.println("Aproxime su tarjeta o llavero RFID");

  // === CONFIGURACION DE LCD ===
  lcd.begin(16, 2);
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Bienvenido :)");

  // === CONFIGURACION DE ULTRASONICO Y LEDS ===
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(ledAmarillo, OUTPUT);
  pinMode(ledRojo, OUTPUT);
  digitalWrite(ledAmarillo, LOW);
  digitalWrite(ledRojo, LOW);

  // === CONFIGURACION DE SENSOR DE LUZ Y LED ===
  pinMode(ledLuz1Pin, OUTPUT);
  pinMode(ledLuz2Pin, OUTPUT);

  // === CONFIGURACION DE TEMPERATURA Y HUMEDAD ===
  dht.begin();
}

void loop() {
  // === LECTURA DE INFRARROJO ===
  objectDetected = digitalRead(infrarrojoPin) == LOW; // Si LOW hay objeto, si HIGH no hay objeto

  // === ABRIENDO EL PASO : LECTURA DE RFID ===
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    // Compara el UID leído con el autorizado
    if (compareUID(rfid.uid.uidByte, authorizedUID, rfid.uid.size)) {
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Acceso");
      lcd.setCursor(0, 1);
      lcd.print("Permitido");
      
      myServo.write(angleOpen);  // Abre el paso
      lastDetectionTime = millis(); // Reinicia el temporizador al abrir
      delay(3000);  // Espera para permitir que el vehículo pase
    } else {
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Acceso");
      lcd.setCursor(0, 1);
      lcd.print("Denegado");

      delay(3000);

      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Bienvenido :)");
    }

    // Detener la tarjeta
    rfid.PICC_HaltA();
  }

  // === CERRANDO EL PASO : LECTURA DE INFRARROJO ===
  if (myServo.read() == angleOpen) {
    if (objectDetected) {
      lastDetectionTime = millis();  // Reiniciar el temporizador si hay un objeto
    } else {
      // Si no hay objeto, verificar el tiempo desde la última detección
      if (millis() - lastDetectionTime >= closeDelay) {
        myServo.write(angleClose);  // Cierra el paso
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("Bienvenido :)");
      }
    }
  }

  // === MEDICION DE DISTANCIA (ULTRASONICO) ===
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  // Leer la duración del eco
  duration = pulseIn(echoPin, HIGH, 30000);
  
  // Calcular la distancia en centímetros
  distance = duration * 0.034 / 2;

  // === VALIDACION DE DISTANCIAS PERMITIDAS ===
  if (distance >= minDistance && distance <= maxDistance) {
    // Encender LED amarillo si la distancia está entre 5 cm y 7 cm
    if (distance >= 5 && distance <= 7) {
      digitalWrite(ledAmarillo, HIGH);
    } else {
      digitalWrite(ledAmarillo, LOW);  // Apagar si no está en el rango
    }

    // Encender LED rojo si la distancia está entre 2 cm y 4 cm
    if (distance >= 2 && distance <= 4) {
      digitalWrite(ledRojo, HIGH);
    } else {
      digitalWrite(ledRojo, LOW);  // Apagar si no está en el rango
    }
  } else {
    digitalWrite(ledAmarillo, LOW);
    digitalWrite(ledRojo, LOW);
  }

  // === LECTURA DEL SENSOR DE LUZ ===
  int lightValue = analogRead(lightSensorPin);

  // Verificar si es oscuro y encender el LED correspondiente
  if (lightValue > darknessThreshold) {
    // Encender iluminación general
    digitalWrite(ledLuz1Pin, HIGH);
    digitalWrite(ledLuz2Pin, HIGH);
  } else {
    // Apagar ilumincación general
    digitalWrite(ledLuz1Pin, LOW);
    digitalWrite(ledLuz2Pin, LOW);
  }

  // === LECTURA DE TEMPERATURA Y HUMEDAD ===
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Error DHT11");
    return;
  }

  // === LECTURA MQ ===
  int mqValue = analogRead(mqPin);
  
  Serial.print("Temperatura: ");
  Serial.print(temperature);
  Serial.print(", Humedad: ");
  Serial.print(humidity);
  Serial.print(", Luz: ");
  Serial.print(lightValue);
  Serial.print(", MQ: ");
  Serial.print(mqValue);
  Serial.print(", Distancia");
  Serial.print(distance);
  Serial.println("");

  delay(500);  // Pausa para la siguiente lectura
}

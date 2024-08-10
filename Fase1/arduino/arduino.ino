#define SENSOR_US_TRIG 8
#define SENSOR_US_ECHO 7


float getDistance() {
  digitalWrite(SENSOR_US_TRIG, LOW);
  delayMicroseconds(2);

  digitalWrite(SENSOR_US_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(SENSOR_US_TRIG, LOW);

  long duration = pulseIn(SENSOR_US_ECHO, HIGH);

  float distance = duration * 0.034 / 2;
  return distance;
}

void setup() {
  Serial.begin(9600);

  pinMode(SENSOR_US_TRIG, OUTPUT);
  pinMode(SENSOR_US_ECHO, INPUT);
}

void loop() {
  float distance = getDistance();

  Serial.println(distance);

  delay(1000); 
}

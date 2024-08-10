import processing.serial.*;
Serial myPort;

int temperature = 0;
int humidity = 0;
int illumination = 0;
int co2 = 0;
int proximity = 0;
String inputString = " ";
float[] humidityValues = new float[50];  // Valores aleatorios de humedad

color cardBackgroundColor = color(38, 38, 41);
color titleColor = color(104, 104, 104);
color valueColor = color(255, 255, 255);
color graphColor = color(89, 188, 244);
color co2GraphColor = color(46, 160, 67);  // Color verde para la gráfica de CO2
color canvasBackgroundColor = color(23, 22, 26);

PFont boldFont;
PFont mediumFont;

Card[] cards;

void setup() {
    size(800, 600);
    background(canvasBackgroundColor);
    
    myPort = new Serial(this, Serial.list()[0], 9600);  // Configurar el puerto serial
    myPort.bufferUntil('\n');  // Leer hasta encontrar un salto de línea
    
    boldFont = createFont("Font/Montserrat-Bold.ttf", 24);
    mediumFont = createFont("Font/Montserrat-Medium.ttf", 24);
    
    cards = new Card[5];
    cards[0] = new TemperatureCard("Temperatura");
    cards[1] = new HumidityCard("Humedad", humidity + "%");
    cards[2] = new IlluminationCard("Iluminación", illumination + " lux"); // Usar IlluminationCard
    println(co2+"????");
    cards[3] = new CO2Card("CO2", co2 + " ppm");
    cards[4] = new Card("Proximidad", proximity + "%");
}

void draw() {
    background(canvasBackgroundColor);
    
    int cardWidth = 363;
    int cardHeight = 170;
    int padding = 20;
    
    int columns = 2;
    int rows = 3;
    
    int totalWidth = columns * cardWidth + (columns - 1) * padding;
    int totalHeight = rows * cardHeight + (rows - 1) * padding;
    
    int xStart = (width - totalWidth) / 2;
    int yStart = (height - totalHeight) / 2;
    
    // Card positions
    int[] xPositions = {xStart, xStart + cardWidth + padding};
    int[] yPositions = {yStart, yStart + cardHeight + padding, yStart + 2 * (cardHeight + padding)};
    println(co2+"ppm ------");
    // Draw cards
    cards[0].draw(xPositions[0], yPositions[0], cardWidth, cardHeight * 2 + padding);    // Temperatura
    cards[1].draw(xPositions[0], yPositions[2], cardWidth, cardHeight);                 // Humedad
    cards[2].draw(xPositions[1], yPositions[0], cardWidth, cardHeight);                 // Iluminación
    cards[3].draw(xPositions[1], yPositions[1], cardWidth, cardHeight);                 // CO2
    cards[4].draw(xPositions[1], yPositions[2], cardWidth, cardHeight);                 // Proximidad
    int n = 10;
    cards[3] = new CO2Card("CO2", co2 + " ppm");
}

void readData(int test) {
    serialEvent(myPort);
    //cards[3] = new CO2Card("CO2", co2 + " ppm");
    //println(test);
      //cards[3] = new CO2Card("CO2", co2 + " ppm");

}

void serialEvent(Serial myPort) {
  
    inputString = myPort.readStringUntil('\n');  // Leer hasta el salto de línea
    inputString = trim(inputString);  // Quitar espacios en blanco y saltos de línea adicionales
    //print("..");
    if (inputString != null) {
        String[] values = split(inputString, ',');
        //if (values.length == 5) {
          //  temperature = int(values[0]);
           // humidity = int(values[1]);
            //illumination = int(values[2]);
            //print(values.toString());
            co2 = int(values[0]);
            //println(co2+"value");
            //print(co2);
           // proximity = int(values[4]);
        //}
    }
}

@FunctionalInterface
interface StringSupplier {
    String get();
}

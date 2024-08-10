int temperature = 0;
int humidity = 0;
int illumination = 0;
int co2 = 0;
int proximity = 0;

color cardBackgroundColor = color(38, 38, 41);
color titleColor = color(104, 104, 104);
color valueColor = color(255, 255, 255);
color graphColor = color(89, 188, 244);
color co2GraphColor = color(46, 160, 67);  // Color verde para la gráfica de CO2
color canvasBackgroundColor = color(23, 22, 26);

PFont boldFont;
PFont mediumFont;

Card[] cards;
float[] humidityValues = new float[50];  // Valores aleatorios de humedad
float[] co2Values = new float[50];  // Valores aleatorios de CO2

void setup() {
    size(800, 600);
    background(canvasBackgroundColor);
    
    boldFont = createFont("Font/Montserrat-Bold.ttf", 24);
    mediumFont = createFont("Font/Montserrat-Medium.ttf", 24);
    
    cards = new Card[5];
    cards[0] = new TemperatureCard("Temperatura");
    cards[1] = new HumidityCard("Humedad", () -> humidity + "%");
    cards[2] = new IlluminationCard("Iluminación", () -> illumination + " lux"); // Usar IlluminationCard
    cards[3] = new CO2Card("CO2", () -> co2 + " ppm");
    cards[4] = new Card("Proximidad", () -> proximity + "%");
    
    readData();
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
    
    // Draw cards
    cards[0].draw(xPositions[0], yPositions[0], cardWidth, cardHeight * 2 + padding);    // Temperatura
    cards[1].draw(xPositions[0], yPositions[2], cardWidth, cardHeight);                 // Humedad
    cards[2].draw(xPositions[1], yPositions[0], cardWidth, cardHeight);                 // Iluminación
    cards[3].draw(xPositions[1], yPositions[1], cardWidth, cardHeight);                 // CO2
    cards[4].draw(xPositions[1], yPositions[2], cardWidth, cardHeight);                 // Proximidad
    
    if (frameCount % 60 == 0) {
        readData();
    }
}

void readData() {
    temperature = int(random(15, 30));
    humidity = int(random(0, 100));
    illumination = int(random(100, 1000));
    co2 = int(random(300, 1000));
    proximity = int(random(0, 100));    // Simulación de proximidad
    
    // Actualizar valores de humedad
    for (int i = 0; i < humidityValues.length - 1; i++) {
        humidityValues[i] = humidityValues[i + 1];
    }
    humidityValues[humidityValues.length - 1] = humidity;

    // Actualizar valores de CO2
    for (int i = 0; i < co2Values.length - 1; i++) {
        co2Values[i] = co2Values[i + 1];
    }
    co2Values[co2Values.length - 1] = co2;
}

@FunctionalInterface
interface StringSupplier {
    String get();
}

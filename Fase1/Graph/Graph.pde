import processing.serial.*;
Serial myPort;

int temperature = 0;
int humidity = 0;
int ilumination = 0;
int co2 = 0;
int proximity = 0;
String inputString = " ";
boolean showModal = false;

color cardBackgroundColor = color(38, 38, 41);
color canvasBackgroundColor = color(23, 22, 26);
color titleColor = color(104, 104, 104);
color valueColor = color(255, 255, 255);
color graphColor = color(89, 188, 244);
color co2GraphColor = color(46, 160, 67);
color barColor = color(229, 201, 129, 102);
color colorIlumitation = color(229, 201, 129);
color proximity1 = color(30, 144, 255);
color proximity2 = color(255, 165, 0);
color rombo = color(169, 169, 169);

PFont boldFont;
PFont mediumFont;

Card[] cards;

void setup() {
    size(800, 650);
    background(canvasBackgroundColor);
    println(Serial.list());

    String portName = "COM5";
    myPort = new Serial(this, portName, 9600);
    myPort.bufferUntil('\n');
    
    boldFont = createFont("Font/Montserrat-Bold.ttf", 24);
    mediumFont = createFont("Font/Montserrat-Medium.ttf", 24);
    
    cards = new Card[5];
    cards[0] = new TemperatureCard("Temperatura");
    cards[1] = new HumidityCard("Humedad", humidity + "%");
    cards[2] = new IluminationCard("Iluminación", ilumination + " lux");
    cards[3] = new CO2Card("CO2", co2 + " ppm");
    cards[4] = new ProximityCard("Proximidad", proximity + " %");
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

    // Update values
    cards[0].valueSupplier = temperature + "°C";
    cards[1].valueSupplier = humidity + "%";
    cards[2].valueSupplier = ilumination + " lux";
    cards[3].valueSupplier = co2 + " ppm";
    cards[4].valueSupplier = proximity + " %";

    // Draw cards
    cards[0].draw(xPositions[0], yPositions[0], cardWidth, cardHeight * 2 + padding);
    cards[1].draw(xPositions[0], yPositions[2], cardWidth, cardHeight);
    cards[2].draw(xPositions[1], yPositions[0], cardWidth, cardHeight);
    cards[3].draw(xPositions[1], yPositions[1], cardWidth, cardHeight);
    cards[4].draw(xPositions[1], yPositions[2], cardWidth, cardHeight);

    fill(0);
    textAlign(CENTER);
    fill(titleColor);
    textFont(mediumFont);
    textSize(15);
    text("Grupo 09 - Arqui2", 400, 630);

    if (showModal) {
        drawBlurOverlay();
        showModalWindow();
    }
}

void drawBlurOverlay() {
    fill(0, 15); // opacidad del 15%
    rect(0, 0, width, height);
    
    // Efecto Blur
    filter(BLUR, 8);
}

void mousePressed() {
    if (!showModal && mouseX > 350 && mouseX < 450 && mouseY > 615 && mouseY < 645) {
        showModal = true;  // Mostrar la ventana modal
    } else if (showModal && mouseX > 350 && mouseX < 450 && mouseY > 485 && mouseY < 515) {
        showModal = false;  // Cerrar la ventana modal
    }
}

void showModalWindow() {
    fill(canvasBackgroundColor);
    rect(200, 100, 400, 450, 10);

    fill(255);
    textSize(28);
    textAlign(CENTER);
    text("Arqui2", 400, 175);

    textSize(20);
    text("Brandon Tejaxún", 400, 250);
    text("Dyllan García", 400, 280);
    text("Miguel Guirola", 400, 310);
    text("Joab Ajsivinac", 400, 340);
    text("Marcos Pérez", 400, 370);
    text("Eduardo Barillas", 400, 400);

    // Crear el botón "Cerrar"
    int buttonX = 350;
    int buttonY = 485;
    int buttonWidth = 100;
    int buttonHeight = 30;
    
    fill(cardBackgroundColor);
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 5);
    
    fill(255); // Color del texto
    textSize(15);
    text("Cerrar", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2 + 5);  // Centrando el texto en el botón
}

void serialEvent(Serial myPort) {
    inputString = myPort.readStringUntil('\n');
    inputString = trim(inputString);

    if (inputString != null) {
        String[] values = split(inputString, ',');
        if (values.length == 5) {
            temperature = int(values[0]);
            humidity = int(values[1]);
            ilumination = int(values[2]);
            co2 = int(values[3]);
            proximity = int(values[4]);
        }
    }
}

@FunctionalInterface
interface StringSupplier {
    String get();
}

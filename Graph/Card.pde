class Card {
    String title;
    StringSupplier valueSupplier;
    
    Card(String title, StringSupplier valueSupplier) {
        this.title = title;
        this.valueSupplier = valueSupplier;
    }
    
    void draw(int x, int y, int width, int height) {
        int padding = 20;
        int borderRadius = 10;
        int marginLeft = 25;
        int marginTop = 25;
        int marginBottom = 25;
        
        fill(cardBackgroundColor);
        noStroke(); // Remove border color
        rect(x, y, width, height, borderRadius);
        
        textAlign(CENTER);
        fill(titleColor);
        textFont(boldFont);
        textSize(32);
        text(title, x + width / 2, y + marginTop + 30);
        
        if (!(this instanceof TemperatureCard)) {
            fill(valueColor);
            textAlign(LEFT);
            textFont(mediumFont);
            textSize(28);
            text(valueSupplier.get(), x + marginLeft, y + height - marginBottom - 20);
        }
    }
    
    /*void drawBar(int x, int y, int width, int height, float value, float minValue, float maxValue, color barColor) {
        float barWidth = width - 40;  // Ancho de la barra con padding
        float barHeight = 20;         // Alto de la barra
        float barX = x + 20;          // Posición horizontal
        float barY = y + height - barHeight - 60; // Ajustar posición vertical para que quede dentro del card

        // Dibujar el fondo de la barra
        fill(50, 50, 50); // Gris oscuro para el fondo de la barra
        rect(barX, barY, barWidth, barHeight, 10);

        // Dibujar el relleno de la barra basado en el valor
        float barFillWidth = map(value, minValue, maxValue, 0, barWidth);
        fill(barColor);
        rect(barX, barY, barFillWidth, barHeight, 10);

        // Dibujar el borde de la barra
        stroke(200);
        noFill();
        rect(barX, barY, barWidth, barHeight, 10);
    }*/
}

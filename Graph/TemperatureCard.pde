class TemperatureCard extends Card {
    int numSegments = 34;
    float startAngle = PI;
    float endAngle = TWO_PI;
    float[] segmentColors = new float[numSegments];
    float gap = 20;

    TemperatureCard(String title) {
        super(title, null);
        updateSegmentColors();
    }
    
    void updateSegmentColors() {
        for (int i = 0; i < numSegments; i++) {
            float lerpFactor = map(i, 0, numSegments, 0, 1); // Factor para interpolar entre los colores
            float hue = map(lerpFactor, 0, 1, 200, 0); // De celeste (200) a rojo (0)
            segmentColors[i] = hue;
        }
    }
    
    void drawThermometer(int x, int y, int width, int height) {
        float angleStep = (endAngle - startAngle) / numSegments; // Paso del ángulo entre segmentos
        float ellipseWidth = 10;
        float ellipseHeight = 25;
        float adjustedRadius = (width / 2 - gap) * 0.8;
        y += 90;

        for (int i = 0; i < numSegments; i++) {
            float currentAngle = startAngle + i * angleStep;
            fill(segmentColors[i], 100, 100);
            
            if (i >= map(temperature, 0, 100, 0, numSegments)) {
                fill(0, 0, 30); // Segmentos grises
            }
            
            float xPos = x + width / 2 + cos(currentAngle) * adjustedRadius;
            float yPos = y + height / 2 + sin(currentAngle) * adjustedRadius;
            
            pushMatrix();
            translate(xPos, yPos);
            float rotationAngle = currentAngle + HALF_PI; // Inclinación hacia el centro
            rotate(rotationAngle); 
            ellipse(0, 0, ellipseWidth, ellipseHeight);
            popMatrix();
        }
    }

    void drawTemperatureText(int x, int y, int width, int height) {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(32);
        
        // Posición del texto
        float textRadius = 20;
        float textX = x + width / 2;
        float textY = y + height / 2 - textRadius + 85;
        
        text(nf(temperature, 1, 1) + " °C", textX, textY);
    }
    
    @Override
    void draw(int x, int y, int width, int height) {
        super.draw(x, y, width, height);
        colorMode(HSB, 360, 100, 100);
        noStroke();
        drawThermometer(x, y, width, height);
        drawTemperatureText(x, y, width, height);
    }
}
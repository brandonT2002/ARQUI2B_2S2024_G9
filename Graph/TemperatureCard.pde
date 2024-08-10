class TemperatureCard extends Card {
    int numSegments = 34; // Número de segmentos
    float startAngle = PI; // Ángulo de inicio del arco
    float endAngle = TWO_PI; // Ángulo de fin del arco
    float[] segmentColors = new float[numSegments]; // Array para almacenar los colores de cada segmento
    float gap = 20; // Espacio entre elipses

    TemperatureCard(String title) {
        super(title, null);
        updateSegmentColors();
    }
    
    void updateSegmentColors() {
        for (int i = 0; i < numSegments; i++) {
            float lerpFactor = map(i, 0, numSegments, 0, 1); // Factor para interpolar entre los colores
            float hue = map(lerpFactor, 0, 1, 200, 0); // De celeste azulado (200) a rojo (0)
            segmentColors[i] = hue;
        }
    }
    
    void drawThermometer(int x, int y, int width, int height) {
        float angleStep = (endAngle - startAngle) / numSegments; // Paso del ángulo entre segmentos
        float ellipseWidth = 10; // Ancho de las elipses
        float ellipseHeight = 25; // Alto de las elipses
        float adjustedRadius = (width / 2 - gap) * 0.8; // Radio ajustado reducido en un 20%

        y += 90;  // Desplaza el termómetro hacia abajo

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
        
        // Ajustar la posición vertical del texto dentro del círculo
        float textRadius = 20; // Radio donde se ubicará el texto dentro del círculo
        float textX = x + width / 2;
        float textY = y + height / 2 - textRadius + 85;  // Ajuste para mover el texto junto con el termómetro
        
        text(nf(temperature, 1, 1) + " °C", textX, textY); // Mostrar temperatura con un decimal
    }
    
    @Override
    void draw(int x, int y, int width, int height) {
        super.draw(x, y, width, height);
        colorMode(HSB, 360, 100, 100); // Usar HSB para fácil manejo de colores
        noStroke();
        drawThermometer(x, y, width, height); // Dibuja el termómetro
        drawTemperatureText(x, y, width, height); // Dibuja el texto de temperatura
    }
}
class HumidityCard extends Card {
    
    HumidityCard(String title, StringSupplier valueSupplier) {
        super(title, valueSupplier);
    }
    
    void draw(int x, int y, int width, int height) {
        super.draw(x, y, width, height);
        
        // Dibujar gráfico de humedad
        int graphWidth = width - 150;  // Ancho reducido para dejar espacio al valor
        int graphHeight = height / 3;
        int graphX = x + 115;  // Espacio para el valor y gap
        int graphY = y + height - graphHeight - 20;

        strokeWeight(2);  // Ajustar el grosor de la línea
        stroke(graphColor);
        noFill();
        
        beginShape();
        for (int i = 0; i < humidityValues.length; i++) {
            float xPos = map(i, 0, humidityValues.length - 1, graphX, graphX + graphWidth);
            // Asegurarse de que los valores de humedad se mantengan dentro del rango visible
            float yPos = map(humidityValues[i], 30, 80, graphY + graphHeight, graphY);
            yPos = constrain(yPos, graphY, graphY + graphHeight); // Asegurar que la gráfica no salga del card
            vertex(xPos, yPos);
        }
        endShape();
    }
}
class CO2Card extends Card {
    
    CO2Card(String title, StringSupplier valueSupplier) {
        super(title, valueSupplier);
    }
    
    void draw(int x, int y, int width, int height) {
        super.draw(x, y, width, height);
        
        // Dibujar gráfico de CO2
        int graphWidth = width - 210;  // Ancho reducido para dejar espacio al valor
        int graphHeight = height / 3;
        int graphX = x + 175;  // Espacio para el valor y gap
        int graphY = y + height - graphHeight - 20;

        strokeWeight(2);  // Ajustar el grosor de la línea
        stroke(co2GraphColor);
        noFill();
        
        beginShape();
        for (int i = 0; i < co2Values.length; i++) {
            float xPos = map(i, 0, co2Values.length - 1, graphX, graphX + graphWidth);
            // Asegurarse de que los valores de CO2 se mantengan dentro del rango visible
            float yPos = map(co2Values[i], 300, 1000, graphY + graphHeight, graphY);
            yPos = constrain(yPos, graphY, graphY + graphHeight); // Asegurar que la gráfica no salga del card
            vertex(xPos, yPos);
        }
        endShape();
    }
}
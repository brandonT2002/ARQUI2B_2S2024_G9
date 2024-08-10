class CO2Card extends Card {
    
    CO2Card(String title, String valueSupplier) {
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
        //println(valueSupplier);
        
        line(graphX, graphY + graphHeight / 2, graphX + graphWidth, graphY + graphHeight / 2);  // Línea horizontal para valor de CO2
    }
}

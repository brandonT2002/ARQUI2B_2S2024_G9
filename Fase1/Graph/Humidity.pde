class HumidityCard extends Card {

    float[] humidityValues = new float[100];
    int index = 0;
    boolean filled = false;
    
    HumidityCard(String title, String valueSupplier) {
        super(title, valueSupplier);
    }
    
    void draw(int x, int y, int width, int height) {
        super.draw(x, y, width, height);

        humidityValues[index] = float(co2);
        index++;

        if (index >= humidityValues.length) {
            index = 0;
            filled = true;
        }
        
        // Dibujar gráfico de humedad
        int graphWidth = width - 150;
        int graphHeight = height / 3;
        int graphX = x + 115;
        int graphY = y + height - graphHeight - 20;

        strokeWeight(2);
        stroke(graphColor);
        noFill();
        
        beginShape();
        int startIndex = filled ? index : 0;
        for (int i = 0; i < humidityValues.length; i++) {
            int dataIndex = (startIndex + i) % humidityValues.length; 
            int xPos = graphX + int(map(i, 0, humidityValues.length - 1, 0, graphWidth));
            float yPos = graphY + graphHeight - map(humidityValues[dataIndex], 0, 1000, 0, graphHeight);
            vertex(xPos, yPos);
        }
        endShape();
    }
}

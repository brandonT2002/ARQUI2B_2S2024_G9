class CO2Card extends Card {
    
    float[] co2Values = new float[100];
    int index = 0;
    boolean filled = false;
    
    CO2Card(String title, String valueSupplier) {
        super(title, valueSupplier);
    }
    
    void draw(int x, int y, int width, int height) {
        super.draw(x, y, width, height);
        
        co2Values[index] = float(co2);
        index++;
        
        if (index >= co2Values.length) {
            index = 0;
            filled = true;
        }
        
        // Dibujar gráfico de CO2
        int graphWidth = width - 190;
        int graphHeight = height / 3;
        int graphX = x + 170;
        int graphY = y + height - graphHeight - 20;
        
        strokeWeight(2);
        stroke(co2GraphColor);
        noFill();
        
        beginShape();
        int startIndex = filled ? index : 0;
        for (int i = 0; i < co2Values.length; i++) {
            int dataIndex = (startIndex + i) % co2Values.length; 
            int xPos = graphX + int(map(i, 0, co2Values.length - 1, 0, graphWidth));
            float yPos = graphY + graphHeight - map(co2Values[dataIndex], 0, 1000, 0, graphHeight);
            vertex(xPos, yPos);
        }
        endShape();
    }
}

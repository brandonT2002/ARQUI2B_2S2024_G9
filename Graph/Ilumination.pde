class IluminationCard extends Card {
    
    IluminationCard(String title, String valueSupplier) {
        super(title, valueSupplier);
    }
    
    void draw(int x, int y, int width, int height) {
        super.draw(x, y, width, height);

        int iluminationValue = int(valueSupplier.split(" ")[0]);
        
        // Configuración de la barra de iluminación
        int barWidth = width - 130;
        int barHeight = height / 3;
        int graphX = x + 115;
        int graphY = y + height - barHeight - 20;
        int maxIllumination = 100;
        
        // Dibuja la barra de iluminación
        noStroke();
        fill(barColor);
        rect(graphX, graphY, barWidth, barHeight, 5);
        
        float illuminationWidth = map(iluminationValue, 0, maxIllumination, 0, barWidth);
        fill(colorIlumitation);
        rect(graphX, graphY, illuminationWidth, barHeight, 5);
    }
}

class IlluminationCard extends Card {
    
    IlluminationCard(String title, StringSupplier valueSupplier) {
        super(title, valueSupplier);
    }
    
    void draw(int x, int y, int width, int height) {
        super.draw(x, y, width, height);
        
        // Color cálido para la barra
        color barColor = color(255, 165, 0); // Naranja cálido
        
        // Dibuja la barra de porcentaje de iluminación
        // drawBar(x, y, width, height, illumination, 0, 100, barColor);
    }
}

class Card {
    String title;
    String valueSupplier;
    
    Card(String title, String valueSupplier) {
        this.title = title;
        this.valueSupplier = valueSupplier;
    }
    
    void draw(int x, int y, int width, int height) {
        //int padding = 20;
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
        
        if (!(this instanceof TemperatureCard || this instanceof ProximityCard)) {
            fill(valueColor);
            textAlign(LEFT);
            textFont(mediumFont);
            textSize(28);
            text(valueSupplier, x + marginLeft, y + height - marginBottom - 20);
        }
    }
}

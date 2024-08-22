class IluminationCard extends Card {
    color colorIlumination;  // Declare the color variable

    IluminationCard(String title, String valueSupplier) {
        super(title, valueSupplier);
        colorIlumination = color(229, 201, 129);  // Initialize the color
    }
    
    void draw(int x, int y, int width, int height) {
        super.draw(x, y, width, height);

        int iluminationValue = int(valueSupplier.split(" ")[0]);

        // Configuración de la barra de iluminación
        int barWidth = width - 150;
        int barHeight = height / 3;
        int graphX = x + 135;
        int graphY = y + height - barHeight - 20;
        int maxIllumination = 200;  // Use the correct max value
        //println(iluminationValue);
        

        // Reverse the mapping logic
        float illuminationWidth = map(iluminationValue, maxIllumination, 0, barWidth, 0);

        // Draw the illumination bar with inverted logic
        noStroke();
        fill(barColor);
        rect(graphX, graphY, barWidth, barHeight, 5);

        fill(colorIlumination);  // Use the defined color
        rect(graphX, graphY, illuminationWidth, barHeight, 5);
    }
}

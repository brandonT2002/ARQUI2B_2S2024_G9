class ProximityCard extends Card {
    ProximityCard(String title, String valueSupplier) {
        super(title, valueSupplier);
    }

    void draw(int x, int y, int width, int height) {
        super.draw(x, y, width, height);

        float minDist = 2;
        float maxDist = 400;
        int gap = 20;

        float distance = float(valueSupplier.split(" ")[0]);

        // Dimensiones
        int totalWidth = 250;
        int barraHeight = 20;
        int borderRadius = 5;

        // Calcular las posiciones utilizando graphX y graphY
        int graphX = x + (width - totalWidth) / 2;
        int graphY = y + height - barraHeight - 50;

        // Posición - Barra azúl
        float blueWidth = map(distance, minDist, maxDist, 0, totalWidth - 2 * gap);
        fill(proximity1);
        rect(graphX, graphY, blueWidth, barraHeight, borderRadius);

        // Posición - Barra naranja
        float orangeWidth = totalWidth - blueWidth - 2 * gap;
        fill(proximity2);
        rect(graphX + blueWidth + 2 * gap, graphY, orangeWidth, barraHeight, borderRadius);

        // Posición - Rombo
        float mappedX = graphX + blueWidth + gap;

        // Rombo
        fill(rombo);
        beginShape();
        vertex(mappedX, graphY + barraHeight / 2 - 10);
        vertex(mappedX + 10, graphY + barraHeight / 2);
        vertex(mappedX, graphY + barraHeight / 2 + 10);
        vertex(mappedX - 10, graphY + barraHeight / 2);
        endShape(CLOSE);

        // Distancia
        fill(255);
        textSize(16);
        textAlign(CENTER, CENTER);
        text(distance + " cm", mappedX, graphY + barraHeight + 20);
    }
}

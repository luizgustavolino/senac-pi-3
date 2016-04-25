
package br.senac.pi;

import static java.lang.Math.sqrt;

public class Coordenada {

    private double latitude;
    private double longitude;

    public Coordenada(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    
    public static double distanciaEntre(Coordenada p1, Coordenada p2) {
        double distancia = sqrt(Math.pow((p2.latitude - p1.latitude), 2) + Math.pow((p2.longitude - p1.longitude), 2));
        return distancia;
    }
    
}

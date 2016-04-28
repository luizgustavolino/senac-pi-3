
package br.senac.pi;

import static java.lang.Math.sqrt;
import java.util.ArrayList;

public class Coordenada {

    private double latitude;
    private double longitude;
    
    public ArrayList<Aresta> arestasPartindo;
    public ArrayList<Aresta> arestasChegando;

    public Coordenada(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    
    public static double distanciaEntre(Coordenada p1, Coordenada p2) {
        double distancia = sqrt(Math.pow((p2.getLatitude() - p1.getLatitude()), 2) + Math.pow((p2.getLongitude() - p1.getLongitude()), 2));
        return distancia;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }
}

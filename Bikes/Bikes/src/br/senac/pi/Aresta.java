package br.senac.pi;

import java.util.ArrayList;

public class Aresta {
    
    private static int currentIDCount = 1;
    private int id;
    private Coordenada origem;
    private Coordenada destino;
    private boolean vaiVem;

    public Aresta(Coordenada origem, Coordenada destino, boolean vaiVem) {
        this.id = currentIDCount++;
        this.origem = origem;
        this.destino = destino;
        this.vaiVem = vaiVem;
    }
    
    public double tamanho(){
        return Coordenada.distanciaEntre(origem, destino);
    }
    
    public Coordenada pontoMedio(){
        // implementar: ponto medio de segmento
        // a ------- ponto medio ------- b
        return new Coordenada(0.0, 0.0);
    }
    
    public boolean estaPertoDaCoordanada(Coordenada c){
        // implementar
        // d1 = pegue a distancia de origin até o ponto médio 
        // d2 = distancia entre a coordenada testada (c)
        // retorna se d2 <= d1 
        return false;
    }
    
    public double distanciaDaPerpendicularAoPonto(Coordenada c){
        // implementar:
        //              C
        //              | <- essa distancia
        //  orig. ------o-- dest.
        //              |
        //              | <- perpendicular
        
        return 0.0;
    }
  
}

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
    
    public Coordenada pontoMedio(double Xa, double Ya, double Xb, double Yb){ 
       double Xm, Ym;
       Xm = (Xa + Xb)/2;
       Ym = (Ya + Yb)/2;
       return new Coordenada(Xm, Ym);
    }
    
    public boolean estaPertoDaCoordanada(Coordenada c){
        // dando erro pois não esta reconhecendo o metodo ponto medio, acredito que depois de implementado não aconteça mais o erro. repare que eu calculo em origem e destino nesta ordem
        double d1 = Coordenada.distanciaEntre(this.origem, Aresta.pontoMedio(this.origem, this.destino));
        double d2 = Coordenada.distanciaEntre(this.origem, c);//aqui fiquei em duvida se a distancia é em relação a origem
        return d2 <= d1;//não sei se isso funciona, mas acho q funciona sim
        /*
            if(d2 <= d1){
                return true;
            }
            return false;
        */
        
        // d1 = pegue a distancia de origin até o ponto médio 
        // d2 = distancia entre a coordenada testada (c)
        // retorna se d2 <= d1 
        //return false;
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

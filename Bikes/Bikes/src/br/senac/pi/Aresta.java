package br.senac.pi;

public class Aresta {
    
    private Coordenada origem;
    private Coordenada destino;
    private boolean vaiVem;

    public Aresta(Coordenada origem, Coordenada destino, boolean vaiVem) {
        this.origem = origem;
        this.destino = destino;
        this.vaiVem = vaiVem;
    }
    
    public double tamanho(){
        return Coordenada.distanciaEntre(origem, destino);
    }
}

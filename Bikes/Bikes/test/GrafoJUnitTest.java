

import br.senac.pi.Aresta;
import br.senac.pi.Coordenada;
import br.senac.pi.Grafo;
import java.util.ArrayList;
import org.junit.*;
import static org.junit.Assert.*;

public class GrafoJUnitTest {
    
    // TODO add test methods here.
    // The methods must be annotated with annotation @Test. For example:
    //
    @Test
    public void testDistancia() {
        ArrayList<Aresta> arestas = new ArrayList();
        
        Coordenada c1o = new Coordenada(10, 10);
        Coordenada c1d = new Coordenada(20, 10);
        Aresta a1 = new Aresta(c1o, c1d, false);
        c1o.arestasPartindo.add(a1);
        arestas.add(a1);
        
        Coordenada c2o = c1d;
        Coordenada c2d = new Coordenada(40, 40);
        Aresta a2 = new Aresta(c2o, c2d, false);
        c1d.arestasChegando.add(a1);
        c2o.arestasPartindo.add(a2);
        arestas.add(a2);
        
        Coordenada c3o = c2d;
        Coordenada c3d = new Coordenada(40, 40);
        Aresta a3 = new Aresta(c3o, c3d, false);
        c2d.arestasChegando.add(a2);
        c3o.arestasPartindo.add(a3);
        arestas.add(a3);
        
        Coordenada c4o = c2d;
        Coordenada c4d = new Coordenada(40, 40);
        Aresta a4 = new Aresta(c4o, c4d, false);
        c2d.arestasChegando.add(a2);
        c4o.arestasPartindo.add(a4);
        arestas.add(a4);
        
        //   o 3 o 4 
        //    \ /
        //     o 2
        //     |
        //     o 1
        
        Grafo g = new Grafo(arestas);
        System.out.println(g.melhorRotaEntre(c1o, c4d));
        // resposta esperada: 1,2,4
        
    }
}

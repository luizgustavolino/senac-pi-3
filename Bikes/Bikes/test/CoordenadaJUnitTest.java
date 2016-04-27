
import br.senac.pi.Coordenada;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

public class CoordenadaJUnitTest {
    
    public CoordenadaJUnitTest() {
    }
    
    @BeforeClass
    public static void setUpClass() {
    }
    
    @AfterClass
    public static void tearDownClass() {
    }
    
    @Before
    public void setUp() {
    }
    
    @After
    public void tearDown() {
    }

    @Test
    public void testarDistancia() {
        {
            Coordenada c1 = new Coordenada(15.0, 11.0);
            Coordenada c2 = new Coordenada(3.0, 20.0);
            assertEquals(15.0, Coordenada.distanciaEntre(c1, c2), 0.0);
        }
        {
            Coordenada c1 = new Coordenada(0.0, 0.0);
            Coordenada c2 = new Coordenada(1.0, 0.0);
            assertEquals(1.0, Coordenada.distanciaEntre(c1, c2), 0.0);
        }
        {
            Coordenada c1 = new Coordenada(-20.0, 0.0);
            Coordenada c2 = new Coordenada(20.0, 0.0);
            assertEquals(40.0, Coordenada.distanciaEntre(c1, c2), 0.0);
        }
    }
}

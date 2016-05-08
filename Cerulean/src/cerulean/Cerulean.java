package cerulean;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

public class Cerulean extends Application {
  
    public static void main(String[] args) {
        launch(args);
    }
    
    @Override
    public void start(Stage stage) {
    
        StackPane pane = new StackPane();
      
        try{
            FallbackCerulean.installOnPanel(pane);
        }catch(Exception e){
            FallbackCerulean.installOnPanel(pane);
        }
      
        Scene scene = new Scene(pane, 960, 520);
        stage.setTitle("Cerulean");
        stage.setScene(scene);
        stage.show();
    }
}
package cerulean;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.web.WebView;
import javafx.stage.Stage;

public class Cerulean extends Application {
  
   public static void main(String[] args) {
      launch(args);
  }
  
  @Override public void start(Stage stage) {
    WebView webview = new WebView();
    webview.getEngine().load(
      Cerulean.class.getResource("/res/html/index.html").toExternalForm()            
    );
    stage.setScene(new Scene(webview));
    stage.setTitle("Cerulean");
    stage.show();
  }
  
}
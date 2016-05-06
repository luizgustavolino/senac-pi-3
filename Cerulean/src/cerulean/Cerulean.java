package cerulean;

import java.net.URL;
import javafx.application.Application;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.concurrent.Worker.State;
import javafx.scene.Scene;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import netscape.javascript.JSObject;

public class Cerulean extends Application {
  
   public static void main(String[] args) {
      launch(args);
  }
  
  @Override public void start(Stage stage) {
    
    WebView webview = new WebView();
    final WebEngine engine = webview.getEngine();
    
    // from http://docs.oracle.com/javase/6/docs/api/java/security/CodeSource.html#getLocation%28%29
    // May 4, 2016
    URL base = Cerulean.class.getProtectionDomain().getCodeSource().getLocation();
    System.out.println("Hello, I'm Cerulean! Running at " + base);
    
    engine.getLoadWorker().exceptionProperty().addListener(new ChangeListener<Throwable>() {
        @Override
        public void changed(ObservableValue<? extends Throwable> arg0,
            Throwable arg1, Throwable arg2) {
                System.out.println("failingtask exception property " + arg1 + " to " + arg2);
            }
        }
    );
    
    engine.getLoadWorker().stateProperty().addListener( new ChangeListener(){
        @Override
        public void changed(ObservableValue observable, Object oldState, Object newState) {
            if(newState == State.SUCCEEDED){
                // from https://blogs.oracle.com/javafx/entry/communicating_between_javascript_and_javafx
                // May 4, 2016
                JSObject jsobj = (JSObject) engine.executeScript("window");
                jsobj.setMember("java", new ScriptingBridge());
                engine.executeScript("loadAllResources()");
            }
        }
     });
    
    engine.load(
      Cerulean.class.getResource("/res/html/index.html").toExternalForm()            
    );
    
    stage.setScene(new Scene(webview));
    stage.setTitle("Cerulean");
    stage.show();
    
  }
}
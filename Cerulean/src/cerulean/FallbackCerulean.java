
package cerulean;

import java.net.URL;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.concurrent.Worker.State;
import javafx.scene.layout.StackPane;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import netscape.javascript.JSObject;

public class FallbackCerulean {
    
    public static void installOnPanel(StackPane pane){
        
        WebView webview = new WebView();
        final WebEngine engine = webview.getEngine();
    
        // from http://docs.oracle.com/javase/6/docs/api/java/security/CodeSource.html#getLocation%28%29
        // May 4, 2016
        URL base = Cerulean.class.getProtectionDomain().getCodeSource().getLocation();
        System.out.println("Hello, I'm Cerulean! Running javafx webview at " + base);
    
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
    
        if(pane.getChildren().add(webview)){
            engine.load(
                Cerulean.class.getResource("/res/html/index.html").toExternalForm()            
            );
        }
    }
}

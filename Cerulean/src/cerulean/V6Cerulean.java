
package cerulean;

import com.teamdev.jxbrowser.chromium.*;
import com.teamdev.jxbrowser.chromium.events.ConsoleEvent;
import com.teamdev.jxbrowser.chromium.events.ConsoleListener;
import com.teamdev.jxbrowser.chromium.events.FailLoadingEvent;
import com.teamdev.jxbrowser.chromium.events.FinishLoadingEvent;
import com.teamdev.jxbrowser.chromium.events.FrameLoadEvent;
import com.teamdev.jxbrowser.chromium.events.LoadAdapter;
import com.teamdev.jxbrowser.chromium.events.LoadEvent;
import com.teamdev.jxbrowser.chromium.events.NetError;
import com.teamdev.jxbrowser.chromium.events.ProvisionalLoadingEvent;
import com.teamdev.jxbrowser.chromium.events.ScriptContextAdapter;
import com.teamdev.jxbrowser.chromium.events.ScriptContextEvent;
import com.teamdev.jxbrowser.chromium.events.StartLoadingEvent;
import com.teamdev.jxbrowser.chromium.javafx.*;
import java.io.InputStream;
import javafx.scene.layout.StackPane;

public class V6Cerulean {
    
    public static void installOnPanel(StackPane pane){
        
        final Browser browser = new Browser();
        BrowserView browserView = new BrowserView(browser);
        
        browser.addScriptContextListener(new ScriptContextAdapter() {
            @Override
            public void onScriptContextCreated(ScriptContextEvent event) {
                Browser browser = event.getBrowser();
                JSValue window = browser.executeJavaScriptAndReturnValue("window");
                window.asObject().setProperty("java", new ScriptingBridge());
            }
        });
        
        browser.addConsoleListener(new ConsoleListener() {
            @Override
            public void onMessage(ConsoleEvent event) {
                System.out.println("Console.log: " + event.getMessage());
            }
        });
        
        browser.addLoadListener(new LoadAdapter() {
            @Override
            public void onFinishLoadingFrame(FinishLoadingEvent event) {
                if (event.isMainFrame()) {
                    System.out.println("Main frame has finished loading");
                    browser.executeJavaScript("loadAllResources()");
                }
            }
        });
        
        if(pane.getChildren().add(browserView)){
            InputStream inputStream = Cerulean.class.getResourceAsStream("/res/html/index.html");
            browser.loadHTML(convertStreamToString(inputStream));
        }
    }
    
    static String convertStreamToString(java.io.InputStream is) {
        java.util.Scanner s = new java.util.Scanner(is).useDelimiter("\\A");
        return s.hasNext() ? s.next() : "";
    }
}

package cerulean;

import java.net.URL;

public class ScriptingBridge {
    public String getJARPath(){
        URL base = Cerulean.class.getProtectionDomain().getCodeSource().getLocation();
        return base.toString();
    }
    
    public void log(String message){
        System.out.println("[Cerulean] " + message);
    }
            
}

package cerulean;

import java.net.URL;

public class ScriptingBridge {
    
    public String getJARPath(String filename){
        URL base = Cerulean.class.getProtectionDomain().getCodeSource().getLocation();
        String path = "jar:" + base.toString() + "!/res/html/" + filename;
        return path;
    }
    
    public void log(String message){
        System.out.println("[Cerulean] " + message);
    }
    
    public Boolean isNative(){
        return true;
    }
            
}

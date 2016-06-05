
// ----[ JS Extensions ] ---

if (!Element.prototype.remove){
	Element.prototype.remove = function() {
	    this.parentElement.removeChild(this);
	}
}

if (!NodeList.prototype.remove){
	NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
	    for(var i = this.length - 1; i >= 0; i--) {
	        if(this[i] && this[i].parentElement) {
	            this[i].parentElement.removeChild(this[i]);
	        }
	    }
	};
}

if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

// FROM: http://stackoverflow.com/questions/3954438/remove-item-from-array-by-value
if (!Array.prototype.remove){
	Array.prototype.remove = function() {
	    var what, a = arguments, L = a.length, ax;
	    while (L && this.length) {
	        what = a[--L];
	        while ((ax = this.indexOf(what)) !== -1) {
	            this.splice(ax, 1);
	        }
	    }
	    return this;
	};
}






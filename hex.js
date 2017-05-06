function HexMap(id,w,h,s,file){

	this.w = w;
	this.h = h;
	this.aspectratio = w/h;
	this.id = id;
	this.saveable = (typeof Blob==="function");
	this.hexes = {};

	var points,eye,patterns;
	var path = "";
	var colour = "#efefef";
	this.min = 0;
	this.max = 1;
	
	this.mapping = {};
	this.properties = { 'size': (typeof s==="number" ? s : 10) };

	S(document).ajax(file,{
		'complete': function(data){
			this.setMapping(data);
			this.initialized();
		},
		'error': this.failLoad,
		'this': this,
		'dataType':'json'
	});


	var _obj = this;
	// We'll need to change the sizes when the window changes size
	window.addEventListener('resize', function(event){ _obj.resize(); });

	this.toggleRegion = function(r){
		for(nut in this.hexes){
			if(nut.indexOf(r)==0){
				h = this.hexes[nut];
				h.selected = !h.selected;
				h.attr({'fill':(h.selected ? h.fillcolour : '#5f5f5f')});
			}
		}
		return this;
	}

	this.size = function(w,h){
		S('#'+this.id).css({'height':'','width':''});
		w = Math.min(this.w,S('#'+this.id)[0].offsetWidth);
		S('#'+this.id).css({'height':(w/this.aspectratio)+'px','width':w+'px'});
		this.paper = new SVG(this.id);
		w = this.paper.w;
		h = this.paper.h;

		this.transform = {'type':'scale','props':{x:w,y:h,cx:w,cy:h,r:w,'stroke-width':w}};
		
		return this;
	}
	this.resize = function(){
		return this;
/*		this.size();
		this.paper.clear();
		this.draw();
		return this;*/
	}

	this.initialized = function(){ this.create().draw(); }
	this.create = function(){
		this.paper.clear();
		return this;
	}

	this.save = function(){

		var textFileAsBlob = new Blob([this.svg], {type:'text/application/svg+xml'});
		var fileNameToSaveAs = "fish.svg";
	
		function destroyClickedElement(event){ document.body.removeChild(event.target); }
		var dl = document.createElement("a");
		dl.download = fileNameToSaveAs;
		dl.innerHTML = "Download File";
		if(window.webkitURL != null){
			// Chrome allows the link to be clicked
			// without actually adding it to the DOM.
			dl.href = window.webkitURL.createObjectURL(textFileAsBlob);
		}else{
			// Firefox requires the link to be added to the DOM
			// before it can be clicked.
			dl.href = window.URL.createObjectURL(textFileAsBlob);
			dl.onclick = destroyClickedElement;
			dl.style.display = "none";
			document.body.appendChild(dl);
		}
		dl.click();
		return this;
	}

	this.label = function(id,l){
		if(S('.infobubble').length == 0) S('#'+id+'').after('<div class="infobubble"><div class="infobubble_inner"></div></div>');
		S('.infobubble_inner').html(l);
		return this;
	}

	this.autoscale = function(){
		var min = 1e100;
		var max = -1e100;
		for(var region in this.mapping.hexes){
			if(typeof this.mapping.hexes[region].value==="number"){
				if(this.mapping.hexes[region].value < min) min = this.mapping.hexes[region].value;
				if(this.mapping.hexes[region].value > max) max = this.mapping.hexes[region].value;
			}
		}
		this.min = min;
		this.max = max;
		return this;
	}	
	this.update = function(){
		var b = new Colour(colour);
		var a = new Colour('#cccccc');

		function getColour(pc){ return 'rgb('+parseInt(a.rgb[0] + (b.rgb[0]-a.rgb[0])*pc)+','+parseInt(a.rgb[1] + (b.rgb[1]-a.rgb[1])*pc)+','+parseInt(a.rgb[2] + (b.rgb[2]-a.rgb[2])*pc)+')'; }
		
		var range = this.max-this.min;
		for(var region in this.mapping.hexes){
			this.hexes[region].fillcolour = (typeof this.mapping.hexes[region].value==="number") ? getColour((this.mapping.hexes[region].value-this.min)/range) : '#5f5f5f';
			this.hexes[region].attr({'fill':(this.hexes.hexes[region].selected ? this.hexes[region].fillcolour : '#5f5f5f')});
		}
		return this;
	}
	
	this.loadGVA = function(y){
		var min = 2004;
		var max = 2015;
		if(!y) y = min;
		if(y < min) y = min;
		if(y > max) y = max;
		if(!this.gva){
			S(document).ajax('gva.json',{
				'complete': function(data){
					this.gva = data;
					this.loadGVA(y);
				},
				'error': this.failLoad,
				'this': this,
				'dataType':'json'
			});
		}else{
			for(var region in this.mapping.hexes){
				if(this.gva[region]) this.mapping.hexes[region].value = this.gva[region][y-min];
				else this.mapping.hexes[region].value = undefined;
				this.mapping.hexes[region].label = 'GVA per hour worked for <strong>'+this.mapping.hexes[region].n+'</strong> in '+y+': '+(this.mapping.hexes[region].value ? '&pound;'+Math.round(this.mapping.hexes[region].value) : 'not recorded');
			}
			this.max = 200;
			this.min = 60;
			//this.autoscale();
			this.update();
		}
		return this;
	}
	
	this.setMapping = function(mapping){
		this.mapping = mapping;
		if(!this.properties) this.properties = { "x": 100, "y": 100 };
		this.properties.x = this.w/2;
		this.properties.y = this.h/2;
		this.setSize();
		var p = mapping.layout.split("-");
		this.properties.shift = p[0];
		this.properties.orientation = p[1];

		return this;
	}
	this.setSize = function(size){
		if(size) this.properties.size = size;
		this.properties.s = { 'cos': this.properties.size*Math.sqrt(3)/2, 'sin': this.properties.size*0.5 };
		this.properties.s.c = this.properties.s.cos.toFixed(2);
		this.properties.s.s = this.properties.s.sin.toFixed(2);
		return this;
	}
	this.drawHex = function(q,r,scale){
		if(this.properties){
			if(typeof scale!=="number") scale = 1;
			scale = Math.sqrt(scale);

			var x = this.properties.x + (q * this.properties.s.cos * 2);
			var y = this.properties.y - (r * this.properties.s.sin * 3);

			if(this.properties.orientation == "r"){
				if(this.properties.shift=="odd" && r&1==1) x += this.properties.s.cos;
				if(this.properties.shift=="even" && r&1==0) x += this.properties.s.cos;
			}
			if(this.properties.orientation == "q"){
				if(this.properties.shift=="odd" && q&1==1) y += this.properties.s.cos;
				if(this.properties.shift=="even" && q&1==0) y += this.properties.s.cos;
			}
			
			var path = [['M',[x,y]]];
			var cs = this.properties.s.c * scale;
			var ss = this.properties.s.s * scale;
			if(this.properties.orientation == "r"){
				// Pointy topped
				path.push(['m',[cs,-ss]]);
				path.push(['l',[-cs,-ss,-cs,ss,0,(this.properties.size*scale).toFixed(2),cs,ss,cs,-ss]]);
				path.push(['z',[]]);
			}else{
				// Flat topped
				path.push(['m',[-ss,cs]]);
				path.push(['l',[-ss,-cs,ss,cs,(this.properties.size*scale).toFixed(2),0,ss,cs,-ss,cs]]);
				path.push(['z',[]]);
			}
			return { 'path':path, 'x':x, 'y': y };
		}
		return this;
	}
	
	this.draw = function(){

		var b = new Colour('#F9BC26');
		var a = new Colour('#722EA5');

		function getColour(pc){
			return 'rgb('+parseInt(a.rgb[0] + (b.rgb[0]-a.rgb[0])*pc)+','+parseInt(a.rgb[1] + (b.rgb[1]-a.rgb[1])*pc)+','+parseInt(a.rgb[2] + (b.rgb[2]-a.rgb[2])*pc)+')';
		}
		function getRegionColour(r){
			if(r == "YH") return "#F9BC26";
			if(r == "EM") return "#00B6FF";
			if(r == "WM") return "#E6007C";
			if(r == "EA") return "#FF6700";
			if(r == "SC") return "#2254F4";
			if(r == "NI") return "#722EA5";
			if(r == "WA") return "#0DBC37";
			if(r == "NW") return "#1DD3A7";
			if(r == "NE") return "#D60303";
			if(r == "SW") return "#178CFF";
			if(r == "LO") return "#D73058";
			if(r == "SE") return "#67E767";
			
			return "#efefef";
		}

		var r,q;
		var fs = this.properties.size*0.4;
				
		var range = { 'r': {'min':1e9,'max':-1e9}, 'q': {'min':1e9,'max':-1e9} };
		for(region in this.mapping.hexes){
			q = this.mapping.hexes[region].q;
			r = this.mapping.hexes[region].r;
			if(q > range.q.max) range.q.max = q;
			if(q < range.q.min) range.q.min = q;
			if(r > range.r.max) range.r.max = r;
			if(r < range.r.min) range.r.min = r;
		}
		this.properties.x = (this.w)*(0-range.q.min)/(range.q.max-range.q.min); 
		this.properties.y = (this.h)*(1-(0-range.r.min)/(range.r.max-range.r.min)); 

		var h,p;
		
		for(q = range.q.min; q <= range.q.max; q++){
			for(r = range.r.min; r <= range.r.max; r++){
				h = this.drawHex(q,r);
				p = this.paper.path(h.path).attr({'fill':'transparent','stroke':'#aaa'});
				this.paper.text(h.x,h.y+fs/2,q+"\n"+r).attr({'text-anchor':'middle','font-size':fs+'px','fill':'#777'});

			}
		}


		var min = 50000;
		var max = 80000;
		/*
		for(region in this.mapping.hexes){
			if(this.mapping.hexes[region].p > max) max = this.mapping.hexes[region].p;
			if(this.mapping.hexes[region].p < min) min = this.mapping.hexes[region].p;
		}*/

		for(region in this.mapping.hexes){
			
			this.mapping.hexes[region].value = (this.mapping.hexes[region].p - min)/(max-min);
			if(this.mapping.hexes[region].value < 0) this.mapping.hexes[region].value = 0;
			if(this.mapping.hexes[region].value > 1) this.mapping.hexes[region].value = 1;

			var h = this.drawHex(this.mapping.hexes[region].q,this.mapping.hexes[region].r);//,this.mapping.hexes[region].value*0.5 + 0.5);
			
			if(!this.constructed){
				this.hexes[region] = this.paper.path(h.path);
				if(!this.labels) this.labels = {};
				this.labels[region] = this.paper.text(h.x,h.y+fs/2,this.mapping.hexes[region].n.substr(0,3)).attr({'text-anchor':'middle','font-size':fs+'px','title':this.mapping.hexes[region].n});
				//console.log(this.hexes[region])
				this.hexes[region].selected = true;

				// Attach events
				var _obj = this.hexes[region];
				_obj.id = 'hex-'+region;
				_obj.on('mouseover',{hexmap:this,me:_obj,region:region,pop:this.mapping.hexes[region].p},function(e){
					e.data.hexmap.label(e.data.hexmap.id,(e.data.hexmap.mapping.hexes[e.data.region].label ? e.data.hexmap.mapping.hexes[e.data.region].label : this.attr('title')+'<br />Population: '+e.data.pop));
					e.data.me.attr({'fill':(e.data.me.selected ? colour : '#000000')});
				}).on('mouseout',{hexmap:this,me:_obj},function(e){
					S('.infobubble').remove();
					e.data.me.attr({'fill':(e.data.me.selected ? e.data.me.fillcolour : '#5f5f5f')});
				}).on('click',{hexmap:this,region:region,me:_obj},function(e){
					e.data.hexmap.toggleRegion(e.data.region)
					e.data.hexmap.label(e.data.hexmap.id,this.attr('title'));
					e.data.me.attr({'fill':(e.data.me.selected ? colour : '#000000')});
				});
			}
			this.hexes[region].fillcolour = getRegionColour(this.mapping.hexes[region].a);
			//this.hexes[region].fillcolour = getColour(this.mapping.hexes[region].value);
			this.hexes[region].attr({'fill':(this.hexes[region].selected ? this.hexes[region].fillcolour : '#5f5f5f'),'stroke':'#ffffff','title':this.mapping.hexes[region].n,'data-regions':region,'style':'cursor: pointer;'});
			this.hexes[region].update();
		}
		
		if(!this.constructed) this.paper.draw();

		this.constructed = true;

		return this;
	}
	function niceSize(b){
		if(b > 1e12) return (b/1e12).toFixed(2)+" TB";
		if(b > 1e9) return (b/1e9).toFixed(2)+" GB";
		if(b > 1e6) return (b/1e6).toFixed(2)+" MB";
		if(b > 1e3) return (b/1e3).toFixed(2)+" kB";
		return (b)+" bytes";
	}
	
	
	this.size();

	return this;
}


// Define colour routines
function Colour(c,n){
	if(!c) return {};

	function d2h(d) { return ((d < 16) ? "0" : "")+d.toString(16);}
	function h2d(h) {return parseInt(h,16);}
	/**
	 * Converts an RGB color value to HSV. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
	 * Assumes r, g, and b are contained in the set [0, 255] and
	 * returns h, s, and v in the set [0, 1].
	 *
	 * @param   Number  r       The red color value
	 * @param   Number  g       The green color value
	 * @param   Number  b       The blue color value
	 * @return  Array           The HSV representation
	 */
	function rgb2hsv(r, g, b){
		r = r/255, g = g/255, b = b/255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, v = max;
		var d = max - min;
		s = max == 0 ? 0 : d / max;
		if(max == min) h = 0; // achromatic
		else{
			switch(max){
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}
		return [h, s, v];
	}

	this.alpha = 1;

	// Let's deal with a variety of input
	if(c.indexOf('#')==0){
		this.hex = c;
		this.rgb = [h2d(c.substring(1,3)),h2d(c.substring(3,5)),h2d(c.substring(5,7))];
	}else if(c.indexOf('rgb')==0){
		var bits = c.match(/[0-9\.]+/g);
		if(bits.length == 4) this.alpha = parseFloat(bits[3]);
		this.rgb = [parseInt(bits[0]),parseInt(bits[1]),parseInt(bits[2])];
		this.hex = "#"+d2h(this.rgb[0])+d2h(this.rgb[1])+d2h(this.rgb[2]);
	}else return {};
	this.hsv = rgb2hsv(this.rgb[0],this.rgb[1],this.rgb[2]);
	this.name = (n || "Name");
	var r,sat;
	for(r = 0, sat = 0; r < this.rgb.length ; r++){
		if(this.rgb[r] > 200) sat++;
	}
	this.text = (this.rgb[0] + this.rgb[1] + this.rgb[2] > 500 || sat > 1) ? "black" : "white";
	return this;
}

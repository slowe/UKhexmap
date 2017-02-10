var hex;
S(document).ready(function(){

	hex = new HexMap('hexmap',300,504);
	
	// Create an initial hexmap
	hex.update();
	
	S('button').on('click',function(e){ hex.toggleRegion(S(e.currentTarget).attr('region')); });
});


function HexMap(id,w,h){
	
	this.w = w;
	this.h = h;
	this.aspectratio = w/h;
	this.id = id;
	this.saveable = (typeof Blob==="function");
	this.hexes = {};

	var points,eye,patterns;
	var path = "";
	var colour = "#FF6700";
	this.nuts = {
		"UKC11": { "n": "Hartlepool and Stockton-on-Tees",  "r": 15, "c": 7 },
		"UKC12": { "n": "South Teesside", "r": 15, "c": 8 },
		"UKC13": { "n": "Darlington", "r": 16, "c": 6 },
		"UKC14": { "n": "Durham CC", "r": 16, "c": 5 },
		"UKD36": { "n": "Greater Manchester North West", "r": 13, "c": 5 },
		"UKD37": { "n": "Greater Manchester North East", "r": 13, "c": 6 },
		"UKC21": { "n": "Northumberland", "r": 17, "c": 6 },
		"UKC22": { "n": "Tyneside", "r": 17, "c": 7 },
		"UKC23": { "n": "Sunderland", "r": 16, "c": 7 },
		"UKH21": { "n": "Luton", "r": 8, "c": 9 },
		"UKD11": { "n": "West Cumbria", "r": 16, "c": 4 },
		"UKD41": { "n": "Blackburn with Darwen", "r": 14, "c": 5 },
		"UKD42": { "n": "Blackpool", "r": 15, "c": 5 },
		"UKD47": { "n": "Chorley and West Lancashire", "r": 13, "c": 4 },
		"UKD61": { "n": "Warrington", "r": 12, "c": 4 },
		"UKD12": { "n": "East Cumbria", "r": 17, "c": 5 },
		"UKD33": { "n": "Manchester", "r": 12, "c": 5 },
		"UKD34": { "n": "Greater Manchester South West", "r": 11, "c": 5 },
		"UKD35": { "n": "Greater Manchester South East", "r": 11, "c": 6 },
		"UKD44": { "n": "Lancaster and Wyre", "r": 15, "c": 6 },
		"UKD45": { "n": "Mid Lancashire", "r": 14, "c": 4 },
		"UKD46": { "n": "East Lancashire", "r": 14, "c": 6 },
		"UKD74": { "n": "Wirral", "r": 11, "c": 3 },
		"UKD62": { "n": "Cheshire East", "r": 10, "c": 4 },
		"UKD63": { "n": "Cheshire West and Chester", "r": 10, "c": 3 },
		"UKD71": { "n": "East Merseyside", "r": 11, "c": 4 },
		"UKD72": { "n": "Liverpool", "r": 12, "c": 3 },
		"UKD73": { "n": "Sefton", "r": 13, "c": 3 },
		"UKE11": { "n": "Kingston upon Hull, City of",  "r": 13, "c": 9 },
		"UKE12": { "n": "East Riding of Yorkshire", "r": 14, "c": 9 },
		"UKE13": { "n": "North and North East Lincolnshire", "r": 12, "c": 9 },
		"UKE21": { "n": "York", "r": 14, "c": 8 },
		"UKE32": { "n": "Sheffield", "r": 11, "c": 7 },
		"UKI34": { "n": "Wandsworth", "r": 3, "c": 9 },
		"UKE22": { "n": "North Yorkshire CC", "r": 14, "c": 7 },
		"UKE31": { "n": "Barnsley, Doncaster and Rotherham", "r": 12, "c": 8 },
		"UKE41": { "n": "Bradford", "r": 13, "c": 7 },
		"UKE42": { "n": "Leeds", "r": 13, "c": 8 },
		"UKE44": { "n": "Calderdale and Kirklees", "r": 12, "c": 6 },
		"UKE45": { "n": "Wakefield", "r": 12, "c": 7 },
		"UKF11": { "n": "Derby", "r": 10, "c": 7 },
		"UKF12": { "n": "East Derbyshire", "r": 11, "c": 8 },
		"UKF25": { "n": "North Northamptonshire",  "r": 9, "c": 8 },
		"UKF13": { "n": "South and West Derbyshire", "r": 10, "c": 6 },
		"UKF14": { "n": "Nottingham", "r": 11, "c": 9 },
		"UKF15": { "n": "North Nottinghamshire",  "r": 11, "c": 10 },
		"UKG38": { "n": "Walsall", "r": 8, "c": 6 },
		"UKG39": { "n": "Wolverhampton", "r": 8, "c": 3 },
		"UKF16": { "n": "South Nottinghamshire",  "r": 10, "c": 9 },
		"UKF21": { "n": "Leicester", "r": 9, "c": 7 },
		"UKF22": { "n": "Leicestershire CC and Rutland", "r": 10, "c": 8 },
		"UKF24": { "n": "West Northamptonshire",  "r": 8, "c": 7 },
		"UKH11": { "n": "Peterborough", "r": 9, "c": 10 },
		"UKF30": { "n": "Lincolnshire", "r": 10, "c": 10 },
		"UKG11": { "n": "Herefordshire, County of", "r": 7, "c": 4 },
		"UKI41": { "n": "Hackney and Newham", "r": 6, "c": 10 },
		"UKG12": { "n": "Worcestershire", "r": 6, "c": 4 },
		"UKG13": { "n": "Warwickshire", "r": 6, "c": 5 },
		"UKG21": { "n": "Telford and Wrekin", "r": 9, "c": 4 },
		"UKI42": { "n": "Tower Hamlets", "r": 5, "c": 10 },
		"UKI43": { "n": "Haringey and Islington", "r": 7, "c": 10 },
		"UKG22": { "n": "Shropshire CC", "r": 7, "c": 3 },
		"UKG23": { "n": "Stoke-on-Trent", "r": 10, "c": 5 },
		"UKH12": { "n": "Cambridgeshire CC", "r": 9, "c": 11 },
		"UKG24": { "n": "Staffordshire CC", "r": 9, "c": 5 },
		"UKG31": { "n": "Birmingham", "r": 7, "c": 5 },
		"UKG32": { "n": "Solihull", "r": 7, "c": 6 },
		"UKG33": { "n": "Coventry", "r": 9, "c": 6 },
		"UKG36": { "n": "Dudley", "r": 8, "c": 4 },
		"UKG37": { "n": "Sandwell", "r": 8, "c": 5 },
		"UKH14": { "n": "Suffolk", "r": 8, "c": 12 },
		"UKH15": { "n": "Norwich and East Norfolk", "r": 9, "c": 12 },
		"UKH16": { "n": "North and West Norfolk", "r": 10, "c": 11 },
		"UKH17": { "n": "Breckland and South Norfolk", "r": 8, "c": 11 },
		"UKH23": { "n": "Hertfordshire", "r": 8, "c": 10 },
		"UKH24": { "n": "Bedford", "r": 9, "c": 9 },
		"UKH25": { "n": "Central Bedfordshire", "r": 8, "c": 8 },
		"UKH31": { "n": "Southend-on-Sea", "r": 5, "c": 13 },
		"UKH32": { "n": "Thurrock", "r": 5, "c": 12 },
		"UKI44": { "n": "Lewisham and Southwark", "r": 4, "c": 10 },
		"UKI45": { "n": "Lambeth", "r": 4, "c": 9 },
		"UKH34": { "n": "Essex Haven Gateway", "r": 7, "c": 13 },
		"UKH35": { "n": "West Essex", "r": 7, "c": 12 },
		"UKI51": { "n": "Bexley and Greenwich", "r": 5, "c": 11 },
		"UKI52": { "n": "Barking & Dagenham and Havering", "r": 6, "c": 11 },
		"UKH36": { "n": "Heart of Essex", "r": 6, "c": 13 },
		"UKH37": { "n": "Essex Thames Gateway", "r": 6, "c": 12 },
		"UKI31": { "n": "Camden and City of London", "r": 6, "c": 9 },
		"UKI32": { "n": "Westminster", "r": 5, "c": 9 },
		"UKI33": { "n": "Kensington & Chelsea and Hammersmith & Fulham",  "r": 4, "c": 8 },
		"UKI53": { "n": "Redbridge and Waltham Forest", "r": 7, "c": 11 },
		"UKI54": { "n": "Enfield", "r": 7, "c": 9 },
		"UKI61": { "n": "Bromley", "r": 4, "c": 11 },
		"UKI62": { "n": "Croydon", "r": 3, "c": 11 },
		"UKI63": { "n": "Merton, Kingston upon Thames and Sutton", "r": 3, "c": 10 },
		"UKI71": { "n": "Barnet", "r": 7, "c": 8 },
		"UKI72": { "n": "Brent", "r": 6, "c": 8 },
		"UKI73": { "n": "Ealing", "r": 5, "c": 8 },
		"UKI74": { "n": "Harrow and Hillingdon", "r": 6, "c": 7 },
		"UKI75": { "n": "Hounslow and Richmond upon Thames", "r": 4, "c": 7 },
		"UKJ11": { "n": "Berkshire", "r": 5, "c": 7 },
		"UKJ12": { "n": "Milton Keynes", "r": 7, "c": 7 },
		"UKJ13": { "n": "Buckinghamshire CC", "r": 6, "c": 6 },
		"UKJ26": { "n": "East Surrey", "r": 2, "c": 9 },
		"UKJ14": { "n": "Oxfordshire", "r": 5, "c": 6 },
		"UKJ21": { "n": "Brighton and Hove", "r": 1, "c": 9 },
		"UKJ22": { "n": "East Sussex CC", "r": 1, "c": 10 },
		"UKJ25": { "n": "West Surrey", "r": 3, "c": 8 },
		"UKK41": { "n": "Plymouth", "r": 1, "c": 3 },
		"UKJ27": { "n": "West Sussex (South West)", "r": 1, "c": 8 },
		"UKJ28": { "n": "West Sussex (North East)", "r": 2, "c": 8 },
		"UKJ31": { "n": "Portsmouth", "r": 2, "c": 7 },
		"UKJ32": { "n": "Southampton", "r": 3, "c": 6 },
		"UKJ34": { "n": "Isle of Wight", "r": 0, "c": 5 },
		"UKJ35": { "n": "South Hampshire", "r": 2, "c": 6 },
		"UKJ36": { "n": "Central Hampshire", "r": 3, "c": 7 },
		"UKJ37": { "n": "North Hampshire", "r": 4, "c": 6 },
		"UKJ41": { "n": "Medway", "r": 3, "c": 13 },
		"UKJ43": { "n": "Kent Thames Gateway", "r": 3, "c": 12 },
		"UKJ44": { "n": "East Kent", "r": 2, "c": 12 },
		"UKJ45": { "n": "Mid Kent", "r": 2, "c": 11 },
		"UKJ46": { "n": "West Kent", "r": 2, "c": 10 },
		"UKK11": { "n": "Bristol, City of", "r": 4, "c": 3 },
		"UKK12": { "n": "Bath and North East Somerset, North Somerset and South Gloucestershire",  "r": 4, "c": 4 },
		"UKK42": { "n": "Torbay", "r": 2, "c": 4 },
		"UKK13": { "n": "Gloucestershire", "r": 5, "c": 4 },
		"UKK14": { "n": "Swindon", "r": 5, "c": 5 },
		"UKK15": { "n": "Wiltshire", "r": 4, "c": 5 },
		"UKK21": { "n": "Bournemouth and Poole", "r": 3, "c": 5 },
		"UKK22": { "n": "Dorset CC", "r": 3, "c": 4 },
		"UKK23": { "n": "Somerset", "r": 2, "c": 3 },
		"UKK30": { "n": "Cornwall and Isles of Scilly", "r": 1, "c": 2 },
		"UKK43": { "n": "Devon CC", "r": 2, "c": 2 },
		"UKL11": { "n": "Isle of Anglesey", "r": 10, "c": 1 },
		"UKL12": { "n": "Gwynedd", "r": 9, "c": 2 },
		"UKL13": { "n": "Conwy and Denbighshire", "r": 8, "c": 2 },
		"UKL14": { "n": "South West Wales", "r": 5, "c": 1 },
		"UKL15": { "n": "Central Valleys", "r": 7, "c": 2 },
		"UKL16": { "n": "Gwent Valleys", "r": 6, "c": 2 },
		"UKL17": { "n": "Bridgend and Neath Port Talbot", "r": 6, "c": 1 },
		"UKL18": { "n": "Swansea", "r": 5, "c": 2 },
		"UKL21": { "n": "Monmouthshire and Newport",  "r": 6, "c": 3 },
		"UKL22": { "n": "Cardiff and Vale of Glamorgan", "r": 5, "c": 3 },
		"UKL23": { "n": "Flintshire and Wrexham", "r": 9, "c": 3 },
		"UKL24": { "n": "Powys", "r": 8, "c": 1 },
		"UKM21": { "n": "Angus and Dundee", "r": 22, "c": 5 },
		"UKM22": { "n": "Clackmannanshire and Fife",  "r": 21, "c": 6 },
		"UKM23": { "n": "East Lothian and Midlothian", "r": 19, "c": 6 },
		"UKM24": { "n": "Scottish Borders", "r": 18, "c": 5 },
		"UKM25": { "n": "Edinburgh", "r": 20, "c": 5 },
		"UKM26": { "n": "Falkirk", "r": 21, "c": 5 },
		"UKM27": { "n": "Perth and Kinross, and Stirling", "r": 22, "c": 4 },
		"UKM28": { "n": "West Lothian", "r": 19, "c": 5 },
		"UKM31": { "n": "East Dunbartonshire, West Dunbartonshire, and Helensburgh and Lomond",  "r": 21, "c": 4 },
		"UKM32": { "n": "Dumfries and Galloway", "r": 17, "c": 4 },
		"UKM33": { "n": "East and North Ayrshire mainland", "r": 19, "c": 3 },
		"UKM34": { "n": "Glasgow", "r": 19, "c": 4 },
		"UKM35": { "n": "Inverclyde, East Renfrewshire, and Renfrewshire", "r": 20, "c": 3 },
		"UKM36": { "n": "North Lanarkshire", "r": 20, "c": 4 },
		"UKM37": { "n": "South Ayrshire", "r": 18, "c": 3 },
		"UKM38": { "n": "South Lanarkshire", "r": 18, "c": 4 },
		"UKM50": { "n": "Aberdeen and Aberdeenshire", "r": 23, "c": 6 },
		"UKM61": { "n": "Caithness and Sutherland, and Ross and Cromarty", "r": 24, "c": 4 },
		"UKM62": { "n": "Inverness, Nairn, Moray, and Badenoch and Strathspey",  "r": 23, "c": 5 },
		"UKM63": { "n": "Lochaber, Skye and Lochalsh, Arran and Cumbrae, and Argyll and Bute",  "r": 22, "c": 3 },
		"UKM64": { "n": "Eilean Siar (Western Isles)", "r": 23, "c": 4 },
		"UKM65": { "n": "Orkney Islands", "r": 25, "c": 6 },
		"UKM66": { "n": "Shetland Islands", "r": 27, "c": 7 },
		"UKN01": { "n": "Belfast", "r": 17, "c": 1 },
		"UKN02": { "n": "Outer Belfast", "r": 16, "c": 1 },
		"UKN03": { "n": "East of Northern Ireland", "r": 16, "c": 0 },
		"UKN04": { "n": "North of Northern Ireland", "r": 18, "c": 0 },
		"UKN05": { "n": "West and South of Northern Ireland", "r": 17, "c": 0 }
	}

	function random(lo,hi){
		return Math.random()*(hi-lo)+lo;
	}
		

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

	this.size = function(){
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

	this.update = function(){ this.create().draw(); }
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
	
	this.draw = function(){

		var b = new Colour(colour);
		var a = new Colour('#cccccc');

		function drawHex(x,y,s){

			var path = [['M',[x,y]]];
			var cs = (s*Math.sqrt(3)/2).toFixed(2);	// cos(30)
			var ss = (s*0.5).toFixed(2);
			path.push(['m',[cs,-ss]]);
			path.push(['l',[-cs,-ss,-cs,ss,0,s.toFixed(2),cs,ss,cs,-ss]]);
			path.push(['z',[]]);
			return path;
		}

		function getColour(pc){
			return 'rgb('+parseInt(a.rgb[0] + (b.rgb[0]-a.rgb[0])*pc)+','+parseInt(a.rgb[1] + (b.rgb[1]-a.rgb[1])*pc)+','+parseInt(a.rgb[2] + (b.rgb[2]-a.rgb[2])*pc)+')';
		}

		var ncol = 12.1;
		var r = 0;
		var c = -1;
		var s = (this.w/(ncol*1.05))/2;
		var dx = (s*Math.sqrt(3));
	
		for(nut in this.nuts){
			c++;
			if(c > ncol){
				r++;
				c = 0;
			}
			c = this.nuts[nut].c;
			r = this.nuts[nut].r;

			var y = (this.h - (s + 1.5*s*r)).toFixed(1);
			var x = ((s + dx*c) + dx/2 - (r%2)*dx/2).toFixed(1);

			var h = drawHex(x,y,s);
			if(!this.nuts[nut].value) this.nuts[nut].value = Math.min(1,0.5*(Math.abs(r-12)/10) + 0.5*(random(0,c)/10));

			if(!this.constructed){
				this.hexes[nut] = this.paper.path(h);
				this.hexes[nut].selected = true;

				// Attach events
				var _obj = this.hexes[nut];
				_obj.id = 'hex-'+nut;
				_obj.on('mouseover',{hexmap:this,me:_obj,nut:nut,x:parseFloat(x),y:parseFloat(y)},function(e){
					e.data.hexmap.label(e.data.hexmap.id,this.attr('title'));
					e.data.me.attr({'fill':(e.data.me.selected ? colour : '#000000')});
				}).on('mouseout',{hexmap:this,me:_obj},function(e){
					S('.infobubble').remove();
					e.data.me.attr({'fill':(e.data.me.selected ? e.data.me.fillcolour : '#5f5f5f')});
				}).on('click',{hexmap:this,nut:nut,me:_obj},function(e){
					e.data.hexmap.toggleRegion(e.data.nut)
					e.data.hexmap.label(e.data.hexmap.id,this.attr('title'));
					e.data.me.attr({'fill':(e.data.me.selected ? colour : '#000000')});
				});
			}
			this.hexes[nut].fillcolour = getColour(this.nuts[nut].value);
			this.hexes[nut].attr({'fill':(this.hexes[nut].selected ? this.hexes[nut].fillcolour : '#5f5f5f'),'stroke':'#ffffff','title':this.nuts[nut].n,'data-nuts':nut,'style':'cursor: pointer;'});
			this.hexes[nut].update();
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

var hex;
S(document).ready(function(){

	hex = new HexMap('hexmap',400,566);
	
	// Create an initial hexmap
	hex.update();
	
});





function HexMap(id,w,h){
	
	this.w = w;
	this.h = h;
	this.aspectratio = w/h;
	this.id = id;
	this.rounded = Math.random();
	this.saveable = (typeof Blob==="function");

	var points,eye,patterns;
	var path = "";
	var colours = {
		"c1": { "bg": "#2254F4", "text": "white" },
		"c2": { "bg": "#178CFF", "text": "white" },
		"c3": { "bg": "#00B6FF", "text": "white" },
		"c4": { "bg": "#08DEF9", "text": "black" },
		"c5": { "bg": "#1DD3A7", "text": "white" },
		"c6": { "bg": "#0DBC37", "text": "white" },
		"c7": { "bg": "#67E767", "text": "white" },
		"c8": { "bg": "#722EA5", "text": "white" },
		"c9": { "bg": "#E6007C", "text": "white" },
		"c10": { "bg": "#EF3AAB", "text": "white" },
		"c11": { "bg": "#D73058", "text": "white" },
		"c12": { "bg": "#D60303", "text": "white" },
		"c13": { "bg": "#FF6700", "text": "white" },
		"c14": { "bg": "#F9BC26", "text": "black"}
	}
	var nuts = {
		"UKC11": { "name": "Hartlepool and Stockton-on-Tees", "short": "Hartlepool Stockton-on-T", "r": 15, "c": 7 },
		"UKC12": { "name": "South Teesside", "r": 15, "c": 8 },
		"UKC13": { "name": "Darlington", "r": 16, "c": 6 },
		"UKC14": { "name": "Durham CC", "r": 16, "c": 5 },
		"UKD36": { "name": "Greater Manchester North West", "r": 13, "c": 5 },
		"UKD37": { "name": "Greater Manchester North East", "r": 13, "c": 6 },
		"UKC21": { "name": "Northumberland", "r": 17, "c": 6 },
		"UKC22": { "name": "Tyneside", "r": 17, "c": 7 },
		"UKC23": { "name": "Sunderland", "r": 16, "c": 7 },
		"UKH21": { "name": "Luton", "r": 7, "c": 8 },
		"UKD11": { "name": "West Cumbria", "r": 16, "c": 4 },
		"UKD41": { "name": "Blackburn with Darwen", "r": 14, "c": 4 },
		"UKD42": { "name": "Blackpool", "r": 15, "c": 4 },
		"UKD47": { "name": "Chorley and West Lancashire", "r": 13, "c": 4 },
		"UKD61": { "name": "Warrington", "r": 12, "c": 4 },
		"UKD12": { "name": "East Cumbria", "r": 15, "c": 6 },
		"UKD33": { "name": "Manchester", "r": 12, "c": 5 },
		"UKD34": { "name": "Greater Manchester South West", "r": 11, "c": 5 },
		"UKD35": { "name": "Greater Manchester South East", "r": 11, "c": 6 },
		"UKD44": { "name": "Lancaster and Wyre", "r": 15, "c": 5 },
		"UKD45": { "name": "Mid Lancashire", "r": 14, "c": 5 },
		"UKD46": { "name": "East Lancashire", "r": 14, "c": 6 },
		"UKD74": { "name": "Wirral", "r": 11, "c": 3 },
		"UKD62": { "name": "Cheshire East", "r": 10, "c": 4 },
		"UKD63": { "name": "Cheshire West and Chester", "r": 10, "c": 3 },
		"UKD71": { "name": "East Merseyside", "r": 11, "c": 4 },
		"UKD72": { "name": "Liverpool", "r": 12, "c": 3 },
		"UKD73": { "name": "Sefton", "r": 13, "c": 3 },
		"UKE11": { "name": "Kingston upon Hull, City of", "short": "Kingston upon Hull", "r": 13, "c": 10 },
		"UKE12": { "name": "East Riding of Yorkshire", "r": 13, "c": 9 },
		"UKE13": { "name": "North and North East Lincolnshire", "r": 12, "c": 9 },
		"UKE21": { "name": "York", "r": 14, "c": 8 },
		"UKE32": { "name": "Sheffield", "r": 11, "c": 8 },
		"UKI34": { "name": "Wandsworth", "r": 3, "c": 9 },
		"UKE22": { "name": "North Yorkshire CC", "r": 14, "c": 7 },
		"UKE31": { "name": "Barnsley, Doncaster and Rotherham", "r": 12, "c": 7 },
		"UKE41": { "name": "Bradford", "r": 13, "c": 7 },
		"UKE42": { "name": "Leeds", "r": 13, "c": 8 },
		"UKE44": { "name": "Calderdale and Kirklees", "r": 12, "c": 6 },
		"UKE45": { "name": "Wakefield", "r": 12, "c": 8 },
		"UKF11": { "name": "Derby", "r": 9, "c": 6 },
		"UKF12": { "name": "East Derbyshire", "r": 11, "c": 7 },
		"UKF25": { "name": "North Northamptonshire", "short": "North Northamptons.", "r": 9, "c": 10 },
		"UKF13": { "name": "South and West Derbyshire", "r": 10, "c": 6 },
		"UKF14": { "name": "Nottingham", "r": 11, "c": 9 },
		"UKF15": { "name": "North Nottinghamshire", "short": "North Nottinghams.", "r": 11, "c": 10 },
		"UKG38": { "name": "Walsall", "r": 8, "c": 6 },
		"UKG39": { "name": "Wolverhampton", "r": 8, "c": 4 },
		"UKF16": { "name": "South Nottinghamshire", "short": "South Nottinghams.", "r": 10, "c": 9 },
		"UKF21": { "name": "Leicester", "r": 10, "c": 7 },
		"UKF22": { "name": "Leicestershire CC and Rutland", "r": 10, "c": 8 },
		"UKF24": { "name": "West Northamptonshire", "short": "West Northamptons.", "r": 9, "c": 7 },
		"UKH11": { "name": "Peterborough", "r": 9, "c": 11 },
		"UKF30": { "name": "Lincolnshire", "r": 10, "c": 10 },
		"UKG11": { "name": "Herefordshire, County of", "r": 7, "c": 4 },
		"UKI41": { "name": "Hackney and Newham", "r": 6, "c": 10 },
		"UKG12": { "name": "Worcestershire", "r": 6, "c": 4 },
		"UKG13": { "name": "Warwickshire", "r": 6, "c": 5 },
		"UKG21": { "name": "Telford and Wrekin", "r": 9, "c": 4 },
		"UKI42": { "name": "Tower Hamlets", "r": 5, "c": 10 },
		"UKI43": { "name": "Haringey and Islington", "r": 7, "c": 10 },
		"UKG22": { "name": "Shropshire CC", "r": 7, "c": 3 },
		"UKG23": { "name": "Stoke-on-Trent", "r": 10, "c": 5 },
		"UKH12": { "name": "Cambridgeshire CC", "r": 8, "c": 10 },
		"UKG24": { "name": "Staffordshire CC", "r": 9, "c": 5 },
		"UKG31": { "name": "Birmingham", "r": 7, "c": 5 },
		"UKG32": { "name": "Solihull", "r": 7, "c": 6 },
		"UKG33": { "name": "Coventry", "r": 7, "c": 7 },
		"UKG36": { "name": "Dudley", "r": 8, "c": 5 },
		"UKG37": { "name": "Sandwell", "r": 8, "c": 3 },
		"UKH14": { "name": "Suffolk", "r": 8, "c": 12 },
		"UKH15": { "name": "Norwich and East Norfolk", "r": 9, "c": 12 },
		"UKH16": { "name": "North and West Norfolk", "r": 10, "c": 11 },
		"UKH17": { "name": "Breckland and South Norfolk", "r": 8, "c": 11 },
		"UKH23": { "name": "Hertfordshire", "r": 8, "c": 8 },
		"UKH24": { "name": "Bedford", "r": 9, "c": 9 },
		"UKH25": { "name": "Central Bedfordshire", "r": 8, "c": 7 },
		"UKH31": { "name": "Southend-on-Sea", "r": 5, "c": 13 },
		"UKH32": { "name": "Thurrock", "r": 5, "c": 12 },
		"UKI44": { "name": "Lewisham and Southwark", "r": 4, "c": 10 },
		"UKI45": { "name": "Lambeth", "r": 4, "c": 9 },
		"UKH34": { "name": "Essex Haven Gateway", "r": 6, "c": 13 },
		"UKH35": { "name": "West Essex", "r": 7, "c": 12 },
		"UKI51": { "name": "Bexley and Greenwich", "r": 5, "c": 11 },
		"UKI52": { "name": "Barking & Dagenham and Havering", "r": 6, "c": 11 },
		"UKH36": { "name": "Heart of Essex", "r": 7, "c": 13 },
		"UKH37": { "name": "Essex Thames Gateway", "r": 6, "c": 12 },
		"UKI31": { "name": "Camden and City of London", "r": 6, "c": 9 },
		"UKI32": { "name": "Westminster", "r": 5, "c": 9 },
		"UKI33": { "name": "Kensington & Chelsea and Hammersmith & Fulham", "short": "Kensington Chelsea Hammersmith Fulham", "r": 4, "c": 8 },
		"UKI53": { "name": "Redbridge and Waltham Forest", "r": 7, "c": 11 },
		"UKI54": { "name": "Enfield", "r": 8, "c": 9 },
		"UKI61": { "name": "Bromley", "r": 4, "c": 11 },
		"UKI62": { "name": "Croydon", "r": 3, "c": 11 },
		"UKI63": { "name": "Merton, Kingston upon Thames and Sutton", "r": 3, "c": 10 },
		"UKI71": { "name": "Barnet", "r": 7, "c": 9 },
		"UKI72": { "name": "Brent", "r": 6, "c": 8 },
		"UKI73": { "name": "Ealing", "r": 5, "c": 8 },
		"UKI74": { "name": "Harrow and Hillingdon", "r": 6, "c": 7 },
		"UKI75": { "name": "Hounslow and Richmond upon Thames", "r": 4, "c": 7 },
		"UKJ11": { "name": "Berkshire", "r": 5, "c": 7 },
		"UKJ12": { "name": "Milton Keynes", "r": 9, "c": 8 },
		"UKJ13": { "name": "Buckinghamshire CC", "r": 6, "c": 6 },
		"UKJ26": { "name": "East Surrey", "r": 2, "c": 9 },
		"UKJ14": { "name": "Oxfordshire", "r": 5, "c": 6 },
		"UKJ21": { "name": "Brighton and Hove", "r": 1, "c": 9 },
		"UKJ22": { "name": "East Sussex CC", "r": 1, "c": 10 },
		"UKJ25": { "name": "West Surrey", "r": 3, "c": 8 },
		"UKK41": { "name": "Plymouth", "r": 1, "c": 2 },
		"UKJ27": { "name": "West Sussex (South West)", "r": 1, "c": 8 },
		"UKJ28": { "name": "West Sussex (North East)", "r": 2, "c": 8 },
		"UKJ31": { "name": "Portsmouth", "r": 2, "c": 7 },
		"UKJ32": { "name": "Southampton", "r": 3, "c": 6 },
		"UKJ34": { "name": "Isle of Wight", "r": 0, "c": 5 },
		"UKJ35": { "name": "South Hampshire", "r": 2, "c": 6 },
		"UKJ36": { "name": "Central Hampshire", "r": 3, "c": 7 },
		"UKJ37": { "name": "North Hampshire", "r": 4, "c": 6 },
		"UKJ41": { "name": "Medway", "r": 3, "c": 13 },
		"UKJ43": { "name": "Kent Thames Gateway", "r": 3, "c": 12 },
		"UKJ44": { "name": "East Kent", "r": 2, "c": 12 },
		"UKJ45": { "name": "Mid Kent", "r": 2, "c": 11 },
		"UKJ46": { "name": "West Kent", "r": 2, "c": 10 },
		"UKK11": { "name": "Bristol, City of", "r": 4, "c": 3 },
		"UKK12": { "name": "Bath and North East Somerset, North Somerset and South Gloucestershire", "short": "Bath North-East Somerset, N-Somerset South-Glou.", "r": 4, "c": 4 },
		"UKK42": { "name": "Torbay", "r": 2, "c": 4 },
		"UKK13": { "name": "Gloucestershire", "r": 5, "c": 4 },
		"UKK14": { "name": "Swindon", "r": 5, "c": 5 },
		"UKK15": { "name": "Wiltshire", "r": 4, "c": 5 },
		"UKK21": { "name": "Bournemouth and Poole", "r": 3, "c": 5 },
		"UKK22": { "name": "Dorset CC", "r": 3, "c": 4 },
		"UKK23": { "name": "Somerset", "r": 2, "c": 3 },
		"UKK30": { "name": "Cornwall and Isles of Scilly", "r": 1, "c": 1 },
		"UKK43": { "name": "Devon CC", "r": 2, "c": 2 },
		"UKL11": { "name": "Isle of Anglesey", "r": 10, "c": 1 },
		"UKL12": { "name": "Gwynedd", "r": 9, "c": 2 },
		"UKL13": { "name": "Conwy and Denbighshire", "r": 8, "c": 2 },
		"UKL14": { "name": "South West Wales", "r": 5, "c": 1 },
		"UKL15": { "name": "Central Valleys", "r": 7, "c": 2 },
		"UKL16": { "name": "Gwent Valleys", "r": 6, "c": 2 },
		"UKL17": { "name": "Bridgend and Neath Port Talbot", "r": 6, "c": 1 },
		"UKL18": { "name": "Swansea", "r": 5, "c": 2 },
		"UKL21": { "name": "Monmouthshire and Newport", "short": "Monmouthshire Newport", "r": 6, "c": 3 },
		"UKL22": { "name": "Cardiff and Vale of Glamorgan", "r": 5, "c": 3 },
		"UKL23": { "name": "Flintshire and Wrexham", "r": 9, "c": 3 },
		"UKL24": { "name": "Powys", "r": 8, "c": 1 },
		"UKM21": { "name": "Angus and Dundee", "r": 23, "c": 6 },
		"UKM22": { "name": "Clackmannanshire and Fife", "short": "Clackm. Fife", "r": 22, "c": 5 },
		"UKM23": { "name": "East Lothian and Midlothian", "r": 19, "c": 6 },
		"UKM24": { "name": "Scottish Borders", "r": 18, "c": 5 },
		"UKM25": { "name": "Edinburgh", "r": 20, "c": 5 },
		"UKM26": { "name": "Falkirk", "r": 21, "c": 5 },
		"UKM27": { "name": "Perth and Kinross, and Stirling", "r": 22, "c": 4 },
		"UKM28": { "name": "West Lothian", "r": 19, "c": 5 },
		"UKM31": { "name": "East Dunbartonshire, West Dunbartonshire, and Helensburgh and Lomond", "short": "E-Dunbart., W-Dunbart. Helensburgh Lomond", "r": 21, "c": 4 },
		"UKM32": { "name": "Dumfries and Galloway", "r": 17, "c": 5 },
		"UKM33": { "name": "East and North Ayrshire mainland", "r": 19, "c": 3 },
		"UKM34": { "name": "Glasgow", "r": 19, "c": 4 },
		"UKM35": { "name": "Inverclyde, East Renfrewshire, and Renfrewshire", "r": 20, "c": 3 },
		"UKM36": { "name": "North Lanarkshire", "r": 20, "c": 4 },
		"UKM37": { "name": "South Ayrshire", "r": 18, "c": 3 },
		"UKM38": { "name": "South Lanarkshire", "r": 18, "c": 4 },
		"UKM50": { "name": "Aberdeen and Aberdeenshire", "r": 23, "c": 5 },
		"UKM61": { "name": "Caithness and Sutherland, and Ross and Cromarty", "r": 24, "c": 4 },
		"UKM62": { "name": "Inverness, Nairn, Moray, and Badenoch and Strathspey", "short": "Inverness Nairn/Moray Badenoch Strathspey", "r": 23, "c": 4 },
		"UKM63": { "name": "Lochaber, Skye and Lochalsh, Arran and Cumbrae, and Argyll and Bute", "short": "Lochaber Skye-Lochalsh Arran-Cumbrae Argyll-Bute", "r": 22, "c": 3 },
		"UKM64": { "name": "Eilean Siar (Western Isles)", "r": 24, "c": 3 },
		"UKM65": { "name": "Orkney Islands", "r": 24, "c": 5 },
		"UKM66": { "name": "Shetland Islands", "r": 26, "c": 6 },
		"UKN01": { "name": "Belfast", "r": 17, "c": 1 },
		"UKN02": { "name": "Outer Belfast", "r": 16, "c": 1 },
		"UKN03": { "name": "East of Northern Ireland", "r": 16, "c": 0 },
		"UKN04": { "name": "North of Northern Ireland", "r": 18, "c": 0 },
		"UKN05": { "name": "West and South of Northern Ireland", "r": 17, "c": 0 }
	}

	function inRange(lo,hi){
		return Math.min(Math.max(lo,Math.random()),hi);
	}
	function random(lo,hi){
		return Math.random()*(hi-lo)+lo;
	}
		

	var _obj = this;
	// We'll need to change the sizes when the window changes size
	window.addEventListener('resize', function(event){ _obj.resize(); });

	this.size = function(){
		S('#'+this.id).css({'height':''});
		w = Math.min(this.w,S('#'+this.id)[0].offsetWidth);
		S('#'+this.id).css({'height':(w/this.aspectratio)+'px','width':w+'px'});
		this.paper = new SVG(this.id);
		w = this.paper.w;
		h = this.paper.h;

		this.transform = {'type':'scale','props':{x:w,y:h,cx:w,cy:h,r:w,'stroke-width':w}};
		
		return this;
	}
	this.resize = function(){
		this.size();
		this.paper.clear();
		this.draw();
		return this;
	}

	this.update = function(){ this.create().draw(); }
	this.create = function(){

		this.paper.clear();
		
		
		return this;
				
		var c = 'c'+Math.ceil(Math.random()*14);
		this.colour = c;
		this.colour2 = colours[c].text;
		
		front = inRange(0.1,0.9);
		head = random(0,0.1);
		back = inRange(0.1,0.9);
		back2 = inRange(0.1,0.9);
		tail = random(0,0.05);
		tailend = random(0.025,0.05);
		nose = random(-0.05,0.05);

		points = new Array(10);
		patterns = new Array();

		// Start with nose
		points[0] = { x: 0.1 - nose, y: 0.5 - front*(Math.random()-0.5)*0.5 };
		points[1] = { x: points[0].x, y: points[0].y - front*Math.random()*0.2 };

		// Slightly move top of nose forwards
		points[1].x -= (1-Math.pow(front,2))*0.02;

		// Add head
		points[2] = {x: 0.3 + head, y:((1 - front)/2)};
		points[9] = {x: 0.3 + head, y:((1 + front)/2)};

		// Add end of body
		points[3] = {x: 0.7, y: ((1 - back)/2) };
		points[8] = {x: 0.7, y: 0.75+random(-0.15,0.15) };

		// Add start of tail
		points[4] = {x: 0.83, y: 0.45 + tail };
		points[7] = {x: 0.83, y: 0.55 - tail };

		// Add end of tail
		points[5] = {x: 0.875 + tailend,y: 0.4 };
		points[6] = {x: 0.875 + tailend,y: 0.6 };

		eye = { x: points[0].x + (points[2].x-points[0].x)*0.75, y: (points[1].y - inRange(0,0.6)*Math.abs(points[2].y - points[1].y)) };

		if(Math.random() > 0.8) patterns.push({'pattern':getPattern('belly'),'attr':{'stroke-width':0,'stroke':'none','fill':this.colour2,'opacity':0.6}});
		else {
			if(Math.random() > 0.9) patterns.push({'pattern':getPattern('face'),'attr':{'stroke-width':0,'stroke':'none','fill':'black','opacity':0.7}});
			if(Math.random() > 0.7) patterns.push({'pattern':getPattern('stripes'),'attr':{'stroke-width':0.02,'stroke':this.colour2,'fill':this.colour2,'opacity':0.6}});
			else{
				if(Math.random() > 0.7) patterns.push({'pattern':getPattern('lines'),'attr':{'stroke-width':0.01,'stroke':this.colour2,'fill':this.colour2,'opacity':0.6}});
				else{
					if(Math.random() > 0.7) patterns.push({'circles':getPattern('circles'),'attr':{'stroke-width':0.008,'stroke':this.colour2,'fill':'none','opacity':0.8}});
				}
			}
		}

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

	this.draw = function(){


		function drawHex(x,y,s){

			var path = [['M',[x,y]]];
			var cs = (s*Math.sqrt(3)/2).toFixed(2);	// cos(30)
			var ss = (s*0.5).toFixed(2);
			
			path.push(['m',[cs,-ss]]);
			path.push(['l',[-cs,-ss,-cs,ss,0,s,cs,ss,cs,-ss]]);
			path.push(['z',[]]);
			return path;
		}

		var ncol = 14;
		var r = 0;
		var c = -1;
		var s = (this.w/(ncol*1.05))/2;

		var dx = (s*Math.sqrt(3));
		var ps = [];

		for(nut in nuts){
			c++;
			if(c > ncol){
				r++;
				c = 0;
			}
			c = nuts[nut].c;
			r = nuts[nut].r;

			var y = (this.h - (s + 1.5*s*r)).toFixed(1);
			var x = ((s + dx*c) + dx/2 - (r%2)*dx/2).toFixed(1);

			var h = drawHex(x,y,s);
			ps.push( this.paper.path(h).attr({'fill':'#FF6700','stroke':'none','opacity':(0.7+Math.random()*0.3),'title':nuts[nut].name}) );

			var _obj = ps[ps.length-1];
			_obj.on('mouseover',{hexmap:this,me:_obj,nut:nut,x:parseFloat(x),y:parseFloat(y)},function(e){
				this.attr('stroke','black').attr('stroke-width',1)//.css({'z-index':1});
				S('.infobubble').remove();
				S('#'+e.data.hexmap.id+' svg').after('<div class="infobubble" style="position:absolute;left:'+(e.data.x+s*0.5)+'px;top:'+(e.data.y)+'px;margin-bottom:'+(s+60)+'px"><div class="infobubble_inner">'+this.attr('title')+'</div></div>');
			}).on('mouseout',{hexmap:this,me:_obj},function(e){
				S('#infobubble').remove();
				this.attr('stroke','none');
			});
			// Add text label
			//var t = this.paper.text(x,y,n).attr({'stroke':'none','fill':'black','text-anchor':'middle','font-size':'8px','font-family':'Arial'});
		}
		this.paper.draw();

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

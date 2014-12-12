var cards = [
	{term: 'term', definition:'definition'}
];
var cards_unordered = [
	{term: 'term', definition:'definition'}
];
//var set_id = '60907381';

/*var color_opts =[ {colore: '#4582ec'},
					  {colore: '#1863e6'},
					  {colore: '#3fad46'},
					  {colore: '#318837'},
					  {colore: '#5bc0de'},
					  {colore: '#31b0d5'},
					  {colore: '#f0ad4e'},
					  {colore: '#ec971f'},
					  {colore: '#d9534f'},
					  {colore: '#c9302c'}];
*/



var settings_defaults = {
					// setId: '12017035', // FLOCABULARY 3rd Grade
					setId: '29797300', // FLOCABULARY 2nd Grade
					//setId: '60907381',
					displayFirst: 'definition',
					displayDelay: 2,
					displayTime: 5,
					betweenCards: 0,
					inOrder: 'keep',
					delayRatio: 0.2
					};

var settings = settings_defaults;


var t1 = new TimelineLite;
var t2 = new TimelineLite;

var thisCard = 0;

function initOptions(r){

	r = typeof r === 'boolean' ? r : false;


	for (var k in settings)
	{
		if(r || localStorage.getItem(k) === null)
		{
			localStorage.setItem(k, settings_defaults[k]);
		}
		else
		{
			settings[k] = localStorage.getItem(k);
		}

		
	}

	console.log(settings);

}



function setOption(o,v,s){
	s = typeof s !== 'undefined' ? s : true;

	settings[o] = v;
	localStorage.setItem(o, v);

	if(o === 'displayDelay' && s)
		setOption('delayRatio', settings.displayDelay / settings.displayTime );

	if(o === 'inOrder')
	{
		 if(v === "keep")
     	 	cards = cards_unordered;
     	 else if(v === "shuffle")
     	 	cards = shuffle(cards_unordered);
     	 else if(v === "term")
     	 	cards = specialSort(cards_unordered,['term','definition']);
     	 else if(v === "definition")
     	 	cards = specialSort(cards_unordered,['definition','term']);
     	 else
     	 	cards = cards_unordered;

     	 console.log(cards);

     	 thisCard = 0;

	}


	console.log("Settings Updated: " + JSON.stringify(settings));
}

function resizeEvent(){
	document.getElementById('cover-container').style.width = Math.floor( window.innerWidth * .98 ) + 'px' ;
	$('.mastfoot').css('margin-left', ($('.mastfoot').innerWidth() / 2) * -1 );
	console.log();
	document.getElementById('definition').style.width = window.innerWidth * .92;
  	document.getElementById('term').style.width = window.innerWidth * .95;
}

function initListeners(){

	// Options Screen

	// Sliders

	// Slider: displayDelay 

	$('#displayDelay').slider({formatter: function(v){ return v + ' seconds';}, tooltip: 'show', value: parseFloat(settings.displayDelay), min: 0, max: (settings.displayTime - 1), step:1}).on("slide", function(e){ 
			
												setOption('displayDelay',parseInt(e.value),true); 

											});
	
	// Slider: displayTime

	$('#displayTime').slider({formatter: function(v){ return v + ' seconds';}, tooltip: 'show', value: parseFloat(settings.displayTime), min:0, max:60, step:1}).on("change", function(e){ 
												setOption('displayTime',parseInt(e.value.newValue)); 
												var newDelay = Math.ceil(  e.value.newValue * settings.delayRatio );
												$('#displayDelay').slider('setValue', newDelay, false);
												
												setOption('displayDelay',parseInt(newDelay),false); 

												$('#displayDelay').slider('setAttribute', 'max', e.value.newValue);

											});
	
	// Slider: betweenCards

	$('#betweenCards').slider({formatter: function(v){ return v + ' seconds';}, tooltip: 'show', value: parseFloat(settings.betweenCards), step:1, min:0, max:60}).on("change", function(e){ 
												setOption('betweenCards',parseInt(e.value.newValue)); 
											});

	// Radio Buttons

	$("input:radio").change(function () { 
		if(this.id === 'false') var v = false;
		else if(this.id === 'true') var v = true;
		else var v = this.value;
		setOption(this.name, v);
		
	});

	// Text Input Fields

}

function getTerms(s)
{
	s = typeof s !== 'undefined' ? s : false;

	var endpoint = 'https://api.quizlet.com/2.0/sets/' + settings.setId;

	$.ajax({
		type: 'GET',
		dataType: 'jsonp',
        url: endpoint,
        headers: {
        	'Authorization': 'Bearer VscB7nOQKGlM7Pl7.0otsw'
        },
        data: {
        	client_id: '2JfxnspMuv'
        },
        success: function(data) {

     	 cards_unordered = data.terms;

     	 if(settings.inOrder === "keep")
     	 	cards = cards_unordered;
     	 else if(settings.inOrder === "shuffle")
     	 	cards = shuffle(cards_unordered);
     	 else if(settings.inOrder === "term")
     	 	cards = specialSort(cards_unordered,['term','definition']);
     	 else if(settings.inOrder === "definition")
     	 	cards = specialSort(cards_unordered,['definition','term']);
     	 else
     	 	cards = cards_unordered;

     	 if(cards[0].image !== null)
		{
			ss = s;
			s = false;

			prefetchImage(ss);
			
		}

     	  if(s)	newCard();

     	 
		   
   		 },
   		 error: function(data) {

   		 }

        
    });
}

/* prefetchImage (s, s2)
 *		Accepts two values in any order or as an object {i: %, n: %}
 *			i: Integer; offset for global cards array; default: global thisCard
 *			n: Boolean; whether to trigger newCard() after preloading image; default: false
 */		

function prefetchImage(s, s2){
	

	switch (typeof s){
		case 'undefined': var o = {i: thisCard, n: false}; break;
		case 'boolean': var o = {i: (typeof s2 === 'number' ? s2 : thisCard), n: s}; break;
		case 'number': var o = {i: s, n: (typeof s2 === 'boolean' ? s2 : false)}; break;
		case 'object': var o = {i: (typeof s.i === 'number' ? s.i : thisCard), n: (typeof s.n === 'boolean' ? s.n : false)}; break;
		default: var o = {i: thisCard, n: false}; break;
	}

	//var ss = s;
	//			s = false;
			//console.log('preload next image: ' + cardNext.image.url.replace('_m.','_b.'));
			var fetchImage = new Image();
			fetchImage.onload = function(){ 
				if(this.width != 500 || this.height != 374 || ( (cards[o.i].image.width / cards[o.i].image.height) === ( 500 / 374 ) ) )
					{
						// not redirected, so use it
						cards[o.i].image.url = cards[o.i].image.url.replace('_m.','_b.');
						cards[o.i].image.width = this.width;
						cards[o.i].image.height = this.height;
						//console.log('use big');

						if(o.n) newCard();
						else return false;
					}
					else
					{
						var fetchImage2 = new Image();
						fetchImage2.onload = function(){
							if(o.n) newCard();
							else return false;
						}
						fetchImage2.src = cards[o.i].image.url;


					}
					//else console.log('do not use big');
				//	console.log(this.width + "x" + this.height); 
			};
			fetchImage.src = cards[o.i].image.url.replace('_m.','_b.');
			// console.log(nextImage.src);

}

function newCard()
{
	TweenLite.set(".cover", {perspective:200});
	//t1.clear();
	t2.clear();
	
	t2 = new TimelineMax({paused:true}); 
		t2.addLabel("start");	

		thisCard = thisCard < cards.length - 1 ? thisCard + 1 : 0;

		nextCard = thisCard < cards.length - 1 ? thisCard + 1 : 0;

			var card =  cards[thisCard];
			//var cardNext = cards[nextCard];

			if(cards[nextCard].image !== null)
				{
					prefetchImage(nextCard);
				}

			if(card.image !== null)
			{
				document.getElementById('img_bg').style.clip= 'rect(0px '+window.innerWidth+'px '+window.innerHeight+'px 0px)';
				document.getElementById('img_bg').src = card.image.url;
				//$('#img_bg').css('background-size','cover');

				if( ( (window.innerHeight / card.image.height) * card.image.width ) <= window.innerWidth )
				{
					//console.log('Go Wide: ' + card.image.width + 'x' + card.image.height);
					document.getElementById('img_bg').style.height = '';
					document.getElementById('img_bg').style.width = window.innerWidth+'px';
					
				}
				else
				{
					//console.log('Tall: ' + card.image.width + 'x' + card.image.height);
						document.getElementById('img_bg').style.width = '';
					document.getElementById('img_bg').style.height = window.innerHeight+'px';
				}


				t2.fromTo('#img_bg',(settings.displayTime),{opacity:0, scale:1, ease:Power3.easeInOut},{opacity:1.0, scale:1.1},"start");
			}
			else
			{
				$('#img_bg').css('background-image','');
			}

		

		
		
		$('#term').empty().append(card.term);
							$('#definition').empty().append(card.definition);

							$('.term').bigtext({ maxfontsize: Math.floor(window.innerHeight * .8 )});
							
							//$('.definition').bigtext({ maxfontsize: Math.floor( (window.innerHeight * .8 ) - document.getElementById('term').clientHeight )});

							var i = 0.9;

							do
							{
								i = i + 0.1;
								var definitionSize = Math.floor( ( ( (window.innerHeight * 1 ) - document.getElementById('term').clientHeight ) / i )  );
								
								
								
							$('#definition').css('font-size',definitionSize+'px');

							$('#definition').balanceText();
							
							}
							while( ( $('#definition').innerHeight() > ( (window.innerHeight * .9 ) - document.getElementById('term').clientHeight ) ) || $('#definition').innerWidth() > window.innerWidth * .95 );
							
						//	$('p[data-owner:balance-text]').addClass('balance-text');

														

		$('#definition').css('bottom', $('#term').innerHeight() * baselineRatio(document.getElementById('term')) );
		//$('.cover').css('top', (Math.floor($('#definition').innerHeight() ) * -1) );

		//console.log();
		

    		termSplitText = new SplitText("#term", {type:"words,chars"}), 
    		termChars = termSplitText.chars; //an array of all the divs that wrap each character

    		definitionSplitText = new SplitText('p[data-owner="balance-text"]', {type:"chars"}), 
    		definitionChars = definitionSplitText.chars; //an array of all the divs that wrap each character


							
    						var color = new RColor;
							
							var color1 = color.get(true, 0.80, 0.95);
    						var color3 = color.get(true, 0.80, 0.95);
							var color2 = color.get(true, 0.80, 0.95);
							var color4 = color.get(true, 0.80, 0.95);

							
    								

    						if(settings.displayFirst === "both")
    						{
    						

    							var termPosition = "start";
    							var definitionPosition = "start";

    							

    						}
    						else if(settings.displayFirst === "term")
    						{
    						

    							var termPosition = "start";
    								var definitionPosition = "start+=" + settings.displayDelay;

    						   						


    						}
    						else if(settings.displayFirst === "definition")
    						{
    						
    							var definitionPosition = "start";
    							var termPosition = "start+=" + settings.displayDelay;
    						

    						}

    						console.log("textShadow: "+"0px 0px "+Math.floor(window.innerWidth/50)+"px "+Math.floor(window.innerWidth/100)+"px rgba(38, 38, 38, 0.79)");

    							t2.staggerFromTo(
									definitionChars, 
									0.8, 
									{
										opacity:0, 
										scale:0, 
										y:-80, 
										rotationX:180, 
										transformOrigin:"0% 50% -50",  
										ease:Back.easeOut
									},
									{
										opacity:1,
										scale:1,
										y:0,
										rotationX:0
									},
									0.05,
									definitionPosition);

    							t2.staggerFromTo(
									termChars, 
									0.8, 
									{
										opacity:0, 
										scale:0, 
										
										
										rotationX:180, 
										transformOrigin:"0% 50% -50", 
										ease:Back.easeOut
										
									}, 
									{
										opacity:1,
										scale:1,
										
										
										rotationX:0
									},
									0.02, 
									termPosition);
    							
									
									t2.staggerFromTo(termChars, ( settings.displayTime - (settings.displayFirst === "definition" ? settings.displayDelay : 0 ) - (0.1 * termChars.length) ) ,{color:color1},{color:color2},0.1,termPosition);

									t2.staggerFromTo(definitionChars, ( settings.displayTime - (settings.displayFirst === "term" ? settings.displayDelay : 0 ) - (0.1 * definitionChars.length) ) ,{color:color3},{color:color4},0.1,definitionPosition);
									
									t2.addLabel("destroy","0+="+settings.displayTime);

									t2.fromTo('.stuff',(settings.displayTime),{textShadow:"0px 0px 0px rgba(38, 38, 38, 0)", scale:0.8},{textShadow:"textShadow: "+"0px 0px "+Math.floor(window.innerWidth/50)+"px rgba(38, 38, 38, 0.89)", scale:1, ease:Linear.easeNone},"start");

									
    		if(termChars.length <= definitionChars.length)
    		{
    			var tStaggerTime = 0.15;
    			var tTime = 1.5;

    			var tTotalStaggerTime = (tStaggerTime * termChars.length) ;	
				var TotalTime = tTime + tTotalStaggerTime;

				var dStaggerTime = tTotalStaggerTime / definitionChars.length;
				var dTime = TotalTime - dStaggerTime;
    		}
    		else
    		{
    			var dStaggerTime = 0.15;
    			var dTime = 1.5;

    			var dTotalStaggerTime = (dStaggerTime * definitionChars.length) ;	
				var TotalTime = dTime + dTotalStaggerTime;

				var tStaggerTime = dTotalStaggerTime / termChars.length;
				var tTime = TotalTime - tStaggerTime;
    		}
    		
    		

			t2.staggerTo(
					definitionChars, 
					dTime, 
					{
						opacity:0, 
						scale:2, 
						y:-80, 
						rotationX:180,
						transformOrigin:"0% 50% -50",  
						ease:Back.easeOut,
						onComplete: function(){
							newCard();
						}
					},
					dStaggerTime,
					"destroy");
			t2.staggerTo(
					termChars, 
					tTime, 
					{
						opacity:0, 
						scale:3, 
						y:80, 
						rotationX:250, 
						rotationY:360,  
						transformOrigin:"0% 50% -50", 
						ease:Back.easeOut
					},
					tStaggerTime,
					"destroy"
					);

			if(card.image !== null)
			{
				//t2.to('#img_bg',1.5,{opacity:1.0}, "destroy-=2.0");
				t2.to('#img_bg',TotalTime,{opacity:0, scale:3, ease:Linear.ease},"destroy");
			}

			t2.play();



}



$(document).ready(function() {

	initOptions();

	resizeEvent();
	initListeners();






	$('#nextSlide').click(function(){
		newCard();
	});

	$('#settingsModal').on('show.bs.modal', function (event) {
		t2.pause();
	});
	$('#settingsModal').on('hide.bs.modal', function (event) {
		newCard();
	});

	$(window).resize( $.throttle(250, function() {
  			document.getElementById('cover-container').style.width = Math.floor( window.innerWidth * .98 ) + 'px' ;
  			$('.mastfoot').css('margin-left', ($('.mastfoot').innerWidth() / 2) * -1 );

  			document.getElementById('definition').style.width = window.innerWidth * .92;
  			document.getElementById('term').style.width = window.innerWidth * .95;
	}) );


	getTerms(true);
	//newCard();

});
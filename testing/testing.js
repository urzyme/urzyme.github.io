
SVG_WIDTH = 2000;
SVG_HEIGHT = 1500;

CATALYTIC_DOMAIN_WIDTH = 250;
CATALYTIC_DOMAIN_HEIGHT = 110;
CATALYTIC_DOMAIN_XPAD = 10;
CATALYTIC_DOMAIN_YPAD = 18;
CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_1 = 15;
CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_2 = 16;
CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP = 0.58;
CATALYTIC_DOMAIN_HELIX_WIDTH_PROP = 0.8;
CATALYTIC_DOMAIN_CUBIC_RIGHT_DX = 0;
CATALYTIC_DOMAIN_LOOP_WIDTH = 2;
CATALYTIC_DOMAIN_HELIX_CORNER_RADIUS = 2;
CATALYTIC_DOMAIN_FONT_SIZE = 22;
CATALYTIC_DOMAIN_MOTIF_FONT_SIZE = 8;
CATALYTIC_DOMAIN_ARROW_BG_WIDTH = 0.5;

INSERTION_MODULE_COL = "black";
INSERTION_MODULE_RADIUS = 8;
INSERTION_MODULE_FONT_SIZE = 18;



LEAF_LENGTH = 70;
LEAF_DY = 60;
LEAF_CONTROL_POINTS = [LEAF_LENGTH*0.15, LEAF_DY*0.9, LEAF_LENGTH*0.9, LEAF_DY*1];


MAIN_ARROW_LWD = 2.5;

AA_COLS_2 = {E: "#FFC20A", H: "#0C7BDC", G: "#0C7BDC", I: "#0C7BDC", T:"#d3d3d3", S: "#d3d3d3",  B: "#d3d3d3",  N: "#ffffff"};





// Draw a class I or II catalytic domain layout
function drawTree(){

		let json = null;
		

    // Prepare html and svg
    $("#catalyticDomainDIV").append("<svg id='catalyticSVG' height=0 width=0 overflow='auto'></svg>")


   

    // Populate the svg
    let svg = $("#catalyticSVG");
    svg.width(SVG_WIDTH);
    svg.height(SVG_HEIGHT);



    

    // Prepare colurs
		let motifColBase = "#ba2e00"; 
		let highlightColBase = "#222222"; 

    // Define colour gradients
    let defs = $(drawSVGobj(svg, "defs", {} ));
    let helixGradient = $(drawSVGobj(defs, "linearGradient", {id: "helixGradient"} ));
    $(drawSVGobj(helixGradient, "stop", {offset: "0%", stop_color: AA_COLS_2["H"] + "99"} ));
    $(drawSVGobj(helixGradient, "stop", {offset: "100%", stop_color: AA_COLS_2["H"] + "cc"} ));
    let helixBackgroundGradient = $(drawSVGobj(defs, "linearGradient", {id: "helixBackgroundGradient"} ));
    $(drawSVGobj(helixBackgroundGradient, "stop", {offset: "0%", stop_color: "#111111aa"} ));
    $(drawSVGobj(helixBackgroundGradient, "stop", {offset: "100%", stop_color: "#111111bb"} ));
    let strandGradient = $(drawSVGobj(defs, "linearGradient", {id: "strandGradient"} ));
    $(drawSVGobj(strandGradient, "stop", {offset: "0%", stop_color: AA_COLS_2["E"] + "77"} ));
    $(drawSVGobj(strandGradient, "stop", {offset: "100%", stop_color: AA_COLS_2["E"] + "cc"} ));
    let strandBackgroundGradient = $(drawSVGobj(defs, "linearGradient", {id: "strandBackgroundGradient"} ));
    $(drawSVGobj(strandBackgroundGradient, "stop", {offset: "0%", stop_color: "#111111aa"} ));
    $(drawSVGobj(strandBackgroundGradient, "stop", {offset: "100%", stop_color: "#111111ee"} ));
    let motifGradient = $(drawSVGobj(defs, "linearGradient", {id: "motifGradient"} ));
    $(drawSVGobj(motifGradient, "stop", {offset: "0%", stop_color: motifColBase + "99"} ));
    $(drawSVGobj(motifGradient, "stop", {offset: "100%", stop_color: motifColBase + "ee"} ));
    let highlightGradient = $(drawSVGobj(defs, "linearGradient", {id: "highlightGradient"} ));
    $(drawSVGobj(highlightGradient, "stop", {offset: "0%", stop_color: highlightColBase + "dd"} ));
    $(drawSVGobj(highlightGradient, "stop", {offset: "100%", stop_color: highlightColBase + "ff"} ));


    // Arrow head
    let arrowheadVert = $(drawSVGobj(defs, "marker", {id: "arrowheadVert", markerWidth: 9, markerHeight: 9,  refX: "3.5", refY: "0"} ));
    $(drawSVGobj(arrowheadVert, "polygon", {points: "0 0, 3.5 9, 7 0"} ));
    let arrowheadRight = $(drawSVGobj(defs, "marker", {id: "arrowheadRight", markerWidth: 9, markerHeight: 9,  refX: "0", refY: "3.5"} ));
    $(drawSVGobj(arrowheadRight, "polygon", {points: "0 0, 9 3.5, 0 7"} ));
    let arrowheadLeft = $(drawSVGobj(defs, "marker", {id: "arrowheadLeft", markerWidth: 9, markerHeight: 9,  refX: "0", refY: "3.5"} ));
    $(drawSVGobj(arrowheadLeft, "polygon", {points: "9 0, 0 3.5, 9 7"} ));



    let helixCol = "url(#helixGradient)";
    let strandCol = "url(#strandGradient)";
    let motifCol = "url(#motifGradient)";
    let highlightCol = "url(#highlightGradient)";
    let helixBgCol  = "url(#helixBackgroundGradient)";
    let strandBgCol  = "url(#strandBackgroundGradient)";


    
   

    // Vertical arrow line
    //drawSVGobj(svg, "line", {x1: 50 + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: 50 + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: 0, y2: 9*dy, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );

    
    let titleFontSize = CATALYTIC_DOMAIN_FONT_SIZE*0.8;
    //let dx = CATALYTIC_DOMAIN_WIDTH + 2*CATALYTIC_DOMAIN_XPAD;
	//let dy = CATALYTIC_DOMAIN_HEIGHT + 1.5*CATALYTIC_DOMAIN_YPAD;

	let dy = CATALYTIC_DOMAIN_HEIGHT + 3*CATALYTIC_DOMAIN_YPAD;
	let dx = CATALYTIC_DOMAIN_WIDTH*0.8 + 2*CATALYTIC_DOMAIN_XPAD;

    for (let classNr = 1; classNr <= 2; classNr++){

	    if (classNr == 1){



	    	let paddingLeft = 400;



	    	// Protozyme
	    	let ym = 0;
			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: 0, y2: 1*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	drawClass1Domain(paddingLeft, 0, svg, motifColBase, highlightColBase, "Protozyme", {box: true, protozyme: true});
			 


			// Urzyme
	    	ym = 1;
			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: 2*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	drawClass1Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "Urzyme", {box: true, urzyme: true, highlight: "urzyme"});
			 


	    	ym = 2;

			// Subclass 1c: TrpRS, TyrRS
			let trpY = (ym+0.1)*dy;
			let trpX = paddingLeft-0.65*dx;
			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: trpX, y1: trpY, y2: trpY, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawSVGobj(svg, "text", {x:trpX+CATALYTIC_DOMAIN_FONT_SIZE/2, y: trpY - 3*CATALYTIC_DOMAIN_FONT_SIZE/4, style: "font-size:" + titleFontSize + "px; text-anchor:start; dominant-baseline:central;"}, "1c");
	    	drawTip(svg, trpX, trpY, true, false);
	    	drawTip(svg, trpX, trpY, false, false);
	    	drawClass1Domain(trpX-LEAF_LENGTH, trpY-LEAF_DY, svg, motifColBase, highlightColBase, "", {align: "right", box: false, small: true, name: "TyrRS"});
	    	drawClass1Domain(trpX-LEAF_LENGTH, trpY+LEAF_DY, svg, motifColBase, highlightColBase, "", {align: "right", box: false, small: true, name: "TrpRS-A and -B"});



	    	// LysRS-II
	    	let lysY = (ym+0.7)*dy;
	    	let lysX = paddingLeft-0.2*dx;
	    	drawSVGobj(svg, "text", {x:lysX+CATALYTIC_DOMAIN_FONT_SIZE/2, y: lysY - 4*CATALYTIC_DOMAIN_FONT_SIZE/4, style: "font-size:" + titleFontSize + "px; text-anchor:start; dominant-baseline:central;"}, "1d");
	    	drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: lysX, y1: lysY, y2: lysY, marker_end:"url(#arrowheadLeft)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawClass1Domain(lysX, lysY, svg, motifColBase, highlightColBase, "", {align: "right", box: false, small: true,  lysRS: true, insertName: "K", name: "LysRS-II"});



			// +CP1
			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: 3.3*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	drawClass1Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "+ CP1", {box: true, highlight: "cp1"});


	    	// +Z: ArgRS
	    	ym = 3.3;





	    	// ArgRS
	    	let argY = (ym+0.1)*dy;
	    	let argX = paddingLeft-0.2*dx;
	    	drawSVGobj(svg, "text", {x:argX+CATALYTIC_DOMAIN_FONT_SIZE/2, y: argY - 4*CATALYTIC_DOMAIN_FONT_SIZE/4, style: "font-size:" + titleFontSize + "px; text-anchor:start; dominant-baseline:central;"}, "1e");
	    	drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: argX, y1: argY, y2: argY, marker_end:"url(#arrowheadLeft)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawClass1Domain(argX, argY, svg, motifColBase, highlightColBase, "", {align: "right", box: false, small: true, Z: true, name: "ArgRS"});



			// Gln, glu, glx
			let glnY = (ym+0.7)*dy;
			let glnX = paddingLeft-0.65*dx;
			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: glnX, y1: glnY, y2: glnY, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawSVGobj(svg, "text", {x:glnX+CATALYTIC_DOMAIN_FONT_SIZE/2, y: glnY - 3*CATALYTIC_DOMAIN_FONT_SIZE/4, style: "font-size:" + titleFontSize + "px; text-anchor:start; dominant-baseline:central;"}, "1b");
	    	drawTip(svg, glnX, glnY, true, false);
	    	drawTip(svg, glnX, glnY, false, false);
	    	drawClass1Domain(glnX-LEAF_LENGTH, glnY-LEAF_DY, svg, motifColBase, highlightColBase, "", {align: "right", box: false, Z: true, sc1b: true, small: true, insertName: "b", name: "GluRS"});
	    	drawClass1Domain(glnX-LEAF_LENGTH, glnY+LEAF_DY, svg, motifColBase, highlightColBase, "", {align: "right", box: false, Z: true, sc1b: true, small: true, insertName: "b", name: "GlnRS and GlxRS"});


	    	// +Z
			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: 4.5*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	drawClass1Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "+ Z", {box: true, Z: true, highlight: "Z"});




	    	// Subclass 1a
	    	ym = 4.5;


	    	// MetRS
	    	let metY = (ym+0.4)*dy;
	    	let metX = paddingLeft-0.2*dx;
	    	drawSVGobj(svg, "text", {x:paddingLeft+CATALYTIC_DOMAIN_FONT_SIZE, y: ym*dy - 1*CATALYTIC_DOMAIN_FONT_SIZE, style: "font-size:" + titleFontSize + "px; text-anchor:start; dominant-baseline:central;"}, "1a");
	    	drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: metX, y1: metY, y2: metY, marker_end:"url(#arrowheadLeft)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawClass1Domain(metX, metY, svg, motifColBase, highlightColBase, "", {align: "right", box: false, small: true, Z: true, sc1a: true, name: "MetRS"});




	    	// Twin helix
	    	drawClass1Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "+ Twin helix", {box: true, Z: true, sc1a: true, highlight: "sc1a"});
	    	

	    }

	    if (classNr == 2){


	    	let paddingLeft = 900;

			
			
			let ym = 0;
			
			 drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: 0, y2: 1*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	 drawClass2Domain(paddingLeft, 0, svg, motifColBase, highlightColBase, "Protozyme", {box: true, protozyme: true, align: "right"});
			 
			 
			 
			 
			 // Urzyme
			 ym = 1;
			 drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: 2*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			 drawClass2Domain(paddingLeft, ym*dy, svg, motifColBase,  highlightColBase,"Urzyme", {box: true, urzyme: true, highlight: "urzyme", align: "right"});


			 // 6 fold
			 ym = 2;

			 // Subclass 2d: AlaRS
			let alaY = (ym+0.35)*dy;
			let alaX = paddingLeft+0.65*dx;
			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: alaX, y1: alaY, y2: alaY, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawSVGobj(svg, "text", {x:alaX-CATALYTIC_DOMAIN_FONT_SIZE/2, y: alaY - 3*CATALYTIC_DOMAIN_FONT_SIZE/4, style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "2d");
	    	drawTip(svg, alaX, alaY, true, true);
	    	drawTip(svg, alaX, alaY, false, true);
	    	drawClass2Domain(alaX+LEAF_LENGTH, alaY-LEAF_DY, svg, motifColBase, highlightColBase, "", {align: "left", box: false, small: true, L6: true, insertName: "A", name: "AlaRS"});
	    	drawClass2Domain(alaX+LEAF_LENGTH, alaY+LEAF_DY, svg, motifColBase, highlightColBase, "", {align: "left", box: false, small: true, name: "GlyRS-B"});


	    	// 6 fold domain
	    	drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: 3.3*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawClass2Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "6 fold", {box: true, highlight: "6fold", align: "right"});



			ym = 3.3


			 // Nested acid/base
			 let acidY = (ym+0.35)*dy;
			 let acidX = paddingLeft+1.4*dx;
			 drawSVGobj(svg, "text", {x:paddingLeft+0.25*dx, y: acidY - 4*CATALYTIC_DOMAIN_FONT_SIZE/4, style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "2b");
	    	 drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft+0.2*dx, y1: acidY, y2: acidY, marker_end:"url(#arrowheadRight)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			 drawClass2Domain(acidX, ym*dy, svg, motifColBase,  highlightColBase,"+SC2b IM", {box: true, hairpin: true, s2b: true, align: "right", L8: true, insertName: "b", highlight: "sc2b"});
			

			 // Todo subclass 2b with 2 twin helices
			 drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: 4.5*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			 drawClass2Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "+Dimer loop", {box: true, hairpin: true, highlight: "hairpin1", align: "right"});
	    	


	    	ym = 4.5;


 			// Subclass 2c: PheRS
			let pheY = (ym+0.35)*dy;
			let pheX = paddingLeft+0.65*dx;
			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: pheX, y1: pheY, y2: pheY, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawSVGobj(svg, "text", {x:pheX-CATALYTIC_DOMAIN_FONT_SIZE/2, y: pheY - 3*CATALYTIC_DOMAIN_FONT_SIZE/4, style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "2d");
	    	drawTip(svg, pheX, pheY, true, true);
	    	drawTip(svg, pheX, pheY, false, true);
	    	drawClass2Domain(pheX+LEAF_LENGTH, pheY-LEAF_DY, svg, motifColBase, highlightColBase, "", {align: "left", box: false, hairpin: true, gates: true, small: true, name: "PheRS"});
	    	drawClass2Domain(pheX+LEAF_LENGTH, pheY+LEAF_DY, svg, motifColBase, highlightColBase, "", {align: "left", box: false, hairpin: true, gates: true, small: true, HP: true, insertName: "O", name: "SepRS"});



	    	drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: 5.8*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	drawClass2Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "+Gates", {box: true, hairpin: true, gates: true, highlight: "gates", align: "right"});
			

			ym = 5.8;


			drawClass2Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "+2a Hairpin", {box: true, hairpin: true, gates: true, hairpin2: true, align: "right", highlight: "hairpin2"});
			

			 /*
			

	    	

			 ym = 3;

	    	 // Hairpin 1
			 drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: 4.3*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} ); 
			 drawSVGobj(svg, "text", {x: paddingLeft + 2*CATALYTIC_DOMAIN_FONT_SIZE, y: ym*dy - CATALYTIC_DOMAIN_FONT_SIZE/2, style: "font-size:" + titleFontSize + "px; text-anchor:start; dominant-baseline:central;"}, "Subclass IIb");
	    	 drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft+3.2*dx, y1: ym*dy, y2: ym*dy, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	 drawClass2Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "+Hairpin 1", {box: true, hairpin: true, highlight: "hairpin1"});
	    	 drawSVGobj(svg, "line", {x1: paddingLeft+1*dx, x2: paddingLeft+1*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );

			 
			 // Nested acid/base
			 drawClass2Domain(paddingLeft+1*dx, ym*dy, svg, motifColBase,  highlightColBase,"+SC2b IM", {box: true, hairpin: true, s2b: true, L8: true, insertName: "b", highlight: "sc2b"});
			 drawSVGobj(svg, "line", {x1: paddingLeft+2.0*dx, x2: paddingLeft+2.0*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	 drawSVGobj(svg, "line", {x1: paddingLeft+2.1*dx, x2: paddingLeft+2.1*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	 drawSVGobj(svg, "line", {x1: paddingLeft+2.2*dx, x2: paddingLeft+2.2*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			 drawSVGobj(svg, "line", {x1: paddingLeft+3.2*dx, x2: paddingLeft+3.2*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			 drawSVGobj(svg, "text", {transform:"translate(" + (paddingLeft+2.0*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "AsnRS");
	    	 drawSVGobj(svg, "text", {transform:"translate(" + (paddingLeft+2.1*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "AsxRS");
	    	 
	    	 drawClass2Domain(paddingLeft+2.2*dx, ym*dy, svg, motifColBase,  highlightColBase,"AspRS", {box: false, hairpin: true, s2b: true, L8: true, s2bInsertInsert: true, insertName: "D"});
			drawClass2Domain(paddingLeft+3.2*dx, ym*dy, svg, motifColBase,  highlightColBase,"LysRS-II", {box: false, hairpin: true, s2b: true, L8: true, s2bInsertInsert: true, insertName: "K"});
			
			 

			ym = 4.3;

	    	 // Gates
			 drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: 6*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} ); 
	    	 drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft+2.5*dx, y1: ym*dy, y2: ym*dy, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	drawSVGobj(svg, "text", {x: paddingLeft + 2*CATALYTIC_DOMAIN_FONT_SIZE, y: ym*dy - CATALYTIC_DOMAIN_FONT_SIZE/2, style: "font-size:" + titleFontSize + "px; text-anchor:start; dominant-baseline:central;"}, "Subclass IIc");
			drawClass2Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "+Gates", {box: true, hairpin: true, gates: true, highlight: "gates"});
			drawSVGobj(svg, "line", {x1: paddingLeft+1*dx, x2: paddingLeft+1*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	drawSVGobj(svg, "line", {x1: paddingLeft+1.1*dx, x2: paddingLeft+1.1*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	drawSVGobj(svg, "line", {x1: paddingLeft+1.2*dx, x2: paddingLeft+1.2*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	drawSVGobj(svg, "line", {x1: paddingLeft+1.3*dx, x2: paddingLeft+1.3*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	drawSVGobj(svg, "line", {x1: paddingLeft+1.4*dx, x2: paddingLeft+1.4*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	drawSVGobj(svg, "line", {x1: paddingLeft+1.5*dx, x2: paddingLeft+1.5*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	drawSVGobj(svg, "line", {x1: paddingLeft+2.5*dx, x2: paddingLeft+2.5*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	drawSVGobj(svg, "text", {transform:"translate(" + (paddingLeft+1*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "PheRS-B&alpha;");
			drawSVGobj(svg, "text", {transform:"translate(" + (paddingLeft+1.1*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "PheRS-B&beta;");
			drawSVGobj(svg, "text", {transform:"translate(" + (paddingLeft+1.2*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "PheRS-A&beta;");
			drawSVGobj(svg, "text", {transform:"translate(" + (paddingLeft+1.3*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "PheRS-M");
			drawSVGobj(svg, "text", {transform:"translate(" + (paddingLeft+1.4*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "PylRS");
			drawClass2Domain(paddingLeft+1.5*dx, ym*dy, svg, motifColBase, highlightColBase, "SepRS", {hairpin: true, gates: true, HP: true, insertName: "O"});
			drawClass2Domain(paddingLeft+2.5*dx, ym*dy, svg, motifColBase,  highlightColBase,"PheRS-A&alpha;", {hairpin: true, gates: true, HP: true, insertName: "P"});

			ym = 6;
			
			// Hairpin 2
			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: 7.9*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} ); 
			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft+3.2*dx, y1: ym*dy, y2: ym*dy, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawSVGobj(svg, "text", {x: paddingLeft + 2*CATALYTIC_DOMAIN_FONT_SIZE, y: ym*dy - CATALYTIC_DOMAIN_FONT_SIZE/2, style: "font-size:" + titleFontSize + "px; text-anchor:start; dominant-baseline:central;"}, "Subclass IIa");
			drawClass2Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "+Hairpin 2", {box: true, hairpin: true, gates: true, hairpin2: true, highlight: "hairpin2"});
			 drawSVGobj(svg, "line", {x1: paddingLeft+1*dx, x2: paddingLeft+1*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	 drawSVGobj(svg, "line", {x1: paddingLeft+1.1*dx, x2: paddingLeft+1.1*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			 drawSVGobj(svg, "line", {x1: paddingLeft+1.2*dx, x2: paddingLeft+1.2*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	 drawSVGobj(svg, "line", {x1: paddingLeft+2.2*dx, x2: paddingLeft+2.2*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	 drawSVGobj(svg, "line", {x1: paddingLeft+3.2*dx, x2: paddingLeft+3.2*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	 drawSVGobj(svg, "text", {transform:"translate(" + (paddingLeft+1*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "SerRS");
			 drawSVGobj(svg, "text", {transform:"translate(" + (paddingLeft+1.1*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "ProRS-A");
	    	 drawClass2Domain(paddingLeft+1.2*dx, ym*dy, svg, motifColBase,  highlightColBase,"ProRS-B", {hairpin: true, gates: true, hairpin2: true, L7: true, insertName: "P"});
			 drawClass2Domain(paddingLeft+2.2*dx, ym*dy, svg, motifColBase,   highlightColBase,"SerRS-A", {hairpin: true, gates: true, hairpin2: true, HP: true, insertName: "S"});
			
			
			
			// Nested: GlyRS
			drawSVGobj(svg, "line", {x1: (paddingLeft+3.2*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2), x2: (paddingLeft+3.2*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2), y1: ym*dy, y2: 7.9*dy + CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawClass2Domain(paddingLeft+3.2*dx, ym*dy, svg, motifColBase,  highlightColBase, "+GlyRS IM", {box: true, highlight: "glyrs" , hairpin: true, gates: true, hairpin2: true, G1: true, L4: true, insertName: "G"});
	    	

			// ThrRS / HisRS
			ym = 7.9;
			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft+1.1*dx, y1: ym*dy, y2: ym*dy, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawClass2Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "+ThrRS IM", {box:true, highlight: "thrrs", hairpin: true, gates: true, hairpin2: true, thrIM: true, insertName: "T"});
			drawSVGobj(svg, "line", {x1: paddingLeft+1*dx, x2: paddingLeft+1*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawSVGobj(svg, "line", {x1: paddingLeft+1.1*dx, x2: paddingLeft+1.1*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawSVGobj(svg, "text", {transform:"translate(" + (paddingLeft+1*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "ThrRS");
			drawClass2Domain(paddingLeft+1.1*dx, ym*dy, svg, motifColBase, highlightColBase, "HisRS", {hairpin: true, gates: true, hairpin2: false, thrIM: true, hisIM: true, insertName: "H"});


			// GlyRS-E
			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE +2.1*dx, x2: paddingLeft+3.2*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawSVGobj(svg, "line", {x1: paddingLeft+2.1*dx + CATALYTIC_DOMAIN_FONT_SIZE, x2: paddingLeft+2.1*dx  + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawClass2Domain(paddingLeft+2.1*dx, ym*dy, svg, motifColBase,  highlightColBase, "GlyRS-E", {hairpin: true, gates: true, hairpin2: true, G1: true, L4: true, HP2: true, insertName: "G"});
	    	drawSVGobj(svg, "text", {transform:"translate(" + (paddingLeft+3.2*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "GlyRS-A");
	    	*/
			


	    }
	   
	}


  }








function drawClass1Domain(startX, startY, svg, motifColBase, highlightColBase, title = null, features = {}, includeText=false){




	let groupFig = $(drawSVGobj(svg, "g", {} ));

  	// Top and bottom layers
	let bottomLayer = $(drawSVGobj(groupFig, "g", {style:""} )); 
	let topLayer = $(drawSVGobj(groupFig, "g", {style:""} )); 



	let ypadding = CATALYTIC_DOMAIN_YPAD;
	let xpadding = CATALYTIC_DOMAIN_XPAD;
	let domainHeight = CATALYTIC_DOMAIN_HEIGHT;
	let domainWidth = CATALYTIC_DOMAIN_WIDTH;

	let isRightAligned = features.align != null && features.align == "right"; 


	let startYEff = startY;
	let startXEff = startX + 1*xpadding;


	

	let isSmall = features.small != null && features.small == true; 
	if (isSmall){
		 ypadding = ypadding*0.5;
		 xpadding = xpadding*0.4;
		 domainHeight = domainHeight*0.55;
		 domainWidth = domainWidth*0.6;


		 startYEff = startY - domainHeight/2;
		 startXEff = startX;

		 includeText = false;

		 if (isRightAligned){
		 	startX = startX - 0.8*domainWidth;
		 	startXEff = startX + 1*xpadding;
		 }

	}else{

		if (isRightAligned){
		 	startXEff = startX + 1*xpadding;
		 }

	}




	


	let json = null;

    let helixCol = "url(#helixGradient)";
    let strandCol = "url(#strandGradient)";
    let motifCol = "url(#motifGradient)";
    let highlightCol = "url(#highlightGradient)";
    let helixBgCol  = "url(#helixBackgroundGradient)";
    let strandBgCol  = "url(#strandBackgroundGradient)";
	let IMcol = INSERTION_MODULE_COL;
	
	if (features.highlight != null){
		helixCol = "#ffffff";
		strandCol = helixCol;
		motifCol = helixCol;
		motifColBase = "black";
		helixBgCol  = helixCol;
		strandBgCol  = helixBgCol;
		IMcol = helixCol;
	}


      // Ele width and height
    let nElementsHorizontal = 9;
    let nElementsVertical = 3;
    let eleWidth = (domainWidth-xpadding) / (nElementsHorizontal+1) - xpadding;
    


    let isProtozyme = features.protozyme != null && features.protozyme == true;
    let isUrzyme = features.urzyme != null && features.urzyme == true;
    let islysRS = features.lysRS != null && features.lysRS == true;
    let hasZ = features.Z != null && features.Z == true;
    let hasSC1b = features.sc1b != null && features.sc1b == true;
    let hasSC1a = features.sc1a != null && features.sc1a == true;
    let iStart = 0;
    let iStop = 10;
    if (isProtozyme){
    	iStart = 0;
    	iStop = 3;
    }else if (isUrzyme){
    	iStart = 0;
    	iStop = 7;
    }else if (hasZ){
    	iStart = 0;
    	iStop = 13;
    }




    if (!isProtozyme && !isUrzyme){
    	startYEff = startYEff - 2*ypadding;
    }

    if (hasSC1a){
    	startYEff = startYEff + 1*ypadding;
    }



    // Draw box around
    let xMin = 1e10;
    let xMax = 0;



	let eleHeight = (domainHeight-4*ypadding);



	// Name?
	if (features.name != null){
		let xlab = startX + domainWidth/2;
		let ylab = startY + domainHeight;
		if (hasSC1b){
			ylab = ylab + CATALYTIC_DOMAIN_FONT_SIZE/3;
		}
		if (hasSC1a){
			ylab = ylab + 0.5*eleHeight + CATALYTIC_DOMAIN_FONT_SIZE/3;
		}
		let fontSize = CATALYTIC_DOMAIN_FONT_SIZE*0.8;
		drawSVGobj(svg, "text", {x: xlab, y: ylab, style: "font-size:" + fontSize + "px; text-anchor:middle; dominant-baseline:central; "}, features.name);
	}



  	// 4 parallel strands and 3 helices
	let odd = true;
	let oddLoop = false;
	for (let i = iStart; i <= iStop ; i++){
		  
	  
		
		let x = xpadding + (xpadding+eleWidth)*i + startXEff;
	    let y = ypadding*2 + startYEff;


	    if (!isProtozyme && !isUrzyme){
		    if (i <= 7){
		    	y = y + eleHeight + 2*ypadding;
		    	if (hasSC1b) y += 1*ypadding;
		    	if (hasSC1a) y += 0.5*eleHeight;
		    	
		    }else{
		    	x = xpadding + (xpadding+eleWidth)*(i-7) + startXEff;
		    	odd = false;
		    	oddLoop = true;
		    }
		}


		if (hasSC1a && i >=4 && i <= 7){
			x = x + (xpadding+eleWidth)*2;
		}

	
	 // Loop
	if (i <= 10 || (hasZ)){
		let nr = i;
		if (i == 4) nr = 1;
		if (i == 3) nr = 2;
		if (i == 2) nr = 3;
		if (i == 1) nr = 4;
		if (i == 0) nr = 5;
		let eleName = "L" + nr;
		
		let xMid = x;
		let yLoop = y;
		let endPoint, control1, control2 = [];
		let ylab = y;
		let xlab = x;
		let onTop = false;

		let xStraight = xMid;
		let yStraight1 = yLoop;
		let yStraight2 = yLoop - 2*ypadding;
		let loopWidth = CATALYTIC_DOMAIN_LOOP_WIDTH;
		
		if (i == 5) oddLoop = !oddLoop;


		let loopCol = "black";
		
		// N term
		if (i == 3){
			eleName = "N";
			yLoop = y+eleHeight;
			endPoint = [xMid, yLoop+3*ypadding/4];
			control1 = [xMid-xpadding/3, yLoop+1*(ypadding)/4];
			control2 = [xMid+xpadding/3, yLoop+2*(ypadding)/4];	
			xlab = xMid;
			ylab = yLoop+ypadding + 5;
			if (isSmall) {
				//loopWidth = loopWidth*1.5;
				endPoint[1] = yLoop+3*ypadding/2; // longer
			}

		}
		
		// C term
		else if (i == 7 || (isProtozyme && i == 0) ){

			if (i == 0) xMid = xpadding + (xpadding+eleWidth)*(i+1) + startXEff;

			eleName = "C";
			endPoint = [xMid, yLoop-3*ypadding/4];
			control1 = [xMid-xpadding/3, yLoop-1*(ypadding)/4];
			control2 = [xMid+xpadding/3, yLoop-2*(ypadding)/4];	
			xlab = xMid;
			ylab = yLoop-ypadding - 5;
			if (!isProtozyme) loopCol = motifColBase;
			if (isSmall) {
				//loopWidth = loopWidth*1.5;
				endPoint[1] = yLoop-3*ypadding/2; // longer
			}
			onTop = true;


		
		// Straight loop between S2 and H2
		}else if (i == 0 && !isUrzyme){
			xMid = xpadding + (xpadding+eleWidth)*1 + startXEff;
			xlab = xMid;
			ylab = yLoop-2*ypadding+20;
			xStraight = xMid;

			if (hasSC1b){
				yStraight2 -= ypadding;
			}

			if (hasSC1a){
				yStraight2 -= eleHeight/2;
			}
		

		// Long urzyme loop between S2 and H4
		}else if (i == 0 && isUrzyme){


			xMid = xpadding + (xpadding+eleWidth)*1 + startXEff;
			endPoint = [xMid + (xpadding+eleWidth)*3, yLoop];
			control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-2.5*ypadding];
			control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-2.5*ypadding];
			xlab = (xMid+endPoint[0])/2-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX;
			ylab = yLoop-2*ypadding+20;
			onTop = true;
			oddLoop = !oddLoop;



		// Non urzyme loop between H3 and H4
		}else if (i == 10 && !isUrzyme){
			endPoint = [xMid + xpadding+eleWidth, yLoop];
			control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-ypadding];
			control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-ypadding];
			xlab = (xMid+endPoint[0])/2-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX;
			ylab = yLoop-ypadding-3;
			onTop = true;
			xStraight = xMid + (xpadding+eleWidth);
			yStraight1 = yLoop;
			yStraight2 = ypadding*2 + startYEff + eleHeight + 2*ypadding;



		// Top large loop between S2 and H4
		}else if (i == 10){
			yLoop = y+eleHeight;
			endPoint = [xpadding + (xpadding+eleWidth)*9, yLoop];
			control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+2.5*ypadding];
			control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+2.5*ypadding];	
			ylab = yLoop+2*ypadding-20;
			xlab = (xMid+endPoint[0])/2-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX;
			oddLoop = !oddLoop;



		// Top loop
		}else if (oddLoop && i != 4 && i != 9 && i != 11){
			endPoint = [xMid + xpadding+eleWidth, yLoop];
			control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-ypadding];
			control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-ypadding];
			xlab = (xMid+endPoint[0])/2-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX;
			ylab = yLoop-ypadding-3;
			onTop = true;
		}


		// Bottom loop in long Z
		else if(i == 11 && hasSC1a) {

			yLoop = y+eleHeight*1.5;
			endPoint = [xMid + xpadding+eleWidth, yLoop];
			control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+ypadding];
			control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+ypadding];
			xlab = (xMid+endPoint[0])/2-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX;
			ylab = yLoop+ypadding+3;


		// Bottom loop
		}else{
			yLoop = y+eleHeight;
			endPoint = [xMid + xpadding+eleWidth, yLoop];
			control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+ypadding];
			control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+ypadding];
			xlab = (xMid+endPoint[0])/2-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX;
			ylab = yLoop+ypadding+3;
		}
		

		
		// Diagonal loop between Z3 and H4
		if (i == 13 && hasZ){

			let x1s = xpadding + (xpadding+eleWidth)*4 + startXEff;
			let x2s = xpadding + (xpadding+eleWidth)*6 + startXEff;

			let y1s = ypadding*2 + startYEff + eleHeight + 2*ypadding;
			let y2s = ypadding*2 + startYEff + eleHeight;

			if (hasSC1b) y1s += 1*ypadding;

			// Not diagonal anymore
			if (hasSC1a) {
				y1s += 1*eleHeight/2;
				x1s = x2s;

			}

			let group = $(drawSVGobj(onTop ? topLayer : bottomLayer, "g", {element: eleName, style:"cursor:pointer"} ));
			drawSVGobj(group, "line", {x1: x1s, x2: x2s, y1: y1s, y2: y2s, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke: black;"} );
				

		}else {

			if (!(i == 12 && hasSC1a)) {
			
				if (i > 0 || (i == 0 && isProtozyme) || (i == 0 && isUrzyme)) {
					let d = "M " + xMid + " " + yLoop  + " C " + control1[0] + " " + control1[1] + ", " + control2[0] + " " + control2[1] + ", " + endPoint[0] + " " + endPoint[1];
					let group;
					if (eleName == "N" || eleName == "C"){
						group = $(drawSVGobj(onTop ? topLayer : bottomLayer, "g", {element: eleName, style:""} )); // No click events
					}else{
						group = $(drawSVGobj(onTop ? topLayer : bottomLayer, "g", {element: eleName, style:"cursor:pointer"} ));
					}
					 drawSVGobj(group, "path", {d: d, style: "stroke-width:" + loopWidth + "px; stroke:" + loopCol + "; fill:transparent; stroke-linecap:round"} );

					 if (!isSmall){
					 	if (includeText || eleName == "N" || eleName == "C") drawSVGobj(group, "text", {x: xlab, y: ylab, style: "font-size:" + CATALYTIC_DOMAIN_FONT_SIZE + "px; text-anchor:middle; dominant-baseline:central; "}, eleName);
					 }
					}



				if ((i == 0 && !isProtozyme && !isUrzyme) || (i == 10 && !hasZ)) {

					// Straight loop between S2 and H2, or H4 and H3
					let group = $(drawSVGobj(onTop ? topLayer : bottomLayer, "g", {element: eleName, style:"cursor:pointer"} ));
					drawSVGobj(group, "line", {x1: xStraight, x2: xStraight, y1: yStraight1, y2: yStraight2, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke: black;"} );
					

				}

			}



		}



		

		// L9 C-terminal: KMSKS
		if (i == 9){
			if (includeText) drawSVGobj(group, "text", {x: xlab - CATALYTIC_DOMAIN_MOTIF_FONT_SIZE*2, y: y - CATALYTIC_DOMAIN_FONT_SIZE/2, style: "font-size:" + CATALYTIC_DOMAIN_MOTIF_FONT_SIZE + "px;  font-weight: bold; fill:" + motifColBase + "; text-anchor:middle; dominant-baseline:end; "}, "KMSKS");
		}



		// LysRS insert
		if (i == 10 && islysRS){


			let xCircle = xpadding + (xpadding+eleWidth)*(4) + startXEff;
			drawSVGobj(topLayer, "circle", {cx: xCircle, cy: yLoop+eleHeight, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + IMcol + ";"} );
			drawSVGobj(topLayer, "text", {x: xCircle, y: yLoop+eleHeight, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);
	

		}


		// Subclass 1b insert
		else if (i == 11 && hasSC1b){

			let thisCol = IMcol;
			if (features.highlight == "sc1b"){
				thisCol = highlightCol;
			}

			let loopHeight = eleHeight/3;

			let xCircle = xpadding + (xpadding+eleWidth)*(4.5) + startXEff;
			drawSVGobj(topLayer, "circle", {cx: xCircle, cy: yLoop+loopHeight, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + thisCol + ";"} );
			drawSVGobj(topLayer, "text", {x: xCircle, y: yLoop+loopHeight, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);
	
			
		}


		// Subclass 1a insert
		else if (i == 12 && hasSC1a){

			let thisCol = IMcol;
			if (features.highlight == "sc1a"){
				thisCol = highlightCol;
			}

			let loopHeight = eleHeight/3;
			let helixHeight = eleHeight/2;


			let hpx1 = xMid;
			let hpx2 = xMid + eleWidth + xpadding;
			



			// Straight loop 
			drawSVGobj(topLayer, "line", {x1: hpx1, x2: hpx1, y1: y-loopHeight, y2: y, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:black; fill:transparent; stroke-linecap:round"} );


			// Helix 1
			drawHelix(hpx1, y-loopHeight-helixHeight, helixHeight, eleWidth, (features.highlight == "sc1a" ? highlightCol : helixCol), helixBgCol, topLayer, "sc1a.1", includeText);


			// Helix 2
			drawHelix(hpx2, y-loopHeight-helixHeight, helixHeight, eleWidth, (features.highlight == "sc1a" ? highlightCol : helixCol), helixBgCol, topLayer, "sc1a.2", includeText);


			// Straight loop 
			drawSVGobj(topLayer, "line", {x1: hpx2, x2: hpx2, y1: y-loopHeight, y2: y, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:black; fill:transparent; stroke-linecap:round"} );

			// Curved loop
			yLoop = y-loopHeight-helixHeight;
			endPoint = [xMid + xpadding+eleWidth, yLoop];
			control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-ypadding];
			control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-ypadding];
			d = "M " + xMid + " " + yLoop  + " C " + control1[0] + " " + control1[1] + ", " + control2[0] + " " + control2[1] + ", " + endPoint[0] + " " + endPoint[1];
			drawSVGobj(topLayer, "path", {d: d, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + "black" + "; fill:transparent; stroke-linecap:round"} );


			
		}
		




		if (i == 0) {
			if (isUrzyme) oddLoop = !oddLoop;
			continue;
		}
		oddLoop = !oddLoop;

	}
	
	
	
	
	// Helix
	if (i % 2 == 0 && i <= 10){
		
		

		var eleName = "H";
		

		let group = $(drawSVGobj(bottomLayer, "g", {element: eleName, style:"cursor:pointer"} ));
		let helixY = y;
		let eleHeightHelix = eleHeight;


		let thisCol = helixCol;
		if (features.highlight == "urzyme"&& i > 3) thisCol = highlightCol;
		if (features.highlight == "cp1" && i > 7) thisCol = highlightCol;

		// Bottom circle
		drawSVGobj(group, "ellipse", {cx: x, cy: helixY+eleHeightHelix, rx: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, ry: CATALYTIC_DOMAIN_HELIX_CORNER_RADIUS, style: "stroke-width:0px; fill:white"} );
		drawSVGobj(group, "ellipse", {cx: x, cy: helixY+eleHeightHelix, rx: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, ry: CATALYTIC_DOMAIN_HELIX_CORNER_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + thisCol} );
	

		// Rectangle
		drawSVGobj(group, "rect", {x: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, y: helixY, width: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP, height: eleHeightHelix, style: "stroke-width:0px; fill:white"} );
		drawSVGobj(group, "rect", {x: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, y: helixY, width: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP, height: eleHeightHelix, style: "stroke-width:0px; fill:" + thisCol} );
		




		// HIGH motif on H1
		if (i == 2){

			thisCol = motifCol;
			if (features.highlight == "urzyme" && i > 4) thisCol = highlightCol;
			if (features.highlight == "cp1" && i > 7) thisCol = highlightCol;



			//drawSVGobj(group, "rect", {rx: CATALYTIC_DOMAIN_HELIX_CORNER_RADIUS, x: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, y: helixY, width: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP, height: eleHeightHelix/4, style: "stroke-width:0px; fill:" + motifCol + "; stroke:black"} );
			//drawSVGobj(group, "rect", {rx: CATALYTIC_DOMAIN_HELIX_CORNER_RADIUS, x: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, y: helixY, width: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP, height: eleHeightHelix/4, style: "stroke-width:1px; stroke:black; fill:transparent"} );
			

			// Bottom circle
			drawSVGobj(group, "ellipse", {cx: x, cy: helixY+eleHeightHelix/4, rx: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, ry: CATALYTIC_DOMAIN_HELIX_CORNER_RADIUS, style: "stroke-width:0px; fill:white"} );
			drawSVGobj(group, "ellipse", {cx: x, cy: helixY+eleHeightHelix/4, rx: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, ry: CATALYTIC_DOMAIN_HELIX_CORNER_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + thisCol} );
	
			// Rectangle
			drawSVGobj(group, "rect", {x: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, y: helixY, width: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP, height: eleHeightHelix/4, style: "stroke-width:0px; fill:white"} );
			drawSVGobj(group, "rect", {x: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, y: helixY, width: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP, height: eleHeightHelix/4, style: "stroke-width:0px; fill:" + thisCol} );
			

			// Text
			if (includeText) drawSVGobj(group, "text", {x: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2 - CATALYTIC_DOMAIN_FONT_SIZE/2, y: y - CATALYTIC_DOMAIN_FONT_SIZE/2, style: "font-size:" + CATALYTIC_DOMAIN_MOTIF_FONT_SIZE + "px; text-anchor:middle; dominant-baseline:end; font-weight:bold; fill:" + motifColBase + "; "}, "HIGH");



		}


		// Rect border lines
		drawSVGobj(group, "line", {x1: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, x2: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, y1: helixY, y2: helixY+eleHeightHelix, style: "stroke-width:1px; stroke: black;"} );
		drawSVGobj(group, "line", {x1: x+eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, x2: x+eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, y1: helixY, y2: helixY+eleHeightHelix, style: "stroke-width:1px; stroke: black;"} );

					
		// Top circle
		drawSVGobj(group, "ellipse", {cx: x, cy: helixY, rx: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, ry: CATALYTIC_DOMAIN_HELIX_CORNER_RADIUS, style: "stroke-width:0px; fill:white"} );
		drawSVGobj(group, "ellipse", {cx: x, cy: helixY, rx: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, ry: CATALYTIC_DOMAIN_HELIX_CORNER_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + helixBgCol } );
	


		// Text label
		if (includeText) drawSVGobj(group, "text", {x: x, y: helixY+eleHeightHelix/2, style: "font-size:" + CATALYTIC_DOMAIN_FONT_SIZE + "px; text-anchor:middle; dominant-baseline:central; "}, i);


		
	}
	
	
	
	// Strand
	else if (i % 2 == 1 || i == 12){
		
		let yStrand = y;
		let strandHeight = eleHeight;
		x = x - CATALYTIC_DOMAIN_ARROW_BG_WIDTH/2;

		let thisCol = strandCol;
		if (features.highlight == "urzyme" && i > 4) thisCol = highlightCol;
		if (features.highlight == "cp1" && i > 7) thisCol = highlightCol;
		if (features.highlight == "Z" && i > 10) thisCol = highlightCol;


		if (hasSC1a && (i == 11 || i == 12)){
			strandHeight = eleHeight*1.5;
		}

		
		let group = $(drawSVGobj(bottomLayer, "g", {style:""} ));
		let strandObj = drawStrandVertical(x, yStrand, strandHeight, eleWidth, (i == 12 ? !odd : odd), thisCol, strandBgCol, motifCol, group, "S", includeText);


		// Highlight the extended strands
		if (hasSC1a && i == 11 && features.highlight == "sc1a"){
			drawStrandVertical(x, yStrand+eleHeight, strandHeight-eleHeight, eleWidth, odd, highlightCol, strandBgCol, highlightCol, group, "S", includeText);
		}
		// Highlight the extended strands
		if (hasSC1a && i == 12 && features.highlight == "sc1a"){
			drawSVGobj(group, "rect", {x: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, y: yStrand+eleHeight, width: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP, height: strandHeight-eleHeight, style: "stroke-width:0px; fill:" + highlightCol} );
		}

		xMin = Math.min(xMin, strandObj.x1);
		xMax = Math.max(xMax, strandObj.x2);

	
	}


	
	odd = !odd;
	  
	  
  }



	// Title
	if (title != null && title != ""){


		let startYCylinder = startY + 5;

		let tx = startX + CATALYTIC_DOMAIN_FONT_SIZE/2;
		let ty = startYCylinder + domainHeight/2;


		// Box
		let titleFontSize = CATALYTIC_DOMAIN_FONT_SIZE*0.8;
		if (features.box != null && features.box == true){
			titleFontSize = CATALYTIC_DOMAIN_FONT_SIZE;


			// Cylinder

			drawSVGobj(bottomLayer, "ellipse", {cx: tx, rx: 0.75*CATALYTIC_DOMAIN_FONT_SIZE, cy: startYCylinder+domainHeight, ry: 5, height: domainHeight, style: "fill:" + highlightCol + "; stroke:black; stroke-width:" +  0 + "px"});
			drawSVGobj(bottomLayer, "rect", {x: tx - 3*CATALYTIC_DOMAIN_FONT_SIZE/4, width: 1.5*CATALYTIC_DOMAIN_FONT_SIZE, y: startYCylinder, height: domainHeight, style: "fill:white; stroke-width:0px"});
			drawSVGobj(bottomLayer, "rect", {x: tx - 3*CATALYTIC_DOMAIN_FONT_SIZE/4, width: 1.5*CATALYTIC_DOMAIN_FONT_SIZE, y: startYCylinder, height: domainHeight, style: "fill:" + highlightCol + "; stroke:black; stroke-width:0px"});
			drawSVGobj(bottomLayer, "ellipse", {cx: tx, rx: 0.75*CATALYTIC_DOMAIN_FONT_SIZE, cy: startYCylinder, ry: 5, height: domainHeight, style: "fill:" + highlightCol + "; stroke:black; stroke-width:" +  0 + "px"});
			

			drawSVGobj(bottomLayer, "text", {transform:"translate(" + tx + ", " + ty + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; fill:#eee; text-anchor:middle; dominant-baseline:central;"}, title);
		}else{
			drawSVGobj(bottomLayer, "text", {transform:"translate(" + tx + ", " + (startYCylinder + 2*ypadding) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, title);
		}

	
	}


		
		let svgCoords = {x: xMin - xpadding, y: startY-ypadding, width: xMax - xMin + 2*xpadding, height: domainHeight + 2*ypadding};
    //$(groupFig).css("transform", "translate(" + (svgCoords.x - startX) + ", " + 0 + ")");
    return svgCoords;



}



function drawClass2Domain(startX, startY, svg, motifColBase, highlightColBase, title = null, features = {}, includeText=false){


	let groupFig = $(drawSVGobj(svg, "g", {} ));

  	// Top and bottom layers
		let bottomLayer = $(drawSVGobj(groupFig, "g", {style:""} )); 
		let topLayer = $(drawSVGobj(groupFig, "g", {style:""} )); 



		let ypadding = CATALYTIC_DOMAIN_YPAD;
	let xpadding = CATALYTIC_DOMAIN_XPAD;
	let domainHeight = CATALYTIC_DOMAIN_HEIGHT;
	let domainWidth = CATALYTIC_DOMAIN_WIDTH;

	let isRightAligned = features.align != null && features.align == "right"; 


	let startYEff = startY;
	let startXEff = startX + 1*xpadding;


	

	let isSmall = features.small != null && features.small == true; 
	if (isSmall){
		 ypadding = ypadding*0.5;
		 xpadding = xpadding*0.4;
		 domainHeight = domainHeight*0.55;
		 domainWidth = domainWidth*0.6;


		 startYEff = startY - domainHeight/2;
		 startXEff = startX + xpadding*4;

		 includeText = false;


		 if (isRightAligned){
		 	startX = startX - 0.8*domainWidth;
		 	startXEff = startX + 1*xpadding;
		 }

	}else{

		if (isRightAligned){
		 	startXEff = (startX - 1.05*domainWidth) + 1*xpadding;
		 }

	}



		let json = null;

    let helixCol = "url(#helixGradient)";
    let strandCol = "url(#strandGradient)";
    let motifCol = "url(#motifGradient)";
    let highlightCol = "url(#highlightGradient)";
    let helixBgCol  = "url(#helixBackgroundGradient)";
    let strandBgCol  = "url(#strandBackgroundGradient)";
	let IMcol = INSERTION_MODULE_COL;
	
	if (features.highlight != null){
		helixCol = "#ffffff";
		strandCol = helixCol;
		motifCol = helixCol;
		motifColBase = "black";
		helixBgCol  = helixCol;
		strandBgCol  = helixBgCol;
		IMcol = helixCol;
	}


      // Ele width and height
    let nElementsHorizontal = 9;
    let nElementsVertical = 3;
    let eleWidth = (domainWidth-xpadding) / (nElementsHorizontal+1) - xpadding;
    


    let isProtozyme = features.protozyme != null && features.protozyme == true;
    let isUrzyme = features.urzyme != null && features.urzyme == true;
    let hasHairpin = features.hairpin != null && features.hairpin == true;
	let hasHairpin2 = features.hairpin2 != null && features.hairpin2 == true;
    let hasgates = features.gates != null && features.gates == true;
    let L6insert = features.L6 != null && features.L6 == true;
	let L7insert = features.L7 != null && features.L7 == true;
	let HPinsert = hasHairpin && features.HP != null && features.HP == true;
	let HP2insert = hasHairpin2 && features.HP2 != null && features.HP2 == true;
	let G1insert = hasgates && features.G1 != null && features.G1 == true;
	let L4insert = features.L4 != null && features.L4 == true;
	let L8insert = features.L8 != null && features.L8 == true;
	let thrIM = features.thrIM != null && features.thrIM == true;
	let hisIM = features.hisIM != null && features.hisIM == true;
	let s2bInsert = features.s2b != null && features.s2b == true;
	let s2bInsertInsert = s2bInsert && features.s2bInsertInsert != null && features.s2bInsertInsert == true;
    let iStart = 0;
    let iStop = 9;
    if (isProtozyme){
    	iStart = 2;
    	iStop = 4;
    }else if (isUrzyme){
    	iStart = 2;
    	iStop = 6;
    }

    if (hasHairpin) startYEff += 2*ypadding;
    if (hasgates) startYEff += 2*ypadding;
	if (G1insert)  startYEff += 1*ypadding;
    // Draw box around
    let xMin = 1e10;
    let xMax = 0;



    if (hasHairpin){
    	startYEff = startYEff - 2*ypadding;
    }

    if (hasgates){
    	startYEff = startYEff - 2*ypadding;
    }

    // Name?
	if (features.name != null){
		let xlab = startX + domainWidth/4;
		let ylab = startY + domainHeight;
		let fontSize = CATALYTIC_DOMAIN_FONT_SIZE*0.8;
		drawSVGobj(svg, "text", {x: xlab, y: ylab, style: "font-size:" + fontSize + "px; text-anchor:middle; dominant-baseline:central; "}, features.name);
	}



      // 6 antiparallel strands and 3 helices
      let odd = false;
	  	let oddLoop = false;
    for (let i = iStart; i <= iStop ; i++){

				let eleHeight = (domainHeight-4*ypadding);

        let x = xpadding + (xpadding+eleWidth)*(i) + startXEff;
        let y = ypadding*2 + startYEff;
		


		// Loop
		if (i <= 9){
			
			
			let nr = i;
			if (i == 5) nr = 8;
			if (i == 6) nr = 7;
			if (i == 7) nr = 6;
			if (i == 8) nr = 5;
			
			let eleName = "L" + nr;
			let xMid = x;
			let yLoop = y;
			

			let endPoint, control1, control2 = [];
			let ylab = y;
			let xlab = x;
			let onTop = false;

			let pathCol = "black";
			
			
			let bigLoopHeightRel = 2.5;
			

			// N term
			if (i == 0){
				eleName = "N";
				yLoop = y+eleHeight;
				xMid = xpadding + (xpadding+eleWidth)*1  + startXEff;
				endPoint = [xMid, yLoop+3*ypadding/4];
				control1 = [xMid-xpadding/3, yLoop+1*(ypadding)/4];
				control2 = [xMid+xpadding/3, yLoop+2*(ypadding)/4];	
				xlab = xMid;
				ylab = yLoop+ypadding + 5;

				if (isSmall) {
					endPoint[1] = yLoop+3*ypadding/2; // longer
				}
			}


			// N term protozyme/urzyme
			else if ((isProtozyme || isUrzyme) && i == iStop){
				eleName = "N";
				yLoop = y;
				pathCol = motifColBase;
				xMid = xpadding + (xpadding+eleWidth)*2 + startXEff;
				endPoint = [xMid, yLoop-3*ypadding/4];
				control1 = [xMid-xpadding/3, yLoop-1*(ypadding)/4];
				control2 = [xMid+xpadding/3, yLoop-2*(ypadding)/4];	
				xlab = xMid;
				ylab = yLoop-ypadding - 5;
				onTop = true;

				if (isSmall) {
					endPoint[1] = yLoop+3*ypadding/2; // longer
				}


			}
			
			// C term
			else if (i == 9){
				eleName = "C";
				yLoop = y;
				xMid = xpadding + (xpadding+eleWidth)*5 + startXEff;
				endPoint = [xMid, yLoop-3*ypadding/4];
				control1 = [xMid-xpadding/3, yLoop-1*(ypadding)/4];
				control2 = [xMid+xpadding/3, yLoop-2*(ypadding)/4];	
				xlab = xMid;
				ylab = yLoop-ypadding - 5;
				onTop = true;
				if (isSmall) {
					endPoint[1] = yLoop-3*ypadding/2; // longer
				}
				
			}

			// C term protozyme
			else if ((isProtozyme || isUrzyme) && i == iStop-1){
				eleName = "C";
				yLoop = y;
				xMid = xpadding + (xpadding+eleWidth)*i + startXEff;
				endPoint = [xMid, yLoop-3*ypadding/4];
				control1 = [xMid-xpadding/3, yLoop-1*(ypadding)/4];
				control2 = [xMid+xpadding/3, yLoop-2*(ypadding)/4];	
				xlab = xMid;
				ylab = yLoop-ypadding - 5;
				onTop = true;
				
			}

			
			// Long loop from S2 to H3
			else if (i == 4 && !isUrzyme){
				yLoop = y+eleHeight;
				endPoint = [xpadding + (xpadding+eleWidth)*9  + startXEff, yLoop];
				if (hasgates || L6insert) bigLoopHeightRel = 3.5;
				if (hasHairpin2 || thrIM) bigLoopHeightRel = 6;
				control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+bigLoopHeightRel*ypadding];
				control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+bigLoopHeightRel*ypadding];	
				ylab = yLoop+2*ypadding-20;
				xlab = (xMid+endPoint[0])/2-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX ;
				oddLoop = !oddLoop;

				
			}
			
			
			// Standard odd loop (top)
			else if (oddLoop){
				endPoint = [xMid + xpadding+eleWidth, yLoop];
				control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-ypadding];
				control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-ypadding];
				xlab = (xMid+endPoint[0])/2-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX;
				ylab = yLoop-ypadding-3;
				onTop = true;
			}
			
			// Standard even loop (bottom)
			else{
				yLoop = y+eleHeight;
				endPoint = [xMid + xpadding+eleWidth, yLoop];
				control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+ypadding];
				control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+ypadding];
				xlab = (xMid+endPoint[0])/2-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX;
				ylab = yLoop+ypadding+3;


			}
			

			// Start and stop positions in alignment
			let eleStart = json == null ? -1 : json["median_" + eleName + ".start"];
			let eleStop = json == null ? -1 : json["median_" + eleName + ".end"];
			if (eleStart == null) eleStart = -1;
			if (eleStop == null) eleStop = -1;
			
			let d = "M " + xMid + " " + yLoop  + " C " + control1[0] + " " + control1[1] + ", " + control2[0] + " " + control2[1] + ", " + endPoint[0] + " " + endPoint[1];
			let group;
			if (eleName == "N" || eleName == "C"){
				group = $(drawSVGobj(onTop ? topLayer : bottomLayer, "g", {element: eleName, style:""} )); // No click events
			}else {
				group = $(drawSVGobj(onTop ? topLayer : bottomLayer, "g", {element: eleName, start:eleStart, end:eleStop, style:""} ));
			}


			// L1 is motif 1
			if (eleName == "L1"){
				pathCol = motifColBase;
				if (includeText) drawSVGobj(group, "text", {x: xlab, y: yLoop, style: "font-size:" + CATALYTIC_DOMAIN_MOTIF_FONT_SIZE + "px; text-anchor:middle; dominant-baseline:central; font-weight:bold; fill:" + motifColBase + "; "}, "M1");
			}
			

						
			if (features.highlight == "urzyme" && eleName == "L4"){
				pathCol = highlightColBase;
			}
			
			// Highlight col
			if (features.highlight == "6fold"){
				if (eleName == "L5" || eleName == "L6" || eleName == "L7" || eleName == "L8") pathCol = highlightCol;
			}


	
			if (eleName == "L1" && hasHairpin){


					// Draw a hairpin instead of a loop
					let hpx1 = x;
					let hpx2 = xpadding + (xpadding+eleWidth)*(i+1) + startXEff;



					let loopHeight = eleHeight / 4;
					let strandHeight = eleHeight / 2;

					// Gate 1? 
					let gateHeight = 0;
					let loopGateHeight = 0;
					if (hasgates){

						gateHeight = strandHeight;
						loopGateHeight = loopHeight;


						// Straight loop 
						drawSVGobj(group, "line", {x1: hpx1, x2: hpx1, y1: y-loopGateHeight, y2: y, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + motifColBase + "; fill:transparent; stroke-linecap:round"} );


						// Kinked helix
						drawHelix(hpx1, y-loopGateHeight-gateHeight, gateHeight, eleWidth, (features.highlight == "gates" ? highlightCol : helixCol), helixBgCol, group, "Gate1", includeText);


						// Insert after gate 1
						if (G1insert){
							loopHeight += 2*INSERTION_MODULE_RADIUS;
							
							let icol = IMcol;
							if (features.highlight == "glyrs"){
								icol = highlightCol;
							}
							
							let xCircle = hpx1;
							drawSVGobj(topLayer, "circle", {cx: xCircle, cy: y-loopGateHeight-gateHeight-loopHeight/2, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + icol + ";"} );
							drawSVGobj(topLayer, "text", {x: xCircle, y: y-loopGateHeight-gateHeight-loopHeight/2, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);

						}

					}

					let hairpinColMotifBase = motifColBase;
					let hairpinColMotif = motifCol;
					let hairpinColNorm = "black";
					let hairpinColStrandNorm = strandCol;
					
					if (features.highlight == "hairpin1"){
						hairpinColNorm = highlightColBase;
						hairpinColStrandNorm = highlightCol;
					}

					// Straight loop 1
					drawSVGobj(group, "line", {x1: hpx1, x2: hpx1, y1: y-gateHeight-loopGateHeight, y2: y-loopHeight-gateHeight-loopGateHeight, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + (hasgates ? "black" : hairpinColMotifBase) + "; fill:transparent; stroke-linecap:round"} );

					// Strand 1
					drawStrandVertical(hpx1, y-loopHeight-strandHeight-gateHeight-loopGateHeight, strandHeight, eleWidth, true, hairpinColStrandNorm, strandBgCol, hairpinColMotif, group, "HP1")

					// Curved loop
					yLoop = y-loopHeight-strandHeight-gateHeight-loopGateHeight;
					endPoint = [xMid + xpadding+eleWidth, yLoop];
					control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-ypadding];
					control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-ypadding];
					d = "M " + xMid + " " + yLoop  + " C " + control1[0] + " " + control1[1] + ", " + control2[0] + " " + control2[1] + ", " + endPoint[0] + " " + endPoint[1];
					drawSVGobj(group, "path", {d: d, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + hairpinColNorm + "; fill:transparent; stroke-linecap:round"} );
		

					// Strand 2
					drawStrandVertical(hpx2, y-loopHeight-strandHeight-gateHeight-loopGateHeight, strandHeight, eleWidth, false, hairpinColStrandNorm, strandBgCol, motifCol, group, "HP1")

					// Straight loop 2
					drawSVGobj(group, "line", {x1: hpx2, x2: hpx2, y1: y-gateHeight-loopGateHeight-loopHeight, y2: y, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + hairpinColNorm + "; fill:transparent; stroke-linecap:round"} );
			
	
			
					// Hairpin insert
					if (HPinsert){
						let xCircle = (hpx1+hpx2) / 2
						drawSVGobj(group, "circle", {cx: xCircle, cy: yLoop-ypadding*0.8, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + IMcol + ";"} );
						drawSVGobj(group, "text", {x: xCircle, y: yLoop-ypadding*0.8, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);
					}

			} 

			else if (eleName == "L8" && hasgates){

				let gate2x = xpadding + (xpadding+eleWidth)*(i+1) + startXEff;
				let gateHeight = eleHeight / 2;
				
				
				// Draw gate 2
				drawHelix(gate2x, y+eleHeight, gateHeight, eleWidth, (features.highlight == "gates" ? highlightCol : helixCol), helixBgCol, bottomLayer, "Gate2", includeText);

				let loopHeight = 0;
				let strandHeight = 0;
				if (hasHairpin2){
					
					let hpx1 = x;
					let hpx2 = gate2x;

					
					loopHeight = eleHeight / 4;
					strandHeight = eleHeight / 2;

					// Strand 1
					drawStrandVertical(hpx1, y+eleHeight+gateHeight+loopHeight, strandHeight, eleWidth, true, (features.highlight == "hairpin2" ? highlightCol : strandCol), strandBgCol, motifCol, group, "HP2")

					// Strand 2
					drawStrandVertical(hpx2, y+eleHeight+gateHeight+loopHeight, strandHeight, eleWidth, false, (features.highlight == "hairpin2" ? highlightCol : strandCol), strandBgCol, motifCol, topLayer, "HP2")


					// Straight loop
					drawSVGobj(group, "line", {x1: gate2x, x2: gate2x, y1: y+eleHeight+gateHeight, y2: y+eleHeight+gateHeight+loopHeight, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + (hasgates ? "black" : motifColBase) + "; fill:transparent; stroke-linecap:round"} );

					
				}


				// Curved loop
				xMid = x;
				yLoop = y+eleHeight+gateHeight+loopHeight+strandHeight;
				endPoint = [xMid + xpadding+eleWidth, yLoop];
				control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+ypadding];
				control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+ypadding];
				d = "M " + xMid + " " + yLoop  + " C " + control1[0] + " " + control1[1] + ", " + control2[0] + " " + control2[1] + ", " + endPoint[0] + " " + endPoint[1];
				drawSVGobj(group, "path", {d: d, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + "black" + "; fill:transparent; stroke-linecap:round"} );
		

				// Straight loop 2
				drawSVGobj(bottomLayer, "line", {x1: x, x2: x, y1: y+eleHeight, y2: yLoop-strandHeight, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + "black" + "; fill:transparent; stroke-linecap:round"} );
			
			
				
				if (HP2insert){
					
					let xCircle = xpadding + (xpadding+eleWidth)*(i+0.5) + startXEff;
					drawSVGobj(topLayer, "circle", {cx: xCircle, cy: yLoop+ypadding*0.8, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + IMcol + ";"} );
					drawSVGobj(topLayer, "text", {x: xCircle, y: yLoop+ypadding*0.8, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, "g");

				}



			}

			else if (eleName == "L5" && s2bInsert){


				let helixHeight = eleHeight / 2;
				let loopHeight = eleHeight / 4;

				let hx1 = x;
				let hx2 = xpadding + (xpadding+eleWidth)*(i+1) + startXEff;


				// Straight loop 1
				drawSVGobj(group, "line", {x1: hx1, x2: hx1, y1: y, y2: y-loopHeight, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + "black" + "; fill:transparent; stroke-linecap:round"} );


				// Helix 1
				drawHelix(hx1, y-loopHeight-helixHeight, helixHeight, eleWidth, (features.highlight == "sc2b" ? highlightCol : helixCol), helixBgCol, group, "s2b", includeText);


				// Straight loop 2
				drawSVGobj(group, "line", {x1: hx2, x2: hx2, y1: y, y2: y-loopHeight, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + "black" + "; fill:transparent; stroke-linecap:round"} );


				// Helix 2
				drawHelix(hx2, y-loopHeight-helixHeight, helixHeight, eleWidth, (features.highlight == "sc2b" ? highlightCol : helixCol), helixBgCol, group, "s2b", includeText);
		

				// Curved loop
				yLoop = y-loopHeight-helixHeight;
				endPoint = [xMid + xpadding+eleWidth, yLoop];
				control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-ypadding];
				control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-ypadding];
				d = "M " + xMid + " " + yLoop  + " C " + control1[0] + " " + control1[1] + ", " + control2[0] + " " + control2[1] + ", " + endPoint[0] + " " + endPoint[1];
				drawSVGobj(group, "path", {d: d, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + "black" + "; fill:transparent; stroke-linecap:round"} );
	



				if (s2bInsertInsert){

					let xCircle = (hx1+hx2)/2;
					drawSVGobj(topLayer, "circle", {cx: xCircle, cy: y-loopHeight-helixHeight-ypadding*0.8, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + IMcol + ";"} );
					drawSVGobj(topLayer, "text", {x: xCircle, y: y-loopHeight-helixHeight-ypadding*0.8, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);
			

				}


			}


		
			else if (eleName == "L6" && thrIM) {
				
				let helixX = xpadding + (xpadding+eleWidth)*(i+1) + startXEff;
				let loopHeight = eleHeight / 4;
				let strandHeight = eleHeight / 2;
				
				
				if (hisIM){
					loopHeight *= 4;
				}
				
				// Loop 1
				drawSVGobj(bottomLayer, "line", {x1: x, x2: x, y1: y+eleHeight+loopHeight, y2: y+eleHeight, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + "black" + "; fill:transparent; stroke-linecap:round"} );
			
				
				// Strand
				drawStrandVertical(x, y+eleHeight+loopHeight, strandHeight, eleWidth, true, (features.highlight == "thrrs" ? highlightCol : strandCol), strandBgCol, motifCol, group, "HP1")
				
				// Helix
				drawHelix(helixX, y+eleHeight+loopHeight, strandHeight, eleWidth, (features.highlight == "thrrs" ? highlightCol : helixCol), helixBgCol, bottomLayer, "Gate2", includeText);
		
		
				// Loop 2
				drawSVGobj(bottomLayer, "line", {x1: helixX, x2: helixX, y1: y+eleHeight+loopHeight, y2: y+eleHeight, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + "black" + "; fill:transparent; stroke-linecap:round"} );
			
			
				// Curved loop
				yLoop = y+eleHeight+loopHeight+strandHeight;
				endPoint = [xMid + xpadding+eleWidth, yLoop];
				control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+ypadding];
				control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+ypadding];
				d = "M " + xMid + " " + yLoop  + " C " + control1[0] + " " + control1[1] + ", " + control2[0] + " " + control2[1] + ", " + endPoint[0] + " " + endPoint[1];
				drawSVGobj(group, "path", {d: d, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + "black" + "; fill:transparent; stroke-linecap:round"} );
		
				// HisRS insertion
				if (hisIM){
					let xCircle = helixX;
					drawSVGobj(topLayer, "circle", {cx: xCircle, cy: y+eleHeight+loopHeight/2, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + IMcol + ";"} );
					drawSVGobj(topLayer, "text", {x: xCircle, y: y+eleHeight+loopHeight/2, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);
			
				}
		
			
				
			}
			
			else{
				drawSVGobj(group, "path", {d: d, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + pathCol + "; fill:transparent; stroke-linecap:round"} );
			
			}


			if (!isSmall){
				if (includeText || eleName == "N" || eleName == "C") {
					drawSVGobj(group, "text", {x: xlab, y: ylab, style: "font-size:" + CATALYTIC_DOMAIN_FONT_SIZE + "px; text-anchor:middle; dominant-baseline:central; "}, eleName);
				}
			}
	


			// Insertion module
			if ((eleName == "L6" && L6insert) || (eleName == "L8" && L8insert)){
				

				let insertName = eleName == "L6" ? features.insertName : "B";
				
				let icol = IMcol;
				if (eleName == "L8" && features.highlight == "sc2b"){
					icol = highlightCol;
				}

				let xCircle = xpadding + (xpadding+eleWidth)*(i+0.5) + startXEff;
				drawSVGobj(group, "circle", {cx: xCircle, cy: yLoop+ypadding*0.8, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + icol + ";"} );
				drawSVGobj(group, "text", {x: xCircle, y: yLoop+ypadding*0.8, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, insertName);
			

			}else if (eleName == "L4" && L4insert){
				
				let icol = IMcol;
				if (features.highlight == "glyrs"){
					icol = highlightCol;
				}
				
				let xCircle = xpadding + (xpadding+eleWidth)*(6.5) + startXEff;
				drawSVGobj(group, "circle", {cx: xCircle, cy: yLoop+bigLoopHeightRel*ypadding*0.75, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + icol + ";"} );
				drawSVGobj(group, "text", {x: xCircle, y: yLoop+bigLoopHeightRel*ypadding*0.75, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);
			
			
			}else if (eleName == "L7" && L7insert) {
				let xCircle = xpadding + (xpadding+eleWidth)*(i+0.5) + startXEff;
				drawSVGobj(group, "circle", {cx: xCircle, cy: yLoop-ypadding*0.8, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + IMcol + ";"} );
				drawSVGobj(group, "text", {x: xCircle, y: yLoop-ypadding*0.8, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);
			}


			if ((isProtozyme || isUrzyme) && i == iStop){
				break;
			}
		
			
		}
	

		let group;




		// Strand
		if (i > 2 && i < 9){

			x = x - CATALYTIC_DOMAIN_ARROW_BG_WIDTH/2;
			let yStrand = y;
			
			// The final short strand
			if (i == 5){
				eleHeight = eleHeight/2;
				yStrand = ypadding*2 + eleHeight + startYEff;
			}


			// Strand nr
			let nr = i-2;
			if (i == 6) nr = 5;
			if (i == 7) nr = 4;
			if (i == 8) nr = 3;
			let eleName = "S" + nr;

			let thisCol = strandCol;
			
			
			 // Special case: SH1 
			  if (i == 5){
				thisCol = motifCol;
				eleName = "";
			  }

			
			if (features.highlight == "urzyme" && (eleName == "S2" || i == 5)){
				thisCol = highlightCol;
			}


		  
      group = $(drawSVGobj(bottomLayer, "g", {element: eleName,  style:""} ));
	  
	  
	  if (features.highlight == "6fold"){
		if (eleName == "S3" || eleName == "S4" || eleName == "S5") thisCol = highlightCol;
		}


      		let strandObj = drawStrandVertical(x, yStrand, eleHeight, eleWidth, odd, thisCol, strandBgCol, motifCol, group, eleName, includeText);

			xMin = Math.min(xMin, strandObj.x1);
			xMax = Math.max(xMax, strandObj.x2);
		
		}

		
		
		
		// Helix
		if (i > 0 && i < 10 && (i <= 2 || i == 5 || i == 9)){
			
				let helixY = y;
				let eleHeightHelix = eleHeight;
				let thisCol = helixCol;
				let bgCol = helixBgCol;

				
				let nr = i;
				if (i == 5) nr = 4;
				if (i == 9) nr = 3;
				let eleName = "H" + nr;

				// Special case: SH1
				if (i == 5){
					eleName = "SH1";
					thisCol = motifCol;
					//bgCol = motifCol;
					group = group;


					// Motif 3 label
					if (includeText) drawSVGobj(group, "text", {x: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/3 - CATALYTIC_DOMAIN_MOTIF_FONT_SIZE, y: helixY+eleHeightHelix, style: "font-size:" + CATALYTIC_DOMAIN_MOTIF_FONT_SIZE + "px; text-anchor:middle; dominant-baseline:central; font-weight:bold; fill:" + motifColBase + "; "}, "M3");
					
					if (features.highlight == "urzyme"){
						thisCol = highlightCol;
					}


				}else{

					let eleStart = json == null ? -1 : json["median_" + eleName + ".start"];
					let eleStop = json == null ? -1 : json["median_" + eleName + ".end"];
					if (eleStart == null) eleStart = -1;
					if (eleStop == null) eleStop = -1;
					

					group = $(drawSVGobj(bottomLayer, "g", {element: eleName, start: eleStart, end: eleStop, style:""} ));
					


				}
				
				
				if (features.highlight == "6fold"){
					if (eleName == "H1" || eleName == "H3") thisCol = highlightCol;
				}

				let helixObj = drawHelix(x, helixY, eleHeightHelix, eleWidth, thisCol, bgCol, group, eleName, includeText);

				xMin = Math.min(xMin, helixObj.x1);
				xMax = Math.max(xMax, helixObj.x2);


			
		}
		
		
		oddLoop = !oddLoop;
		odd = !odd;
		

    }



    // Rectangle around
   //drawSVGobj(bottomLayer, "rect", {x: xMin - xpadding, y: startY-ypadding, width: xMax - xMin + 2*xpadding, height: domainHeight + 2*ypadding, style: "fill:transparent; stroke:black; stroke-width: 1px"});
	

	// Title
	if (title != null && title != ""){


		let startYCylinder = startY + 5;
		
		let tx = startX + CATALYTIC_DOMAIN_FONT_SIZE/2;
		let ty = startYCylinder + domainHeight/2;


		// Box
		let titleFontSize = CATALYTIC_DOMAIN_FONT_SIZE*0.8;
		if (features.box != null && features.box == true){
			titleFontSize = CATALYTIC_DOMAIN_FONT_SIZE;


			// Cylinder

			drawSVGobj(bottomLayer, "ellipse", {cx: tx, rx: 0.75*CATALYTIC_DOMAIN_FONT_SIZE, cy: startYCylinder+domainHeight, ry: 5, height: domainHeight, style: "fill:" + highlightCol + "; stroke:black; stroke-width:" +  0 + "px"});
			drawSVGobj(bottomLayer, "rect", {x: tx - 3*CATALYTIC_DOMAIN_FONT_SIZE/4, width: 1.5*CATALYTIC_DOMAIN_FONT_SIZE, y: startYCylinder, height: domainHeight, style: "fill:white; stroke-width:0px"});
			drawSVGobj(bottomLayer, "rect", {x: tx - 3*CATALYTIC_DOMAIN_FONT_SIZE/4, width: 1.5*CATALYTIC_DOMAIN_FONT_SIZE, y: startYCylinder, height: domainHeight, style: "fill:" + highlightCol + "; stroke:black; stroke-width:0px"});
			drawSVGobj(bottomLayer, "ellipse", {cx: tx, rx: 0.75*CATALYTIC_DOMAIN_FONT_SIZE, cy: startYCylinder, ry: 5, height: domainHeight, style: "fill:" + highlightCol + "; stroke:black; stroke-width:" +  0 + "px"});
			

			drawSVGobj(bottomLayer, "text", {transform:"translate(" + tx + ", " + ty + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; fill:#eee; text-anchor:middle; dominant-baseline:central;"}, title);
		}else{
			drawSVGobj(bottomLayer, "text", {transform:"translate(" + tx + ", " + (startYCylinder + 2*ypadding) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, title);
		}

	
	}



		
		let svgCoords = {x: xMin - xpadding, y: startY-ypadding, width: xMax - xMin + 2*xpadding, height: domainHeight + 2*ypadding};
    //$(groupFig).css("transform", "translate(" + (svgCoords.x - startX) + ", " + 0 + ")");
    return svgCoords;

}




function drawTip(svg, x, y, up=true, right=true){

	let titleFontSize = CATALYTIC_DOMAIN_FONT_SIZE*0.8;




	let d = "M " + x + " " + y + " C " + (x+LEAF_CONTROL_POINTS[0]*(right ? 1 : -1)) + " " + (y+LEAF_CONTROL_POINTS[1]*(up ? -1 : 1)) + ", " + (x+LEAF_CONTROL_POINTS[2]*(right ? 1 : -1)) + " " + (y+LEAF_CONTROL_POINTS[3]*(up ? -1 : 1)) + ", " + (x+LEAF_LENGTH*(right ? 1 : -1)) + " " + (y+(up ? -LEAF_DY : LEAF_DY));
	
	drawSVGobj(svg, "path", {d: d, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black; fill: transparent"});
	

	// Arrowhead
	let dx = right ? 1 : -1;
	drawSVGobj(svg, "line", {x1:  (x+LEAF_LENGTH*(right ? 1 : -1)), x2:  dx + (x+LEAF_LENGTH*(right ? 1 : -1)), y1: y+(up ? -LEAF_DY : LEAF_DY), y2: y+(up ? -LEAF_DY : LEAF_DY), marker_end:"url(#" + (right ? "arrowheadRight" : "arrowheadLeft") + ")", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    


}






  function drawSVGobj(svg, type, attr, val = null){

    //console.log("attr", attr);
    var newObj = document.createElementNS('http://www.w3.org/2000/svg', type);


    for (var a in attr){
      if (a == "text_anchor") newObj.setAttribute("text-anchor", attr[a]);
      else if (a == "stop_color") newObj.setAttribute("stop-color", attr[a]);
      else if (a == "marker_end") newObj.setAttribute("marker-end", attr[a]);
      else if (a == "alignment_baseline") newObj.setAttribute("alignment-baseline", attr[a]);
      else if (a == "stroke_dasharray") newObj.setAttribute("stroke-dasharray", attr[a]);
      else newObj.setAttribute(a, attr[a]);
    }
    if (val != null) newObj.innerHTML = val;
    newObj.setAttribute("animatable", "true");


    // Set some of the styles as attributes because safari and IE do not like styles for svgs
    var styles = getComputedStyle(newObj);
    //if (styles.fill != null) newObj.setAttribute("fill", styles.fill);
    if (styles.stroke != null) newObj.setAttribute("stroke", styles.stroke);
    if (styles["stroke-width"] != null) newObj.setAttribute("stroke-width", styles["stroke-width"]);
    //console.log(styles["stroke-width"]);

    //window.requestAnimationFrame(function() {
    svg.append(newObj);
    $(newObj).hide().fadeIn(0); 
    
    
    
    
    return newObj;

  } 




		function drawHelix(x, helixY, eleHeightHelix, eleWidth, thisCol, bgCol, group, eleName, includeText = false){



				// Cylinder

				// Bottom circle
				drawSVGobj(group, "ellipse", {cx: x, cy: helixY+eleHeightHelix, rx: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, ry: CATALYTIC_DOMAIN_HELIX_CORNER_RADIUS, style: "stroke-width:0px; fill:white"} );
				drawSVGobj(group, "ellipse", {cx: x, cy: helixY+eleHeightHelix, rx: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, ry: CATALYTIC_DOMAIN_HELIX_CORNER_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + thisCol} );
			

				// Rectangle
				drawSVGobj(group, "rect", {x: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, y: helixY, width: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP, height: eleHeightHelix, style: "stroke-width:0px; fill:white"} );
				drawSVGobj(group, "rect", {x: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, y: helixY, width: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP, height: eleHeightHelix, style: "stroke-width:0px; fill:" + thisCol} );
				

				// Rect border lines
				drawSVGobj(group, "line", {x1: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, x2: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, y1: helixY, y2: helixY+eleHeightHelix, style: "stroke-width:1px; stroke: black;"} );
				drawSVGobj(group, "line", {x1: x+eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, x2: x+eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, y1: helixY, y2: helixY+eleHeightHelix, style: "stroke-width:1px; stroke: black;"} );
				


				// Top circle
				drawSVGobj(group, "ellipse", {cx: x, cy: helixY, rx: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, ry: CATALYTIC_DOMAIN_HELIX_CORNER_RADIUS, style: "stroke-width:0px; fill:white"} );
				drawSVGobj(group, "ellipse", {cx: x, cy: helixY, rx: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, ry: CATALYTIC_DOMAIN_HELIX_CORNER_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + bgCol } );
			
				// Text label
				if (includeText) drawSVGobj(group, "text", {x: x, y: helixY+eleHeightHelix/2, style: "font-size:" + CATALYTIC_DOMAIN_FONT_SIZE + "px; text-anchor:middle; dominant-baseline:central; "}, eleName);
	

				let helixObj = {x1: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, x2: x+eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2};
				return helixObj;

		}



		function drawStrandHorizontal(xStrand, yStrand, eleHeight, eleWidth, odd, thisCol, strandBgCol, motifCol, group, eleName, includeText = false){

			let x1, x2, x3, x4, xbg1, xbg2, xbg3;

			

			
			if (odd){

			  // Right to left
			  x1 = xStrand+eleHeight;
			  xbg1 = x1 - CATALYTIC_DOMAIN_ARROW_BG_WIDTH;
			  x2 = xStrand+CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_1;
			  x3 = xStrand+CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_2;
			  x4 = xStrand;
			  xbg2 = x4 - CATALYTIC_DOMAIN_ARROW_BG_WIDTH;
			  xbg3 = x3 - CATALYTIC_DOMAIN_ARROW_BG_WIDTH;


			}else{


			  // Left to right
			  x1 = xStrand+CATALYTIC_DOMAIN_ARROW_BG_WIDTH;
			  xbg1 = xStrand - CATALYTIC_DOMAIN_ARROW_BG_WIDTH;
			  x2 = xStrand+eleHeight-CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_1;
			  x3 = xStrand+eleHeight-CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_2;
			  x4 = xStrand+eleHeight;
			  xbg2 = x4 - CATALYTIC_DOMAIN_ARROW_BG_WIDTH;
			  xbg3 = x3 - CATALYTIC_DOMAIN_ARROW_BG_WIDTH;

			}


			let points =    	(x1) + "," + (yStrand-eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2);
				points += " " + (x2) + "," + (yStrand-eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2);
				points += " " + (x3) + "," + (yStrand-eleWidth/2);
				points += " " + x4 + "," + yStrand;
				points += " " + (x3) + "," + (yStrand+eleWidth/2);
				points += " " + (x2) + "," + (yStrand+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2);
				points += " " + (x1) + "," + (yStrand+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2);




			// Background of arrow side
			let pointsBG =    (x1) + "," + (yStrand+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2);
			pointsBG += " " + (xbg1) + "," + (yStrand+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2 + CATALYTIC_DOMAIN_ARROW_BG_WIDTH);
			pointsBG += " " + (x2) + "," + (yStrand+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2 + CATALYTIC_DOMAIN_ARROW_BG_WIDTH);
			pointsBG += " " + (x2) + "," + (yStrand+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2);
			drawSVGobj(group, "polygon", {points: pointsBG, style: "stroke-width:1px; stroke:black; fill:" + strandBgCol} )


			// Background of arrow head
			pointsBG =    (x4) + "," + (yStrand);
			pointsBG += " " + (xbg2) + "," + (yStrand + CATALYTIC_DOMAIN_ARROW_BG_WIDTH);
			pointsBG += " " + (xbg3) + "," + (yStrand+eleWidth/2 + CATALYTIC_DOMAIN_ARROW_BG_WIDTH);
			pointsBG += " " + (x3+(odd ? 1 : 0) ) + "," + (yStrand+eleWidth/2+(odd ? 1 : 0));
			drawSVGobj(group, "polygon", {points: pointsBG, style: "stroke-width:1px; stroke:black; fill:" + strandBgCol} )
			

			if (!odd){

				// Top of arrow (the rectangular base)
				pointsBG =    (x1) + "," + (yStrand+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2);
				pointsBG += " " + (xbg1) + "," + (yStrand+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2 + CATALYTIC_DOMAIN_ARROW_BG_WIDTH);
				pointsBG += " " + (xbg1) + "," + (yStrand-eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2 + CATALYTIC_DOMAIN_ARROW_BG_WIDTH);
				pointsBG += " " + (x1) + "," + (yStrand-eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2);
				drawSVGobj(group, "polygon", {points: pointsBG, style: "stroke-width:1px; stroke:black; fill:" + strandBgCol} )

			}


			// Arrow
			drawSVGobj(group, "polygon", {points: points, style: "stroke-width:1px; stroke:black; fill:white"} )
			drawSVGobj(group, "polygon", {points: points, style: "stroke-width:1px; stroke:black; fill:" + thisCol} )


		}


		function drawStrandVertical(x, yStrand, eleHeight, eleWidth, odd, thisCol, strandBgCol, motifCol, group, eleName, includeText = false){

				let y1, y2, y3, y4, ybg1, ybg2, ybg3;
				if (odd){

				  // Up arrow
				  y1 = yStrand+eleHeight;
				  ybg1 = y1 - CATALYTIC_DOMAIN_ARROW_BG_WIDTH;
				  y2 = yStrand+CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_1;
				  y3 = yStrand+CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_2;
				  y4 = yStrand;
				  ybg2 = y4 - CATALYTIC_DOMAIN_ARROW_BG_WIDTH;
				  ybg3 = y3 - CATALYTIC_DOMAIN_ARROW_BG_WIDTH;


				}else{

				  // Down arrow
				  y1 = yStrand+CATALYTIC_DOMAIN_ARROW_BG_WIDTH;
				  ybg1 = yStrand - CATALYTIC_DOMAIN_ARROW_BG_WIDTH;
				  y2 = yStrand+eleHeight-CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_1;
				  y3 = yStrand+eleHeight-CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_2;
				  y4 = yStrand+eleHeight;
				  ybg2 = y4 - CATALYTIC_DOMAIN_ARROW_BG_WIDTH;
				  ybg3 = y3 - CATALYTIC_DOMAIN_ARROW_BG_WIDTH;

				}


				let points =    (x-eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2) + "," + (y1);
				points += " " + (x-eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2) + "," + (y2);
				points += " " + (x-eleWidth/2) + "," + (y3);
				points += " " + x + "," + y4;
				points += " " + (x+eleWidth/2) + "," + (y3);
				points += " " + (x+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2) + "," + (y2);
				points += " " + (x+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2) + "," + (y1);



				// Background of arrow side
				let pointsBG =    (x+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2) + "," + (y1);
				pointsBG += " " + (x+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2 + CATALYTIC_DOMAIN_ARROW_BG_WIDTH) + "," + (ybg1);
				pointsBG += " " + (x+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2 + CATALYTIC_DOMAIN_ARROW_BG_WIDTH) + "," + (y2);
				pointsBG += " " + (x+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2) + "," + (y2);
				drawSVGobj(group, "polygon", {points: pointsBG, style: "stroke-width:1px; stroke:black; fill:" + strandBgCol} )


				// Background of arrow head
				pointsBG =    (x) + "," + (y4);
				pointsBG += " " + (x + CATALYTIC_DOMAIN_ARROW_BG_WIDTH) + "," + (ybg2);
				pointsBG += " " + (x+eleWidth/2 + CATALYTIC_DOMAIN_ARROW_BG_WIDTH) + "," + (ybg3);
				pointsBG += " " + (x+eleWidth/2+(odd ? 1 : 0)) + "," + (y3+(odd ? 1 : 0) );
				drawSVGobj(group, "polygon", {points: pointsBG, style: "stroke-width:1px; stroke:black; fill:" + strandBgCol} )
				

				if (!odd){

					// Top of arrow (the rectangular base)
					pointsBG =    (x+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2) + "," + (y1);
					pointsBG += " " + (x+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2 + CATALYTIC_DOMAIN_ARROW_BG_WIDTH) + "," + (ybg1);
					pointsBG += " " + (x-eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2 + CATALYTIC_DOMAIN_ARROW_BG_WIDTH) + "," + (ybg1);
					pointsBG += " " + (x-eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2) + "," + (y1);
					drawSVGobj(group, "polygon", {points: pointsBG, style: "stroke-width:1px; stroke:black; fill:" + strandBgCol} )

				}

				// Arrow
				drawSVGobj(group, "polygon", {points: points, style: "stroke-width:1px; stroke:black; fill:white"} )
				drawSVGobj(group, "polygon", {points: points, style: "stroke-width:1px; stroke:black; fill:" + thisCol} )



				// S1 is motif 2
				if (eleName == "S1"){


					let S2_y1 = yStrand+3*eleHeight/4;

					let pointsS2 =    (x-eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2) + "," + (S2_y1);
					pointsS2 += " " + (x-eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2) + "," + (y2);
					pointsS2 += " " + (x-eleWidth/2) + "," + (y3);
					pointsS2 += " " + x + "," + y4;
					pointsS2 += " " + (x+eleWidth/2) + "," + (y3);
					pointsS2 += " " + (x+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2) + "," + (y2);
					pointsS2 += " " + (x+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2) + "," + (S2_y1);


					drawSVGobj(group, "polygon", {points: pointsS2, style: "stroke-width:0px; fill:white"} )
					drawSVGobj(group, "polygon", {points: pointsS2, style: "stroke-width:0px; fill:" + motifCol} )
					drawSVGobj(group, "polygon", {points: points, style: "stroke-width:1px; stroke:black; fill:transparent"} )
					if (includeText) drawSVGobj(group, "text", {x: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/3 - CATALYTIC_DOMAIN_MOTIF_FONT_SIZE, y: yStrand+eleHeight/2, style: "font-size:" + CATALYTIC_DOMAIN_MOTIF_FONT_SIZE + "px; text-anchor:middle; dominant-baseline:central; font-weight:bold; fill:" + motifColBase + "; "}, "M2");
		

				}


				if (includeText) drawSVGobj(group, "text", {x: x, y: yStrand+eleHeight/2, style: "font-size:" + CATALYTIC_DOMAIN_FONT_SIZE + "px; text-anchor:middle; dominant-baseline:central; "}, eleName);


		

				let strandObj = {x1: x-eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2, x2: x+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2};
				return strandObj;
					
		}


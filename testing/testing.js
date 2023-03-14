
SVG_WIDTH = 2000;
SVG_HEIGHT = 1600;

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
CATALYTIC_DOMAIN_FONT_SIZE = 24;
ELEMENT_DOMAIN_FONT_SIZE = 16;
CATALYTIC_DOMAIN_ARROW_BG_WIDTH = 0.5;

RO_PADDING = 225;

CLASS1_PADDING = 400;
CLASS2_PADDING = 900;

NUMBER_BASE_PAIRS = 7;

INSERTION_MODULE_COL = "black";
INSERTION_MODULE_RADIUS = 7;
INSERTION_MODULE_FONT_SIZE = 16;



LEAF_LENGTH = 50;
LEAF_DY = 60;
TALL_LEAF_MODIFIER = 2;
LEAF_CONTROL_POINTS = [LEAF_LENGTH*0.15, LEAF_DY*0.9, LEAF_LENGTH*0.9, LEAF_DY*1];

URZYME_ARROW_CONTROL_POINTS = [RO_PADDING*0.1, 3*CATALYTIC_DOMAIN_YPAD*0.4, RO_PADDING*0.95, 3*CATALYTIC_DOMAIN_YPAD*0.5];


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
    let arrowheadLeft = $(drawSVGobj(defs, "marker", {id: "arrowheadLeft", markerWidth: 9, markerHeight: 9,  refX: "3.5", refY: "3.5"} ));
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




	// Bidirectional basepairing
	for (let bp = 1; bp <= NUMBER_BASE_PAIRS; bp++){


	    	let x0 = CLASS1_PADDING + RO_PADDING;
	    	let x1 = CLASS2_PADDING - RO_PADDING;
	    	let y = bp/NUMBER_BASE_PAIRS * CATALYTIC_DOMAIN_HEIGHT;


	    	// Protozyme base pairs
			drawSVGobj(svg, "line", {x1: x0, x2: x1, y1: y, y2: y, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:#696969"} );


			// Urzyme base pairs
			y += dy;
			drawSVGobj(svg, "line", {x1: x0, x2: x1, y1: y, y2: y, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:#696969"} );
			 



	}



    for (let classNr = 1; classNr <= 2; classNr++){

	    if (classNr == 1){




	    	let paddingLeft = CLASS1_PADDING;
	    	let paddingLeftRO = paddingLeft + RO_PADDING;


    	 	// Class name
	    	drawSVGobj(svg, "text", {x:paddingLeftRO - 2*CATALYTIC_DOMAIN_WIDTH/5, y: CATALYTIC_DOMAIN_HEIGHT/2, style: "font-size:" + CATALYTIC_DOMAIN_FONT_SIZE*1.2 + "px; text-anchor:end; dominant-baseline:central;"}, "Class I");
	    	



	    	// Protozyme
	    	let ym = 0;
			drawSVGobj(svg, "line", {x1: paddingLeftRO + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeftRO + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: 0, y2: 1*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	drawClass1Domain(paddingLeftRO, 0, svg, motifColBase, highlightColBase, "Protozyme", {align: "right", box: true, protozyme: true});
			 


			// Urzyme
	    	ym = 1;
			//drawSVGobj(svg, "line", {x1: paddingLeftRO + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy+CATALYTIC_DOMAIN_HEIGHT, y2: 2*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    		
	    	// Curvy arrow
	    	let urzymeX1 = paddingLeftRO + CATALYTIC_DOMAIN_FONT_SIZE/2;
	    	let urzymeY1 = ym*dy+CATALYTIC_DOMAIN_HEIGHT;
	    	let urzymeX2 = paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2;
	    	let urzymeY2 = 2*dy;
			let dUrzyme = "M " + urzymeX1 + " " + urzymeY1 + " C " + (urzymeX1-URZYME_ARROW_CONTROL_POINTS[0]) + " " + (urzymeY1+URZYME_ARROW_CONTROL_POINTS[1]) + ", " + (urzymeX1-URZYME_ARROW_CONTROL_POINTS[2]) + " " + (urzymeY1+URZYME_ARROW_CONTROL_POINTS[3]) + ", " + urzymeX2 + " " + urzymeY2;
			drawSVGobj(svg, "path", {d: dUrzyme, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black; fill: transparent"});
			

			drawClass1Domain(paddingLeftRO, ym*dy, svg, motifColBase, highlightColBase, "Urzyme", {align: "right", box: true, urzyme: true, highlight: "urzyme"});
			



	    	ym = 2;

			// Subclass 1c: TrpRS, TyrRS
			let trpY = (ym+0.03)*dy;
			let trpX = paddingLeft-0.2*dx;
			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: trpX, y1: trpY, y2: trpY, marker_end:"url(#arrowheadLeft)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawSVGobj(svg, "text", {x:trpX+CATALYTIC_DOMAIN_FONT_SIZE/2, y: trpY - 4*CATALYTIC_DOMAIN_FONT_SIZE/4, style: "font-size:" + titleFontSize + "px; text-anchor:start; dominant-baseline:central;"}, "1c");
	    	//drawTip(svg, trpX, trpY, true, false);
	    	//drawTip(svg, trpX, trpY, false, false);
	    	drawClass1Domain(trpX, trpY - CATALYTIC_DOMAIN_HEIGHT*1.7, svg, motifColBase, highlightColBase, "", {align: "right", box: false, large: true, bold: true, name: "TrpRS and TyrRS"});
	    	//drawClass1Domain(trpX-LEAF_LENGTH, trpY+LEAF_DY, svg, motifColBase, highlightColBase, "", {align: "right", box: false, small: true, name: "TrpRS-A and -B"});



	    	// LysRS-I
	    	let lysY = (ym+0.3)*dy + LEAF_DY;
	    	let lysX = paddingLeft-0.2*dx;
	    	drawSVGobj(svg, "text", {x:lysX+CATALYTIC_DOMAIN_FONT_SIZE/2, y: lysY - 4*CATALYTIC_DOMAIN_FONT_SIZE/4, style: "font-size:" + titleFontSize + "px; text-anchor:start; dominant-baseline:central;"}, "1d");
	    	drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: lysX, y1: lysY, y2: lysY, marker_end:"url(#arrowheadLeft)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawClass1Domain(lysX, lysY, svg, motifColBase, highlightColBase, "", {align: "right", box: false, small: true,  lysRS: true, insertName: "1", name: "LysRS-I"});



			// +CP1
			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: 3.3*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	drawClass1Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "+ CP1", {box: true, highlight: "cp1"});


	    	// +Z: ArgRS
	    	ym = 3.3;



	    	// ArgRS
	    	let argY = (ym+0.1)*dy;
	    	let argX = paddingLeft-0.8*dx - LEAF_LENGTH;
	    	drawSVGobj(svg, "text", {x:argX+CATALYTIC_DOMAIN_FONT_SIZE/2, y: argY - 4*CATALYTIC_DOMAIN_FONT_SIZE/4, style: "font-size:" + titleFontSize + "px; text-anchor:start; dominant-baseline:central;"}, "1e");
	    	drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: argX, y1: argY, y2: argY, marker_end:"url(#arrowheadLeft)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawClass1Domain(argX, argY- CATALYTIC_DOMAIN_HEIGHT*0.3, svg, motifColBase, highlightColBase, "", {align: "right", box: false, small: true, Z: true, name: "ArgRS"});



			// CysRS
			let cysY = (ym+0.65)*dy;
	    	let cysX = paddingLeft-0.2*dx;
	    	drawSVGobj(svg, "text", {x:cysX+CATALYTIC_DOMAIN_FONT_SIZE/2, y: cysY - 4*CATALYTIC_DOMAIN_FONT_SIZE/4, style: "font-size:" + titleFontSize + "px; text-anchor:start; dominant-baseline:central;"}, "1f");
	    	drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: cysX, y1: cysY, y2: cysY, marker_end:"url(#arrowheadLeft)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawClass1Domain(cysX, cysY- CATALYTIC_DOMAIN_HEIGHT*0.3, svg, motifColBase, highlightColBase, "", {align: "right", box: false, small: true, Z: true, Z2insert: true, insertName: "2", name: "CysRS"});


			// Gln, glu, glx
			let glnY = (ym+1)*dy;
			let glnX = paddingLeft-0.8*dx;
			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: glnX, y1: glnY, y2: glnY, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawSVGobj(svg, "text", {x:glnX-CATALYTIC_DOMAIN_FONT_SIZE*0.5, y: glnY, style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "1b");
	    	drawTip(svg, glnX, glnY, true, false);
	    	drawTip(svg, glnX, glnY, false, false);
	    	drawClass1Domain(glnX-LEAF_LENGTH, glnY-LEAF_DY, svg, motifColBase, highlightColBase, "", {align: "right", box: false, Z: true, sc1b: true, small: true, insertName: "3", name: "GluRS"});
	    	drawClass1Domain(glnX-LEAF_LENGTH, glnY+LEAF_DY, svg, motifColBase, highlightColBase, "", {align: "right", box: false, Z: true, sc1b: true, small: true, insertName: "3", name: "GlnRS and GlxRS"});


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
	    	drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: 5.8*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	drawClass1Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "+ CP2", {box: true, Z: true, sc1a: true, highlight: "sc1a"});




	    	// Editing domain
			ym = 5.8;


			// LeuRS-A
	    	let leuAY = (ym+0.2)*dy;
	    	let leuAX = paddingLeft-0.2*dx;
	    	drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: leuAX, y1: leuAY, y2: leuAY, marker_end:"url(#arrowheadLeft)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawClass1Domain(leuAX, leuAY, svg, motifColBase, highlightColBase, "", {align: "right", box: false, small: true, Z: true, sc1a: true, editing: true, Z3insert: true, insertName: "4", name: "LeuRS-A"});


			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: 8*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawClass1Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "+ Editing", {box: true, Z: true, sc1a: true, editing: true, highlight: "editing"});
	    	


	    	// CP3 insert
	    	ym = 8;


			// ValRS and IleRS
			let valY = (ym+0.2)*dy;
	    	let valX = paddingLeft-0.4*dx;
	    	drawSVGobj(svg, "line", {x1: valX, x2: paddingLeft, y1: valY, y2: valY, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawTip(svg, valX, valY, false, false);
			drawTip(svg, valX, valY, true, false);

			drawClass1Domain(valX-LEAF_LENGTH - 3*CATALYTIC_DOMAIN_XPAD, valY - LEAF_DY - CATALYTIC_DOMAIN_YPAD, svg, motifColBase, highlightColBase, "", {align: "right", box: false, small: true, Z: true, sc1a: true, editing: false, Z3insert: true, Z2insert: true, kmsksInsert: true, insertName: "E", name: "LeuRS-B"});
			drawClass1Domain(valX-LEAF_LENGTH - 3*CATALYTIC_DOMAIN_XPAD, valY + LEAF_DY + CATALYTIC_DOMAIN_YPAD, svg, motifColBase, highlightColBase, "", {align: "right", box: false, small: true, Z: true, sc1a: true, editing: true, Z3insert: true, Z2insert: false, name: "IleRS and ValRS"});



	    	drawClass1Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "+ CP3", {box: true, Z: true, sc1a: true, editing: true, Z3insert: true, highlight: "z3insert"});
	    	


	    }

	    if (classNr == 2){




	    	let paddingLeft = CLASS2_PADDING;
	    	let paddingLeftRO = paddingLeft - RO_PADDING;
			
			
			let ym = 0;


			// Class name
	    	drawSVGobj(svg, "text", {x:paddingLeftRO + 0.45*CATALYTIC_DOMAIN_WIDTH, y: CATALYTIC_DOMAIN_HEIGHT/2, style: "font-size:" + CATALYTIC_DOMAIN_FONT_SIZE*1.2 + "px; text-anchor:start; dominant-baseline:central;"}, "Class II");
	    	

			
			 drawSVGobj(svg, "line", {x1: paddingLeftRO + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeftRO + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: 0, y2: 1*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	 drawClass2Domain(paddingLeftRO, 0, svg, motifColBase, highlightColBase, "Protozyme", {box: true, protozyme: true, align: "left"});
			 
			 
			 
			 
			 // Urzyme
			 ym = 1;


	    	// Curvy arrow
	    	let urzymeX1 = paddingLeftRO + CATALYTIC_DOMAIN_FONT_SIZE/2;
	    	let urzymeY1 = ym*dy+CATALYTIC_DOMAIN_HEIGHT;
	    	let urzymeX2 = paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2;
	    	let urzymeY2 = 2*dy;
			let dUrzyme = "M " + urzymeX1 + " " + urzymeY1 + " C " + (urzymeX1+URZYME_ARROW_CONTROL_POINTS[0]) + " " + (urzymeY1+URZYME_ARROW_CONTROL_POINTS[1]) + ", " + (urzymeX1+URZYME_ARROW_CONTROL_POINTS[2]) + " " + (urzymeY1+URZYME_ARROW_CONTROL_POINTS[3]) + ", " + urzymeX2 + " " + urzymeY2;
			drawSVGobj(svg, "path", {d: dUrzyme, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black; fill: transparent"});
			

			 //drawSVGobj(svg, "line", {x1: paddingLeftRO + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy+CATALYTIC_DOMAIN_HEIGHT, y2: 2*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			 drawClass2Domain(paddingLeftRO, ym*dy, svg, motifColBase,  highlightColBase,"Urzyme", {box: true, urzyme: true, highlight: "urzyme", align: "left"});


			 // 6 fold
			 ym = 2;

			 // Subclass 2d: AlaRS
			let alaY = (ym+0.35)*dy;
			let alaX = paddingLeft+0.2*dx;
			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: alaX, y1: alaY, y2: alaY, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawSVGobj(svg, "text", {x:alaX+CATALYTIC_DOMAIN_FONT_SIZE*1.5, y: alaY, style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "2d");
	    	drawTip(svg, alaX, alaY, true, true);
	    	drawTip(svg, alaX, alaY, false, true);
	    	drawClass2Domain(alaX+LEAF_LENGTH, alaY+LEAF_DY, svg, motifColBase, highlightColBase, "", {align: "left", box: false, small: true, L6: true, insertName: "a", name: "AlaRS"});
	    	drawClass2Domain(alaX+LEAF_LENGTH, alaY-LEAF_DY- CATALYTIC_DOMAIN_HEIGHT*1.6, svg, motifColBase, highlightColBase, "", {align: "left", box: false, large: true, bold: true, name: "GlyRS-B"});


	    	// 6 fold domain
	    	drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: 3.3*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawClass2Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "6 fold", {box: true, highlight: "6fold", align: "right"});



			 ym = 3.1


			 // Nested acid/base
			 let acidY = (ym+0.3)*dy;
			 let acidX = paddingLeft+1.6*dx;
			 drawSVGobj(svg, "text", {x:paddingLeft+0.45*dx, y: acidY - 4*CATALYTIC_DOMAIN_FONT_SIZE/4, style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "2b");
	    	 drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft+0.45*dx, y1: acidY, y2: acidY, marker_end:"url(#arrowheadRight)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			

			 // LysRS-II
			 let lysX = acidX + 0.25*dx;
			 let aspX = lysX;
			 let asnX = aspX + LEAF_LENGTH;
			 drawSVGobj(svg, "line", {x1: acidX, x2: asnX, y1: acidY, y2: acidY, marker_end:"url(#arrowheadRight)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	 drawTip(svg, lysX, acidY, true, true, true);
	    	 drawClass2Domain(lysX+LEAF_LENGTH, acidY-LEAF_DY*TALL_LEAF_MODIFIER, svg, motifColBase,  highlightColBase, "", {name: "LysRS-II", small: true, box: false, hairpin: true, s2b: true, s2bInsertInsert: true, s2bInsertInsert2: true, insertName: "k"});
			

	    	 // AspRS
			 drawTip(svg, aspX, acidY, false, true, true);
	    	 drawClass2Domain(aspX+LEAF_LENGTH, acidY+LEAF_DY*TALL_LEAF_MODIFIER, svg, motifColBase,  highlightColBase, "", {name: "AspRS", small: true, box: false, hairpin: true, s2b: true, s2bInsertInsert: true, insertName: "d"});
			

			 // AsnRS and AsxRS
	    	 drawClass2Domain(asnX, acidY, svg, motifColBase,  highlightColBase, "", {name: "AsnRS and AsxRS", small: true, box: false, hairpin: true, s2b: true});
			

	    	 // SC2b domain changes
	    	  drawClass2Domain(acidX, ym*dy, svg, motifColBase,  highlightColBase,"+SC2b IM", {box: true, hairpin: true, s2b: true, align: "right", highlight: "sc2b"});
			

			 ym = 3.3

			 // Subclass 2b with 2 twin helices
			 drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: 4.5*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			 drawClass2Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "+Dimer loop", {box: true, hairpin: true, highlight: "hairpin1", align: "right"});
	    	


	    	ym = 4.5;



	    	// HisRS
	    	let hisY = (ym+0.05)*dy;
	    	let hisX = paddingLeft+0.8*dx + LEAF_LENGTH;
	    	drawSVGobj(svg, "text", {x:hisX-CATALYTIC_DOMAIN_FONT_SIZE/2, y: hisY - 4*CATALYTIC_DOMAIN_FONT_SIZE/4, style: "font-size:" + titleFontSize + "px; text-anchor:start; dominant-baseline:central;"}, "2e");
	    	drawSVGobj(svg, "line", {x1: paddingLeft, x2: hisX, y1: hisY, y2: hisY, marker_end:"url(#arrowheadRight)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawClass2Domain(hisX, hisY - CATALYTIC_DOMAIN_HEIGHT*0.3, svg, motifColBase, highlightColBase, "", {thrIM: true, insertName: "h",align: "left", box: false, small: true, hairpin: true, gates: true, name: "HisRS"});



			// PylRS
	    	let pylY = (ym+0.65)*dy;
	    	let pylX = paddingLeft+0.2*dx;
	    	drawSVGobj(svg, "text", {x:pylX-CATALYTIC_DOMAIN_FONT_SIZE/2, y: pylY - 4*CATALYTIC_DOMAIN_FONT_SIZE/4, style: "font-size:" + titleFontSize + "px; text-anchor:start; dominant-baseline:central;"}, "2f");
	    	drawSVGobj(svg, "line", {x1: paddingLeft, x2: pylX, y1: pylY, y2: pylY, marker_end:"url(#arrowheadRight)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawClass2Domain(pylX, pylY - CATALYTIC_DOMAIN_HEIGHT*0.3, svg, motifColBase, highlightColBase, "", {align: "left", box: false, small: true, hairpin: true, gates: true, name: "PylRS"});



 			// Subclass 2c: PheRS
			let pheY = (ym+0.92)*dy;
			let pheBetaX = paddingLeft+0.8*dx;
			let sepX = pheBetaX + 0.1*dx;
			let pheArchX = sepX + 0.95*dx;
			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: pheArchX, y1: pheY, y2: pheY, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawSVGobj(svg, "text", {x:pheBetaX-CATALYTIC_DOMAIN_FONT_SIZE/2, y: pheY - 3*CATALYTIC_DOMAIN_FONT_SIZE/4, style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "2c");
	    	drawTip(svg, pheBetaX, pheY, true, true);
	    	drawClass2Domain(pheBetaX+LEAF_LENGTH, pheY-LEAF_DY, svg, motifColBase, highlightColBase, "", {align: "left", box: false, hairpin: true, gates: true, small: true, name: "PheRS &beta;"});


	    	// SepRS
	    	drawTip(svg, sepX, pheY, false, true);
	    	drawClass2Domain(sepX+LEAF_LENGTH, pheY+LEAF_DY, svg, motifColBase, highlightColBase, "", {align: "left", box: false, hairpin: true, HP: true, insertName: "o", gates: true, small: true, name: "SepRS"});


	    	// Phe alpha and M
	    	drawTip(svg, pheArchX, pheY, true, true);
	    	drawTip(svg, pheArchX, pheY, false, true);
	    	drawClass2Domain(pheArchX+LEAF_LENGTH, pheY-LEAF_DY, svg, motifColBase, highlightColBase, "", {align: "left", box: false, hairpin: true, HP: true, insertName: "f", gates: true, small: true, name: "PheRS-A&alpha;"});
	    	drawClass2Domain(pheArchX+LEAF_LENGTH, pheY+LEAF_DY, svg, motifColBase, highlightColBase, "", {align: "left", box: false, hairpin: true, gates: true, small: true, name: "PheRS-B&alpha; and -M"});


	    	drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: 5.8*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	drawClass2Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "+Gates", {box: true, hairpin: true, gates: true, highlight: "gates", align: "right"});
			


	    	// 2a
			ym = 5.8;


			// ThrRS and ProRS
			let thrY = (ym+0.7)*dy;
			let thrX = paddingLeft+0.2*dx;
			let proAX = thrX + 0.1*dx;
			let proMX = proAX + 0.9*dx;
			let proBX = proMX + 0.9*dx;
			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: proBX, y1: thrY, y2: thrY, marker_end:"url(#arrowheadRight)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	drawTip(svg, thrX, thrY, true, true);
	    	drawTip(svg, proAX, thrY, false, true);
	    	drawClass2Domain(thrX+LEAF_LENGTH, thrY-LEAF_DY, svg, motifColBase, highlightColBase, "", {thrIM: true, insertName: "t",hairpin2: true, align: "left", box: false, hairpin: true, gates: true, small: true, name: "ThrRS"});
	    	drawClass2Domain(proAX+LEAF_LENGTH, thrY+LEAF_DY, svg, motifColBase, highlightColBase, "", {align: "left",hairpin2: true, box: false, hairpin: true, gates: true, small: true, name: "ProRS-A"});

	    	// ProRS-B and -M
	    	drawTip(svg, proMX, thrY, false, true);
			drawClass2Domain(proMX+LEAF_LENGTH, thrY+LEAF_DY, svg, motifColBase, highlightColBase, "", {align: "left",hairpin2: true, box: false, hairpin: true, gates: true, small: true, name: "ProRS-M"});
			drawClass2Domain(proBX, thrY, svg, motifColBase, highlightColBase, "", {L7: true, insertName: "p", align: "left", hairpin2: true, box: false, hairpin: true, gates: true, small: true, name: "ProRS-B"});
	    	


			drawSVGobj(svg, "text", {x:paddingLeft+CATALYTIC_DOMAIN_FONT_SIZE, y: ym*dy - 1*CATALYTIC_DOMAIN_FONT_SIZE, style: "font-size:" + titleFontSize + "px; text-anchor:start; dominant-baseline:central;"}, "2a");
	    	drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: 8*dy - 18, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	drawClass2Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "+2a Hairpin", {box: true, hairpin: true, gates: true, hairpin2: true, align: "right", highlight: "hairpin2"});
			



			// SerRS-A
	    	let serAY = (ym+1.75)*dy;
	    	let serAX = paddingLeft+0.2*dx;
			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: serAX, y1: serAY, y2: serAY, marker_end:"url(#arrowheadRight)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawClass2Domain(serAX, serAY - CATALYTIC_DOMAIN_HEIGHT*0.3, svg, motifColBase, highlightColBase, "", {align: "left", box: false, small: true, hairpin: true, gates: true,  hairpin2: true, HP: true, insertName: "S", name: "SerRS-A"});



	    	// SerRS
	    	let serY = (ym+2.05)*dy;
	    	let serX = paddingLeft+1.2*dx;
			drawSVGobj(svg, "line", {x1: paddingLeft + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: serX, y1: serY, y2: serY, marker_end:"url(#arrowheadRight)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
			drawClass2Domain(serX, serY - CATALYTIC_DOMAIN_HEIGHT*0.3, svg, motifColBase, highlightColBase, "", {align: "left", box: false, small: true, hairpin: true, gates: true,  hairpin2: true, name: "SerRS"});




	    	// GlyRS insert
	    	ym = 8;



    		// GlyRS-A and -E
    		let glyY = (ym+0.3)*dy;
    		let glyX = proBX - LEAF_LENGTH;  //paddingLeft+1.9*dx;
    		drawSVGobj(svg, "line", {x1: paddingLeft, x2: glyX, y1: glyY, y2: glyY, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
	    	drawTip(svg, glyX, glyY, true, true);
	    	drawTip(svg, glyX, glyY, false, true);
	    	drawClass2Domain(glyX+LEAF_LENGTH, glyY-LEAF_DY, svg, motifColBase, highlightColBase, "", {align: "left", box: false, hairpin: true, gates: true, small: true,  hairpin2: true, L4: true, G1: true, insertName: "G", name: "GlyRS-A"});
	    	drawClass2Domain(glyX+LEAF_LENGTH, glyY+LEAF_DY, svg, motifColBase, highlightColBase, "", {align: "left", box: false, hairpin: true, gates: true, small: true, HP2: true,  hairpin2: true, L4: true, G1: true, insertName: "G", name: "GlyRS-E"});

	    	drawClass2Domain(paddingLeft, ym*dy, svg, motifColBase, highlightColBase, "+G IM", {box: true, hairpin: true, gates: true, hairpin2: true, align: "right", L4: true, G1: true, insertName: "G", highlight: "glyrs"});
			

			 /*
			


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
    let isProtozyme = features.protozyme != null && features.protozyme == true;
    let isUrzyme = features.urzyme != null && features.urzyme == true;
    let islysRS = features.lysRS != null && features.lysRS == true;
    let hasZ = features.Z != null && features.Z == true;
    let hasSC1b = features.sc1b != null && features.sc1b == true;
    let hasSC1a = features.sc1a != null && features.sc1a == true;
    let hasZ2insert = features.Z2insert != null && features.Z2insert == true;
    let hasZ3insert = features.Z3insert != null && features.Z3insert == true;
    let hasEditing = features.editing != null && features.editing == true;
    let kmsksInsert = features.kmsksInsert != null && features.kmsksInsert == true;

    let startXOrig = startX;

	let startYEff = startY;
	let startXEff = startX + 1*xpadding;


	

	let isSmall = features.small != null && features.small == true; 
	let isLarge = !isSmall && features.large != null && features.large == true; 
	if (isSmall){
		 ypadding = ypadding*0.5;
		 xpadding = xpadding*0.4;
		 domainHeight = domainHeight*0.55;
		 domainWidth = domainWidth*0.6;


		 startYEff = startY - domainHeight/2;
		 startXEff = startX;

		 includeText = false;

		 if (isRightAligned){
		 	startX = startX - 0.85*domainWidth;
		 	startXEff = startX + 1*xpadding;
		 }

	}else if (isLarge){

		console.log("large")

		ypadding = ypadding*1.2;
		xpadding = xpadding*0.5;
		domainHeight = domainHeight*1.3;
		domainWidth = domainWidth*1.4;

		includeText = true;

 		if (isRightAligned){
		 	startX = startX - 0.8*domainWidth;
		 	startXEff = startX + 1*xpadding;
		 	startYEff = startY - domainHeight/5;
		 }


	}else{

		if (isRightAligned){

			let eleWidth = (domainWidth-xpadding) / (9+1) - xpadding;
			if (isProtozyme){
				startXEff = startX - 8*eleWidth;
			}
			else if (isUrzyme){
				startXEff = startX - 15*eleWidth;
			}
			else{
				startXEff = (startX - 1*domainWidth) + 1*xpadding;
			}
		 	
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
    	startYEff = startYEff - 1.75*ypadding;
    }

    if (hasSC1a){
    	startYEff = startYEff + 1*ypadding;
    }

    if (hasZ2insert && hasSC1a){
    	startYEff = startYEff + 1*ypadding;
    }



    // Draw box around
    let xMin = 1e10;
    let xMax = 0;



	let eleHeight = (domainHeight-4*ypadding);



	// Name?
	if (features.name != null){
		
		let ylab = startY + domainHeight;
		if (hasSC1b){
			ylab = ylab + CATALYTIC_DOMAIN_FONT_SIZE/3;
		}
		if (hasSC1a){
			if (hasZ2insert){
				ylab = ylab + 0.75*eleHeight + CATALYTIC_DOMAIN_FONT_SIZE/3;
			}else{
				ylab = ylab + 0.5*eleHeight + CATALYTIC_DOMAIN_FONT_SIZE/3;
			}
			
		}


		if (isLarge){
			ylab = startY + domainHeight + ypadding*2.1;
			//xlab = xlab + xpadding*4;
		}
		let fontSize = CATALYTIC_DOMAIN_FONT_SIZE*0.8;

		let isBold = features.bold != null && features.bold == true;
		let boldness = isBold ? "font-weight: bold;" : "";
		if (isRightAligned){
			let xlab = startXOrig - xpadding*2;
			drawSVGobj(svg, "text", {x: xlab, y: ylab, style: "font-size:" + fontSize + "px; text-anchor:end; dominant-baseline:central; " + boldness}, features.name);
		}else{
			let xlab = startXOrig;
			drawSVGobj(svg, "text", {x: xlab, y: ylab, style: "font-size:" + fontSize + "px; text-anchor:start; dominant-baseline:central; " + boldness}, features.name);
		}
		
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
			if (!isProtozyme) {
				loopWidth = loopWidth * (isSmall ? 1.2 : 1.5);
				loopCol = motifColBase; // KMSKS
			}
			if (isSmall) {
				endPoint[1] = yLoop-3*ypadding/2; // longer
			}
			onTop = true;


			if (kmsksInsert){
				endPoint[1] = yLoop-eleHeight // longer
			}



		
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
					 	if (eleName == "N" || eleName == "C") drawSVGobj(group, "text", {x: xlab, y: ylab, style: "font-size:" + CATALYTIC_DOMAIN_FONT_SIZE + "px; text-anchor:middle; dominant-baseline:central; "}, eleName);
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
		if (i == 7){
			if (includeText) {
				drawSVGobj(topLayer, "text", {x: xlab + ELEMENT_DOMAIN_FONT_SIZE*2, y: y, style: "font-size:" + ELEMENT_DOMAIN_FONT_SIZE + "px;  font-weight: bold; fill:" + motifColBase + "; text-anchor:middle; dominant-baseline:start; "}, "KMSKS");
			}
		}



		// LysRS insert
		if (i == 10 && islysRS){


			let xCircle = xpadding + (xpadding+eleWidth)*(4) + startXEff;
			drawSVGobj(topLayer, "circle", {cx: xCircle, cy: yLoop+eleHeight, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + IMcol + ";"} );
			drawSVGobj(topLayer, "text", {x: xCircle, y: yLoop+eleHeight, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);
	

		}


		// C-terminal insert
		else if (i == 7 && kmsksInsert){

			let thisCol = IMcol;
			let r = INSERTION_MODULE_RADIUS* (isSmall ? 1 : 2);
			let xCircle = xMid;

			let insertName = "J";
			drawSVGobj(topLayer, "circle", {cx: xCircle, cy: yLoop-eleHeight/4, r: r, style: "stroke-width:1px; stroke:black; fill:" + thisCol + ";"} );
			drawSVGobj(topLayer, "text", {x: xCircle, y: yLoop-eleHeight/4, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, insertName);
	


		}



		// Z3 insert
		else if (i == 13 && hasZ && hasZ3insert){

			let thisCol = IMcol;
			if (features.highlight == "z3insert"){
				thisCol = highlightCol;
			}

			let r = INSERTION_MODULE_RADIUS* (isSmall ? 1 : 2);
			let xCircle = xpadding + (xpadding+eleWidth)*(6) + startXEff;

			let insertNamez3 = features.insertName == "L" ? "L" : "V";
			drawSVGobj(topLayer, "circle", {cx: xCircle, cy: yLoop+eleHeight*1.7, r: r, style: "stroke-width:1px; stroke:black; fill:" + thisCol + ";"} );
			drawSVGobj(topLayer, "text", {x: xCircle, y: yLoop+eleHeight*1.7, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, insertNamez3);
	

		}



		// Z2 insert editing domain
		else if (i == 11 && hasEditing){
			
			let thisCol = IMcol;
			let fontCol = "white";
			if (features.highlight == "editing"){
				thisCol = highlightCol;
			}else if (features.highlight != null){
				fontCol = "black";
			}
			let loopHeight = eleHeight/3;
			let cy = yLoop+loopHeight+ypadding*0.1;
			let r = INSERTION_MODULE_RADIUS* (isSmall ? 1 : 2);

			let xCircle = xpadding + (xpadding+eleWidth)*(4.5) + startXEff;
			drawSVGobj(topLayer, "circle", {cx: xCircle, cy: cy, r: r, style: "stroke-width:1px; stroke:black; fill:" + thisCol + ";"} );
			drawSVGobj(topLayer, "text", {x: xCircle, y: cy, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:" + fontCol + "; text-anchor:middle; dominant-baseline:central; "}, "E");
	


		}



		// Z2 insert
		else if (i == 12 && hasZ2insert && !hasSC1a){
			
			let thisCol = IMcol;
			let loopHeight = eleHeight/3;
			let cy = yLoop-loopHeight-ypadding*0.25;
			let r = INSERTION_MODULE_RADIUS;

			let xCircle = xpadding + (xpadding+eleWidth)*(5.5) + startXEff;
			drawSVGobj(topLayer, "circle", {cx: xCircle, cy: cy, r: r, style: "stroke-width:1px; stroke:black; fill:" + thisCol + ";"} );
			drawSVGobj(topLayer, "text", {x: xCircle, y: cy, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);
	


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


			if (hasZ2insert){
				loopHeight = eleHeight;
			}


			let hpx1 = xMid;
			let hpx2 = xMid + eleWidth + xpadding;
			



			// Straight loops
			drawSVGobj(topLayer, "line", {x1: hpx1, x2: hpx1, y1: y-loopHeight, y2: y, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:black; fill:transparent; stroke-linecap:round"} );
			drawSVGobj(topLayer, "line", {x1: hpx2, x2: hpx2, y1: y-loopHeight, y2: y, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:black; fill:transparent; stroke-linecap:round"} );


			// Helix 1
			drawHelix(hpx1, y-loopHeight-helixHeight, helixHeight, eleWidth, (features.highlight == "sc1a" ? highlightCol : helixCol), helixBgCol, topLayer, "sc1a.1", includeText);


			// Helix 2
			drawHelix(hpx2, y-loopHeight-helixHeight, helixHeight, eleWidth, (features.highlight == "sc1a" ? highlightCol : helixCol), helixBgCol, topLayer, "sc1a.2", includeText);


			
			// Curved loop
			yLoop = y-loopHeight-helixHeight;
			endPoint = [xMid + xpadding+eleWidth, yLoop];
			control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-ypadding];
			control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-ypadding];
			d = "M " + xMid + " " + yLoop  + " C " + control1[0] + " " + control1[1] + ", " + control2[0] + " " + control2[1] + ", " + endPoint[0] + " " + endPoint[1];
			drawSVGobj(topLayer, "path", {d: d, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + "black" + "; fill:transparent; stroke-linecap:round"} );



			if (hasZ2insert){

				let thisCol = IMcol;
				if (features.highlight == "liv"){
					thisCol = highlightCol;
				}


				let cy = y-loopHeight/2;
				r = isSmall ? INSERTION_MODULE_RADIUS : 2*INSERTION_MODULE_RADIUS;
				drawSVGobj(topLayer, "circle", {cx: hpx2, cy: cy, r: r, style: "stroke-width:1px; stroke:black; fill:" + thisCol + ";"} );
				drawSVGobj(topLayer, "text", {x: hpx2, y: cy, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);
		
			}
			
		}
		




		if (i == 0) {
			if (isUrzyme) oddLoop = !oddLoop;
			continue;
		}
		oddLoop = !oddLoop;

	}
	
	
	
	
	// Helix
	if (i % 2 == 0 && i <= 10){
		
		

		let eleName = i;
		if (i == 2) eleName = "H1";
		if (i == 8) eleName = "H2";
		if (i == 10) eleName = "H3";
		if (i == 4) eleName = "H4";
		if (i == 6) eleName = "H5";


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
			if (includeText) {
				drawSVGobj(topLayer, "text", {x: x - CATALYTIC_DOMAIN_FONT_SIZE/2, y: y - 3*CATALYTIC_DOMAIN_FONT_SIZE/4, style: "font-size:" + ELEMENT_DOMAIN_FONT_SIZE + "px; text-anchor:middle; dominant-baseline:end; font-weight:bold; fill:" + motifColBase + "; "}, "HIGH");
			}


		}


		// Rect border lines
		drawSVGobj(group, "line", {x1: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, x2: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, y1: helixY, y2: helixY+eleHeightHelix, style: "stroke-width:1px; stroke: black;"} );
		drawSVGobj(group, "line", {x1: x+eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, x2: x+eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, y1: helixY, y2: helixY+eleHeightHelix, style: "stroke-width:1px; stroke: black;"} );

					
		// Top circle
		drawSVGobj(group, "ellipse", {cx: x, cy: helixY, rx: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, ry: CATALYTIC_DOMAIN_HELIX_CORNER_RADIUS, style: "stroke-width:0px; fill:white"} );
		drawSVGobj(group, "ellipse", {cx: x, cy: helixY, rx: eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, ry: CATALYTIC_DOMAIN_HELIX_CORNER_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + helixBgCol } );
	

		

		// Text label
		if (includeText) drawSVGobj(topLayer, "text", {x: x, y: helixY+eleHeightHelix/2, style: "font-size:" + ELEMENT_DOMAIN_FONT_SIZE + "px; text-anchor:middle; dominant-baseline:central; "}, eleName);


		
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


		let eleName = i;
		if (i == 3) eleName = "S1";
		if (i == 1) eleName = "S2";
		if (i == 9) eleName = "S3";
		if (i == 5) eleName = "S4";
		if (i == 7) eleName = "S5";


		
		let group = $(drawSVGobj(bottomLayer, "g", {style:""} ));
		let strandObj = drawStrandVertical(x, yStrand, strandHeight, eleWidth, (i == 12 ? !odd : odd), thisCol, strandBgCol, motifCol, group, eleName, includeText, isSmall, false);


		// Highlight the extended strands
		if (hasSC1a && i == 11 && features.highlight == "sc1a"){
			drawStrandVertical(x, yStrand+eleHeight, strandHeight-eleHeight, eleWidth, odd, highlightCol, strandBgCol, highlightCol, group, "S", includeText, isSmall, false);
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

	let startXOrig = startX;
	let startYEff = startY;
	let startXEff = startX + 1*xpadding;



	

	let isSmall = features.small != null && features.small == true; 
	let isLarge = !isSmall && features.large != null && features.large == true; 
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

	}else if (isLarge){

		console.log("large")

		ypadding = ypadding*1.2;
		xpadding = xpadding*0.5;
		domainHeight = domainHeight*1.5;
		domainWidth = domainWidth*1.4;

		includeText = true;

 		if (isRightAligned){
		 	startX = startX - 0.8*domainWidth;
		 	startXEff = startX + 1*xpadding;
		 }


	}
	else{

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
	let s2bInsertInsert2 = s2bInsert && features.s2bInsertInsert2 != null && features.s2bInsertInsert2 == true;
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
	if (HPinsert) startYEff += 1*ypadding;
    // Draw box around
    let xMin = 1e10;
    let xMax = 0;



    if (hasHairpin){
    	startYEff = startYEff - 2*ypadding;
    }

    if (hasgates){
    	startYEff = startYEff - 1.8*ypadding;
    }

    if (hasHairpin2 && isSmall){
    	startXEff = startXEff + 2*xpadding;
    }

    // Name?
	if (features.name != null){
		let ylab = startY + 0.6*domainHeight;
		let fontSize = CATALYTIC_DOMAIN_FONT_SIZE*0.8;
		if (isLarge){
			//xlab = startXEff + xpadding*12;
			ylab = startY + domainHeight + ypadding/4;
		}
		if (s2bInsert){
			ylab += 2*ypadding;
		}

		if (hasgates){
			ylab += 1.5*ypadding;
		}

		let isBold = features.bold != null && features.bold == true;
		let boldness = isBold ? "font-weight: bold;" : "";
		if (isRightAligned){
			let xlab = startXOrig;
			drawSVGobj(svg, "text", {x: xlab, y: ylab, style: "font-size:" + fontSize + "px; text-anchor:end; dominant-baseline:central; " + boldness}, features.name);
		}else{
			let xlab = startXOrig + xpadding*6;
			drawSVGobj(svg, "text", {x: xlab, y: ylab, style: "font-size:" + fontSize + "px; text-anchor:start; dominant-baseline:central; " + boldness}, features.name);
		}
		
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
			let loopWidth = CATALYTIC_DOMAIN_LOOP_WIDTH;
			
			
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
				if (hasgates || L6insert) bigLoopHeightRel = 4;
				if (s2bInsert) bigLoopHeightRel = 5;
				if (hasHairpin2 || thrIM) bigLoopHeightRel = 7;
				if (HP2insert) bigLoopHeightRel = 9;
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
				loopWidth = loopWidth * (isSmall ? 1.2 : 1.5);
				if (includeText) drawSVGobj(topLayer, "text", {x: xlab, y: yLoop-ypadding*1.5, style: "font-size:" + ELEMENT_DOMAIN_FONT_SIZE + "px; text-anchor:middle; dominant-baseline:central; font-weight:bold; fill:" + motifColBase + "; "}, "M1");
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

							let r = INSERTION_MODULE_RADIUS* (isSmall ? 1 : 2);

							loopHeight += 2*r;
							
							let icol = IMcol;
							if (features.highlight == "glyrs"){
								icol = highlightCol;
							}
							

							
							let xCircle = hpx1;
							drawSVGobj(topLayer, "circle", {cx: xCircle, cy: y-loopGateHeight-gateHeight-loopHeight/2, r: r, style: "stroke-width:1px; stroke:black; fill:" + icol + ";"} );
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
					drawStrandVertical(hpx1, y-loopHeight-strandHeight-gateHeight-loopGateHeight, strandHeight, eleWidth, true, hairpinColStrandNorm, strandBgCol, hairpinColMotif, group, "HP1", includeText, isSmall)

					// Curved loop
					yLoop = y-loopHeight-strandHeight-gateHeight-loopGateHeight;
					endPoint = [xMid + xpadding+eleWidth, yLoop];
					control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-ypadding];
					control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-ypadding];
					d = "M " + xMid + " " + yLoop  + " C " + control1[0] + " " + control1[1] + ", " + control2[0] + " " + control2[1] + ", " + endPoint[0] + " " + endPoint[1];
					drawSVGobj(group, "path", {d: d, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + hairpinColNorm + "; fill:transparent; stroke-linecap:round"} );
		

					// Strand 2
					drawStrandVertical(hpx2, y-loopHeight-strandHeight-gateHeight-loopGateHeight, strandHeight, eleWidth, false, hairpinColStrandNorm, strandBgCol, motifCol, group, "HP1", includeText, isSmall)

					// Straight loop 2
					drawSVGobj(group, "line", {x1: hpx2, x2: hpx2, y1: y-gateHeight-loopGateHeight-loopHeight, y2: y, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + hairpinColNorm + "; fill:transparent; stroke-linecap:round"} );
			
	
			
					// Hairpin insert
					if (HPinsert){
						let xCircle = (hpx1+hpx2) / 2
						drawSVGobj(group, "circle", {cx: xCircle, cy: yLoop-ypadding*1, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + IMcol + ";"} );
						drawSVGobj(group, "text", {x: xCircle, y: yLoop-ypadding*1, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);
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
					drawStrandVertical(hpx1, y+eleHeight+gateHeight+loopHeight, strandHeight, eleWidth, true, (features.highlight == "hairpin2" ? highlightCol : strandCol), strandBgCol, motifCol, group, "HP2", includeText, isSmall)

					// Strand 2
					drawStrandVertical(hpx2, y+eleHeight+gateHeight+loopHeight, strandHeight, eleWidth, false, (features.highlight == "hairpin2" ? highlightCol : strandCol), strandBgCol, motifCol, topLayer, "HP2", includeText, isSmall)


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



			}else if (eleName == "L8" && s2bInsert){

				let helixHeight = eleHeight / 2;
				let loopHeight = eleHeight / 4;

				let hx1 = x;
				let hx2 = xpadding + (xpadding+eleWidth)*(i+1) + startXEff;


				// 2 straight loops
				drawSVGobj(group, "line", {x1: hx1, x2: hx1, y1: y+eleHeight, y2: y+eleHeight+loopHeight, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + "black" + "; fill:transparent; stroke-linecap:round"} );
				drawSVGobj(group, "line", {x1: hx2, x2: hx2, y1: y+eleHeight, y2: y+eleHeight+loopHeight, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + "black" + "; fill:transparent; stroke-linecap:round"} );



				// Curved loop
				yLoop = y+eleHeight+loopHeight+helixHeight;
				endPoint = [xMid + xpadding+eleWidth, yLoop];
				control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+ypadding];
				control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+ypadding];
				d = "M " + xMid + " " + yLoop  + " C " + control1[0] + " " + control1[1] + ", " + control2[0] + " " + control2[1] + ", " + endPoint[0] + " " + endPoint[1];
				drawSVGobj(group, "path", {d: d, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + "black" + "; fill:transparent; stroke-linecap:round"} );
	

				// 2 helices
				drawHelix(hx1, y+eleHeight+loopHeight, helixHeight, eleWidth, (features.highlight == "sc2b" ? highlightCol : helixCol), helixBgCol, group, "s2b", includeText);
				drawHelix(hx2, y+eleHeight+loopHeight, helixHeight, eleWidth, (features.highlight == "sc2b" ? highlightCol : helixCol), helixBgCol, group, "s2b", includeText);




			}else if (eleName == "L5" && s2bInsert){


				let helixHeight = eleHeight / 2;
				let loopHeight = eleHeight / 4;

				if (s2bInsertInsert2){
					loopHeight = eleHeight;
				}

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
					drawSVGobj(topLayer, "circle", {cx: xCircle, cy: y-loopHeight-helixHeight-ypadding*1.3, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + IMcol + ";"} );
					drawSVGobj(topLayer, "text", {x: xCircle, y: y-loopHeight-helixHeight-ypadding*1.3, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);
			

				}




				if (s2bInsertInsert2){

					let insertName2 = "&kappa;";
					let xCircle = hx2;
					drawSVGobj(topLayer, "circle", {cx: xCircle, cy: y-loopHeight/2, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + IMcol + ";"} );
					drawSVGobj(topLayer, "text", {x: xCircle, y: y-loopHeight/2, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, insertName2);
			

				}


			}


			
			else{
				drawSVGobj(group, "path", {d: d, style: "stroke-width:" + loopWidth + "px; stroke:" + pathCol + "; fill:transparent; stroke-linecap:round"} );
			
			}


			if (!isSmall){
				if (eleName == "N" || eleName == "C") {
					drawSVGobj(group, "text", {x: xlab, y: ylab, style: "font-size:" + CATALYTIC_DOMAIN_FONT_SIZE + "px; text-anchor:middle; dominant-baseline:central; "}, eleName);
				}
			}
	




			// Insertion module
			if ((eleName == "L6" && L6insert) || (eleName == "L8" && L8insert) || (eleName == "L6" && thrIM)){
				

				let insertName = eleName == "L6" ? features.insertName : "B";
				
				let icol = IMcol;
				if (eleName == "L8" && features.highlight == "sc2b"){
					icol = highlightCol;
				}

				let xCircle = xpadding + (xpadding+eleWidth)*(i+0.5) + startXEff;
				drawSVGobj(group, "circle", {cx: xCircle, cy: yLoop+ypadding*1, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + icol + ";"} );
				drawSVGobj(group, "text", {x: xCircle, y: yLoop+ypadding*1, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, insertName);
			

			}
		

			else if (eleName == "L4" && L4insert){
				
				let icol = IMcol;
				if (features.highlight == "glyrs"){
					icol = highlightCol;
				}
				

				let r = INSERTION_MODULE_RADIUS* (isSmall ? 1 : 2);
				let xCircle = xpadding + (xpadding+eleWidth)*(6.5) + startXEff;
				drawSVGobj(group, "circle", {cx: xCircle, cy: yLoop+bigLoopHeightRel*ypadding*0.75, r: r, style: "stroke-width:1px; stroke:black; fill:" + icol + ";"} );
				drawSVGobj(group, "text", {x: xCircle, y: yLoop+bigLoopHeightRel*ypadding*0.75, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);
			
			
			}else if (eleName == "L7" && L7insert) {
				let xCircle = xpadding + (xpadding+eleWidth)*(i+0.5) + startXEff;
				drawSVGobj(group, "circle", {cx: xCircle, cy: yLoop-ypadding*1, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + IMcol + ";"} );
				drawSVGobj(group, "text", {x: xCircle, y: yLoop-ypadding*1, style: "font-size:" + INSERTION_MODULE_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);
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


      		let strandObj = drawStrandVertical(x, yStrand, eleHeight, eleWidth, odd, thisCol, strandBgCol, motifCol, group, eleName, includeText, isSmall);
      		if (includeText && eleName == "S2") {
      			drawSVGobj(group, "text", {x: x-eleWidth/2-xpadding - ELEMENT_DOMAIN_FONT_SIZE, y: yStrand-ypadding*1.5, style: "font-size:" + ELEMENT_DOMAIN_FONT_SIZE + "px; text-anchor:middle; dominant-baseline:central; font-weight:bold; fill:" + motifColBase + "; "}, "M2");
			}

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
					if (includeText) drawSVGobj(topLayer, "text", {x: x+eleWidth/2 - ELEMENT_DOMAIN_FONT_SIZE, y: helixY+eleHeight+ypadding*2.8, style: "font-size:" + ELEMENT_DOMAIN_FONT_SIZE + "px; text-anchor:middle; dominant-baseline:central; font-weight:bold; fill:" + motifColBase + "; "}, "M3");
					
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




function drawTip(svg, x, y, up=true, right=true, tall=false){

	let titleFontSize = CATALYTIC_DOMAIN_FONT_SIZE*0.8;


	let dy = tall ? TALL_LEAF_MODIFIER : 1;

	let d = "M " + x + " " + y + " C " + (x+LEAF_CONTROL_POINTS[0]*(right ? 1 : -1)) + " " + (y+LEAF_CONTROL_POINTS[1]*(up ? -dy : dy)) + ", " + (x+LEAF_CONTROL_POINTS[2]*(right ? 1 : -1)) + " " + (y+LEAF_CONTROL_POINTS[3]*(up ? -dy : dy)) + ", " + (x+LEAF_LENGTH*(right ? 1 : -1)) + " " + (y+(up ? -LEAF_DY*dy : LEAF_DY*dy));
	drawSVGobj(svg, "path", {d: d, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black; fill: transparent"});
	

	// Arrowhead
	let dx = right ? 1 : -1;
	drawSVGobj(svg, "line", {x1:  (x+LEAF_LENGTH*(right ? 1 : -1)), x2:  dx + (x+LEAF_LENGTH*(right ? 1 : -1)), y1: y+(up ? -LEAF_DY*dy : LEAF_DY*dy), y2: y+(up ? -LEAF_DY*dy : LEAF_DY*dy), marker_end:"url(#" + (right ? "arrowheadRight" : "arrowheadLeft") + ")", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    


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
				if (includeText) drawSVGobj(group, "text", {x: x, y: helixY+eleHeightHelix/2, style: "font-size:" + ELEMENT_DOMAIN_FONT_SIZE + "px; text-anchor:middle; dominant-baseline:central; "}, eleName);
	

				let helixObj = {x1: x-eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2, x2: x+eleWidth*CATALYTIC_DOMAIN_HELIX_WIDTH_PROP/2};
				return helixObj;

		}



		function drawStrandHorizontal(xStrand, yStrand, eleHeight, eleWidth, odd, thisCol, strandBgCol, motifCol, group, eleName, includeText = false, small=false){

			let x1, x2, x3, x4, xbg1, xbg2, xbg3;

			let l1 = CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_1;
			let l2 = CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_2;
			if (small){
				l1 *= 0.7;
				l2 *= 0.7;
			}

			
			if (odd){

			  // Right to left
			  x1 = xStrand+eleHeight;
			  xbg1 = x1 - CATALYTIC_DOMAIN_ARROW_BG_WIDTH;
			  x2 = xStrand+l1;
			  x3 = xStrand+l2;
			  x4 = xStrand;
			  xbg2 = x4 - CATALYTIC_DOMAIN_ARROW_BG_WIDTH;
			  xbg3 = x3 - CATALYTIC_DOMAIN_ARROW_BG_WIDTH;


			}else{


			  // Left to right
			  x1 = xStrand+CATALYTIC_DOMAIN_ARROW_BG_WIDTH;
			  xbg1 = xStrand - CATALYTIC_DOMAIN_ARROW_BG_WIDTH;
			  x2 = xStrand+eleHeight-l1;
			  x3 = xStrand+eleHeight-l2;
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


		function drawStrandVertical(x, yStrand, eleHeight, eleWidth, odd, thisCol, strandBgCol, motifCol, group, eleName, includeText = false, small = false, isClass2 = true){



				let l1 = CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_1;
				let l2 = CATALYTIC_DOMAIN_STRAND_ARROW_HEAD_LEN_2;
				if (small){
					l1 *= 0.6;
					l2 *= 0.6;
				}

				let y1, y2, y3, y4, ybg1, ybg2, ybg3;
				if (odd){

				  // Up arrow
				  y1 = yStrand+eleHeight;
				  ybg1 = y1 - CATALYTIC_DOMAIN_ARROW_BG_WIDTH;
				  y2 = yStrand+l1;
				  y3 = yStrand+l2;
				  y4 = yStrand;
				  ybg2 = y4 - CATALYTIC_DOMAIN_ARROW_BG_WIDTH;
				  ybg3 = y3 - CATALYTIC_DOMAIN_ARROW_BG_WIDTH;


				}else{

				  // Down arrow
				  y1 = yStrand+CATALYTIC_DOMAIN_ARROW_BG_WIDTH;
				  ybg1 = yStrand - CATALYTIC_DOMAIN_ARROW_BG_WIDTH;
				  y2 = yStrand+eleHeight-l1;
				  y3 = yStrand+eleHeight-l2;
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
				if (eleName == "S1" && isClass2){


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
					

				}


				if (includeText) drawSVGobj(group, "text", {x: x, y: yStrand+eleHeight/2, style: "font-size:" + ELEMENT_DOMAIN_FONT_SIZE + "px; text-anchor:middle; dominant-baseline:central; "}, eleName);


		

				let strandObj = {x1: x-eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2, x2: x+eleWidth*CATALYTIC_DOMAIN_STRAND_ARROW_BASE_WIDTH_PROP/2};
				return strandObj;
					
		}



SVG_WIDTH = 2000;
SVG_HEIGHT = 1500;

CATALYTIC_DOMAIN_WIDTH = 250;
CATALYTIC_DOMAIN_HEIGHT = 110;
CATALYTIC_DOMAIN_XPAD = 10;
CATALYTIC_DOMAIN_YPAD = 18;
CATALYTIC_LOOP_HEIGHT = 20;
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

INSERTION_MODULE_COL = "purple";
INSERTION_MODULE_RADIUS = 13;


MAIN_ARROW_LWD = 2;

AA_COLS_2 = {E: "#FFC20A", H: "#0C7BDC", G: "#0C7BDC", I: "#0C7BDC", T:"#d3d3d3", S: "#d3d3d3",  B: "#d3d3d3",  N: "#ffffff"};





// Draw a class I or II catalytic domain layout
function drawTree(classNr){

		let json = null;
		
		let className = classNr == 1 ? "I" : "II";

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
    let arrowheadHori = $(drawSVGobj(defs, "marker", {id: "arrowheadHori", markerWidth: 9, markerHeight: 9,  refX: "0", refY: "3.5"} ));
    $(drawSVGobj(arrowheadHori, "polygon", {points: "0 0, 9 3.5, 0 7"} ));



    let helixCol = "url(#helixGradient)";
    let strandCol = "url(#strandGradient)";
    let motifCol = "url(#motifGradient)";
    let highlightCol = "url(#highlightGradient)";
    let helixBgCol  = "url(#helixBackgroundGradient)";
    let strandBgCol  = "url(#strandBackgroundGradient)";


    let dy = CATALYTIC_DOMAIN_HEIGHT + 1.5*CATALYTIC_DOMAIN_YPAD;
    let dx = CATALYTIC_DOMAIN_WIDTH + 2*CATALYTIC_DOMAIN_XPAD;

    // Vertical arrow line
    drawSVGobj(svg, "line", {x1: 50 + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: 50 + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: 0, y2: 9*dy, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );

    
    let titleFontSize = CATALYTIC_DOMAIN_FONT_SIZE*0.8;

    if (classNr == 2){
		
		
		let ym = 0;
		
    	 drawClass2Domain(50, 0, svg, motifColBase, highlightColBase, "Protozyme", {box: true, protozyme: true});
		 
		 
		 // Urzyme
		 ym = 1;
		 //drawSVGobj(svg, "line", {x1: 50 + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: 50+0.7*dx, y1: ym*dy, y2: ym*dy, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );	 
		 //drawSVGobj(svg, "line", {x1: 50+0.7*dx, x2: 50 + 0.7*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    	 //drawSVGobj(svg, "text", {transform:"translate(" + (50+0.7*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "?");
		 drawClass2Domain(50, ym*dy, svg, motifColBase,  highlightColBase,"Urzyme", {box: true, urzyme: true, highlight: "urzyme"});


		ym = 2;

    	 // 6 fold
		 drawSVGobj(svg, "text", {x: 50 + 2*CATALYTIC_DOMAIN_FONT_SIZE, y: ym*dy - CATALYTIC_DOMAIN_FONT_SIZE/2, style: "font-size:" + titleFontSize + "px; text-anchor:start; dominant-baseline:central;"}, "Subclass IId");
    	 drawSVGobj(svg, "line", {x1: 50 + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: 50+1.1*dx, y1: ym*dy, y2: ym*dy, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    	 drawClass2Domain(50, ym*dy, svg, motifColBase, highlightColBase, "6 fold", {box: true, highlight: "6fold"});
    	 drawSVGobj(svg, "line", {x1: 50+1*dx, x2: 50+1*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    	 drawSVGobj(svg, "line", {x1: 50+1.1*dx, x2: 50+1.1*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    	 drawSVGobj(svg, "text", {transform:"translate(" + (50+1*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "GlyRS-B");
    	 drawClass2Domain(50+1.1*dx, ym*dy, svg, motifColBase, highlightColBase, "AlaRS", {L6: true, insertName: "A"});


		 ym = 3;

    	 // Hairpin 1
		 drawSVGobj(svg, "text", {x: 50 + 2*CATALYTIC_DOMAIN_FONT_SIZE, y: ym*dy - CATALYTIC_DOMAIN_FONT_SIZE/2, style: "font-size:" + titleFontSize + "px; text-anchor:start; dominant-baseline:central;"}, "Subclass IIb");
    	 drawSVGobj(svg, "line", {x1: 50 + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: 50+3.2*dx, y1: ym*dy, y2: ym*dy, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    	 drawClass2Domain(50, ym*dy, svg, motifColBase, highlightColBase, "+Hairpin 1", {box: true, hairpin: true, highlight: "hairpin1"});
    	 drawSVGobj(svg, "line", {x1: 50+1*dx, x2: 50+1*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );

		 
		 // Nested acid/base
		 drawClass2Domain(50+1*dx, ym*dy, svg, motifColBase,  highlightColBase,"+SC2b IM", {box: true, hairpin: true, s2b: true, L8: true, insertName: "b", highlight: "sc2b"});
		 drawSVGobj(svg, "line", {x1: 50+2.0*dx, x2: 50+2.0*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    	 drawSVGobj(svg, "line", {x1: 50+2.1*dx, x2: 50+2.1*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    	 drawSVGobj(svg, "line", {x1: 50+2.2*dx, x2: 50+2.2*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
		 drawSVGobj(svg, "line", {x1: 50+3.2*dx, x2: 50+3.2*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
		 drawSVGobj(svg, "text", {transform:"translate(" + (50+2.0*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "AsnRS");
    	 drawSVGobj(svg, "text", {transform:"translate(" + (50+2.1*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "AsxRS");
    	 
    	 drawClass2Domain(50+2.2*dx, ym*dy, svg, motifColBase,  highlightColBase,"AspRS", {box: false, hairpin: true, s2b: true, L8: true, s2bInsertInsert: true, insertName: "D"});
			drawClass2Domain(50+3.2*dx, ym*dy, svg, motifColBase,  highlightColBase,"LysRS-II", {box: false, hairpin: true, s2b: true, L8: true, s2bInsertInsert: true, insertName: "K"});
		
		 

		ym = 4.3;

    	 // Gates
    	 drawSVGobj(svg, "line", {x1: 50 + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: 50+2.5*dx, y1: ym*dy, y2: ym*dy, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    	drawSVGobj(svg, "text", {x: 50 + 2*CATALYTIC_DOMAIN_FONT_SIZE, y: ym*dy - CATALYTIC_DOMAIN_FONT_SIZE/2, style: "font-size:" + titleFontSize + "px; text-anchor:start; dominant-baseline:central;"}, "Subclass IIc");
		drawClass2Domain(50, ym*dy, svg, motifColBase, highlightColBase, "+Gates", {box: true, hairpin: true, gates: true, highlight: "gates"});
		drawSVGobj(svg, "line", {x1: 50+1*dx, x2: 50+1*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    	drawSVGobj(svg, "line", {x1: 50+1.1*dx, x2: 50+1.1*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    	drawSVGobj(svg, "line", {x1: 50+1.2*dx, x2: 50+1.2*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    	drawSVGobj(svg, "line", {x1: 50+1.3*dx, x2: 50+1.3*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    	drawSVGobj(svg, "line", {x1: 50+1.4*dx, x2: 50+1.4*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    	drawSVGobj(svg, "line", {x1: 50+1.5*dx, x2: 50+1.5*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    	drawSVGobj(svg, "line", {x1: 50+2.5*dx, x2: 50+2.5*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    	drawSVGobj(svg, "text", {transform:"translate(" + (50+1*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "PheRS-B&alpha;");
		drawSVGobj(svg, "text", {transform:"translate(" + (50+1.1*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "PheRS-B&beta;");
		drawSVGobj(svg, "text", {transform:"translate(" + (50+1.2*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "PheRS-A&beta;");
		drawSVGobj(svg, "text", {transform:"translate(" + (50+1.3*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "PheRS-M");
		drawSVGobj(svg, "text", {transform:"translate(" + (50+1.4*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "PylRS");
		drawClass2Domain(50+1.5*dx, ym*dy, svg, motifColBase, highlightColBase, "SepRS", {hairpin: true, gates: true, HP: true, insertName: "O"});
		drawClass2Domain(50+2.5*dx, ym*dy, svg, motifColBase,  highlightColBase,"PheRS-A&alpha;", {hairpin: true, gates: true, HP: true, insertName: "P"});

		ym = 6;
		
		// Hairpin 2
		drawSVGobj(svg, "line", {x1: 50 + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: 50+3.2*dx, y1: ym*dy, y2: ym*dy, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
		drawSVGobj(svg, "text", {x: 50 + 2*CATALYTIC_DOMAIN_FONT_SIZE, y: ym*dy - CATALYTIC_DOMAIN_FONT_SIZE/2, style: "font-size:" + titleFontSize + "px; text-anchor:start; dominant-baseline:central;"}, "Subclass IIa");
		drawClass2Domain(50, ym*dy, svg, motifColBase, highlightColBase, "+Hairpin 2", {box: true, hairpin: true, gates: true, hairpin2: true, highlight: "hairpin2"});
		 drawSVGobj(svg, "line", {x1: 50+1*dx, x2: 50+1*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    	 drawSVGobj(svg, "line", {x1: 50+1.1*dx, x2: 50+1.1*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
		 drawSVGobj(svg, "line", {x1: 50+1.2*dx, x2: 50+1.2*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    	 drawSVGobj(svg, "line", {x1: 50+2.2*dx, x2: 50+2.2*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    	 drawSVGobj(svg, "line", {x1: 50+3.2*dx, x2: 50+3.2*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
    	 drawSVGobj(svg, "text", {transform:"translate(" + (50+1*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "SerRS");
		 drawSVGobj(svg, "text", {transform:"translate(" + (50+1.1*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "ProRS-A");
    	 drawClass2Domain(50+1.2*dx, ym*dy, svg, motifColBase,  highlightColBase,"ProRS-B", {hairpin: true, gates: true, hairpin2: true, L7: true, insertName: "P"});
		 drawClass2Domain(50+2.2*dx, ym*dy, svg, motifColBase,   highlightColBase,"SerRS-A", {hairpin: true, gates: true, hairpin2: true, HP: true, insertName: "S"});
		
		
		
		// Nested: GlyRS
		drawSVGobj(svg, "line", {x1: (50+3.2*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2), x2: (50+3.2*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2), y1: ym*dy, y2: 7.9*dy + CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
		drawClass2Domain(50+3.2*dx, ym*dy, svg, motifColBase,  highlightColBase, "+GlyRS IM", {box: true, highlight: "glyrs" , hairpin: true, gates: true, hairpin2: true, G1: true, L4: true, insertName: "G"});
    	

		// ThrRS / HisRS
		ym = 7.9;
		drawSVGobj(svg, "line", {x1: 50 + CATALYTIC_DOMAIN_FONT_SIZE/2, x2: 50+1.1*dx, y1: ym*dy, y2: ym*dy, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
		drawClass2Domain(50, ym*dy, svg, motifColBase, highlightColBase, "+ThrRS IM", {box:true, highlight: "thrrs", hairpin: true, gates: true, hairpin2: true, thrIM: true, insertName: "T"});
		drawSVGobj(svg, "line", {x1: 50+1*dx, x2: 50+1*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
		drawSVGobj(svg, "line", {x1: 50+1.1*dx, x2: 50+1.1*dx + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
		drawSVGobj(svg, "text", {transform:"translate(" + (50+1*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "ThrRS");
		drawClass2Domain(50+1.1*dx, ym*dy, svg, motifColBase, highlightColBase, "HisRS", {hairpin: true, gates: true, hairpin2: false, thrIM: true, hisIM: true, insertName: "H"});


		// GlyRS-E
		drawSVGobj(svg, "line", {x1: 50 + CATALYTIC_DOMAIN_FONT_SIZE +2.1*dx, x2: 50+3.2*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy, style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
		drawSVGobj(svg, "line", {x1: 50+2.1*dx + CATALYTIC_DOMAIN_FONT_SIZE, x2: 50+2.1*dx  + CATALYTIC_DOMAIN_FONT_SIZE/2, y1: ym*dy, y2: ym*dy+CATALYTIC_DOMAIN_YPAD*1, marker_end:"url(#arrowheadVert)", style: "stroke-width:" + MAIN_ARROW_LWD + "px; stroke-linecap: round; stroke:black"} );
		drawClass2Domain(50+2.1*dx, ym*dy, svg, motifColBase,  highlightColBase, "GlyRS-E", {hairpin: true, gates: true, hairpin2: true, G1: true, L4: true, HP2: true, insertName: "G"});
    	drawSVGobj(svg, "text", {transform:"translate(" + (50+3.2*dx+ CATALYTIC_DOMAIN_FONT_SIZE/2) + ", " + (ym*dy+2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, "GlyRS-A");
    	
		


    }
   



  }




function drawClass2Domain(startX, startY, svg, motifColBase, highlightColBase, title = null, features = {}, includeText=false){


		let groupFig = $(drawSVGobj(svg, "g", {} ));

  	// Top and bottom layers
		let bottomLayer = $(drawSVGobj(groupFig, "g", {style:""} )); 
		let topLayer = $(drawSVGobj(groupFig, "g", {style:""} )); 
	

		let startYEff = startY;
		let startXEff = startX + 1*CATALYTIC_DOMAIN_XPAD;

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
    let eleWidth = (CATALYTIC_DOMAIN_WIDTH-CATALYTIC_DOMAIN_XPAD) / (nElementsHorizontal+1) - CATALYTIC_DOMAIN_XPAD;
    


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

    if (hasHairpin) startYEff += 2*CATALYTIC_DOMAIN_YPAD;
    if (hasgates) startYEff += 2*CATALYTIC_DOMAIN_YPAD;
	if (G1insert)  startYEff += 1*CATALYTIC_DOMAIN_YPAD;
    // Draw box around
    let xMin = 1e10;
    let xMax = 0;


      // 6 antiparallel strands and 3 helices
      let odd = false;
	  	let oddLoop = false;
    for (let i = iStart; i <= iStop ; i++){

				let eleHeight = (CATALYTIC_DOMAIN_HEIGHT-4*CATALYTIC_DOMAIN_YPAD);

        let x = CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*(i) + startXEff;
        let y = CATALYTIC_DOMAIN_YPAD*2 + startYEff;
		


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
				xMid = CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*1  + startXEff;
				endPoint = [xMid, yLoop+3*CATALYTIC_LOOP_HEIGHT/4];
				control1 = [xMid-CATALYTIC_DOMAIN_XPAD/3, yLoop+1*(CATALYTIC_LOOP_HEIGHT)/4];
				control2 = [xMid+CATALYTIC_DOMAIN_XPAD/3, yLoop+2*(CATALYTIC_LOOP_HEIGHT)/4];	
				xlab = xMid;
				ylab = yLoop+CATALYTIC_LOOP_HEIGHT + 5;
			}


			// N term protozyme/urzyme
			else if ((isProtozyme || isUrzyme) && i == iStop){
				eleName = "N";
				yLoop = y;
				pathCol = motifColBase;
				xMid = CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*2 + startXEff;
				endPoint = [xMid, yLoop-3*CATALYTIC_LOOP_HEIGHT/4];
				control1 = [xMid-CATALYTIC_DOMAIN_XPAD/3, yLoop-1*(CATALYTIC_LOOP_HEIGHT)/4];
				control2 = [xMid+CATALYTIC_DOMAIN_XPAD/3, yLoop-2*(CATALYTIC_LOOP_HEIGHT)/4];	
				xlab = xMid;
				ylab = yLoop-CATALYTIC_LOOP_HEIGHT - 5;
				onTop = true;


			}
			
			// C term
			else if (i == 9){
				eleName = "C";
				yLoop = y;
				xMid = CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*5 + startXEff;
				endPoint = [xMid, yLoop-3*CATALYTIC_LOOP_HEIGHT/4];
				control1 = [xMid-CATALYTIC_DOMAIN_XPAD/3, yLoop-1*(CATALYTIC_LOOP_HEIGHT)/4];
				control2 = [xMid+CATALYTIC_DOMAIN_XPAD/3, yLoop-2*(CATALYTIC_LOOP_HEIGHT)/4];	
				xlab = xMid;
				ylab = yLoop-CATALYTIC_LOOP_HEIGHT - 5;
				onTop = true;
				
			}

			// C term protozyme
			else if ((isProtozyme || isUrzyme) && i == iStop-1){
				eleName = "C";
				yLoop = y;
				xMid = CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*i + startXEff;
				endPoint = [xMid, yLoop-3*CATALYTIC_LOOP_HEIGHT/4];
				control1 = [xMid-CATALYTIC_DOMAIN_XPAD/3, yLoop-1*(CATALYTIC_LOOP_HEIGHT)/4];
				control2 = [xMid+CATALYTIC_DOMAIN_XPAD/3, yLoop-2*(CATALYTIC_LOOP_HEIGHT)/4];	
				xlab = xMid;
				ylab = yLoop-CATALYTIC_LOOP_HEIGHT - 5;
				onTop = true;
				
			}

			
			// Long loop from S2 to H3
			else if (i == 4 && !isUrzyme){
				yLoop = y+eleHeight;
				endPoint = [CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*9  + startXEff, yLoop];
				if (hasgates || L6insert) bigLoopHeightRel = 3.5;
				if (hasHairpin2 || thrIM) bigLoopHeightRel = 6;
				control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+bigLoopHeightRel*CATALYTIC_LOOP_HEIGHT];
				control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+bigLoopHeightRel*CATALYTIC_LOOP_HEIGHT];	
				ylab = yLoop+2*CATALYTIC_LOOP_HEIGHT-20;
				xlab = (xMid+endPoint[0])/2-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX ;
				oddLoop = !oddLoop;

				
			}
			
			
			// Standard odd loop (top)
			else if (oddLoop){
				endPoint = [xMid + CATALYTIC_DOMAIN_XPAD+eleWidth, yLoop];
				control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-CATALYTIC_LOOP_HEIGHT];
				control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-CATALYTIC_LOOP_HEIGHT];
				xlab = (xMid+endPoint[0])/2-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX;
				ylab = yLoop-CATALYTIC_LOOP_HEIGHT-3;
				onTop = true;
			}
			
			// Standard even loop (bottom)
			else{
				yLoop = y+eleHeight;
				endPoint = [xMid + CATALYTIC_DOMAIN_XPAD+eleWidth, yLoop];
				control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+CATALYTIC_LOOP_HEIGHT];
				control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+CATALYTIC_LOOP_HEIGHT];
				xlab = (xMid+endPoint[0])/2-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX;
				ylab = yLoop+CATALYTIC_LOOP_HEIGHT+3;
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
					let hpx2 = CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*(i+1) + startXEff;



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
							drawSVGobj(topLayer, "text", {x: xCircle, y: y-loopGateHeight-gateHeight-loopHeight/2, style: "font-size:" + CATALYTIC_DOMAIN_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);

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
					drawStrand(hpx1, y-loopHeight-strandHeight-gateHeight-loopGateHeight, strandHeight, eleWidth, true, hairpinColStrandNorm, strandBgCol, hairpinColMotif, group, "HP1")

					// Curved loop
					yLoop = y-loopHeight-strandHeight-gateHeight-loopGateHeight;
					endPoint = [xMid + CATALYTIC_DOMAIN_XPAD+eleWidth, yLoop];
					control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-CATALYTIC_LOOP_HEIGHT];
					control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-CATALYTIC_LOOP_HEIGHT];
					d = "M " + xMid + " " + yLoop  + " C " + control1[0] + " " + control1[1] + ", " + control2[0] + " " + control2[1] + ", " + endPoint[0] + " " + endPoint[1];
					drawSVGobj(group, "path", {d: d, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + hairpinColNorm + "; fill:transparent; stroke-linecap:round"} );
		

					// Strand 2
					drawStrand(hpx2, y-loopHeight-strandHeight-gateHeight-loopGateHeight, strandHeight, eleWidth, false, hairpinColStrandNorm, strandBgCol, motifCol, group, "HP1")

					// Straight loop 2
					drawSVGobj(group, "line", {x1: hpx2, x2: hpx2, y1: y-gateHeight-loopGateHeight-loopHeight, y2: y, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + hairpinColNorm + "; fill:transparent; stroke-linecap:round"} );
			
	
			
					// Hairpin insert
					if (HPinsert){
						let xCircle = (hpx1+hpx2) / 2
						drawSVGobj(group, "circle", {cx: xCircle, cy: yLoop-CATALYTIC_LOOP_HEIGHT*0.8, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + IMcol + ";"} );
						drawSVGobj(group, "text", {x: xCircle, y: yLoop-CATALYTIC_LOOP_HEIGHT*0.8, style: "font-size:" + CATALYTIC_DOMAIN_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);
					}

			} 

			else if (eleName == "L8" && hasgates){

				let gate2x = CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*(i+1) + startXEff;
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
					drawStrand(hpx1, y+eleHeight+gateHeight+loopHeight, strandHeight, eleWidth, true, (features.highlight == "hairpin2" ? highlightCol : strandCol), strandBgCol, motifCol, group, "HP2")

					// Strand 2
					drawStrand(hpx2, y+eleHeight+gateHeight+loopHeight, strandHeight, eleWidth, false, (features.highlight == "hairpin2" ? highlightCol : strandCol), strandBgCol, motifCol, topLayer, "HP2")


					// Straight loop
					drawSVGobj(group, "line", {x1: gate2x, x2: gate2x, y1: y+eleHeight+gateHeight, y2: y+eleHeight+gateHeight+loopHeight, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + (hasgates ? "black" : motifColBase) + "; fill:transparent; stroke-linecap:round"} );

					
				}


				// Curved loop
				xMid = x;
				yLoop = y+eleHeight+gateHeight+loopHeight+strandHeight;
				endPoint = [xMid + CATALYTIC_DOMAIN_XPAD+eleWidth, yLoop];
				control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+CATALYTIC_LOOP_HEIGHT];
				control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+CATALYTIC_LOOP_HEIGHT];
				d = "M " + xMid + " " + yLoop  + " C " + control1[0] + " " + control1[1] + ", " + control2[0] + " " + control2[1] + ", " + endPoint[0] + " " + endPoint[1];
				drawSVGobj(group, "path", {d: d, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + "black" + "; fill:transparent; stroke-linecap:round"} );
		

				// Straight loop 2
				drawSVGobj(bottomLayer, "line", {x1: x, x2: x, y1: y+eleHeight, y2: yLoop-strandHeight, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + "black" + "; fill:transparent; stroke-linecap:round"} );
			
			
				
				if (HP2insert){
					
					let xCircle = CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*(i+0.5) + startXEff;
					drawSVGobj(topLayer, "circle", {cx: xCircle, cy: yLoop+CATALYTIC_LOOP_HEIGHT*0.8, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + IMcol + ";"} );
					drawSVGobj(topLayer, "text", {x: xCircle, y: yLoop+CATALYTIC_LOOP_HEIGHT*0.8, style: "font-size:" + CATALYTIC_DOMAIN_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, "g");

				}



			}

			else if (eleName == "L5" && s2bInsert){


				let helixHeight = eleHeight / 2;
				let loopHeight = eleHeight / 4;

				let hx1 = x;
				let hx2 = CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*(i+1) + startXEff;


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
				endPoint = [xMid + CATALYTIC_DOMAIN_XPAD+eleWidth, yLoop];
				control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-CATALYTIC_LOOP_HEIGHT];
				control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop-CATALYTIC_LOOP_HEIGHT];
				d = "M " + xMid + " " + yLoop  + " C " + control1[0] + " " + control1[1] + ", " + control2[0] + " " + control2[1] + ", " + endPoint[0] + " " + endPoint[1];
				drawSVGobj(group, "path", {d: d, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + "black" + "; fill:transparent; stroke-linecap:round"} );
	



				if (s2bInsertInsert){

					let xCircle = (hx1+hx2)/2;
					drawSVGobj(topLayer, "circle", {cx: xCircle, cy: y-loopHeight-helixHeight-CATALYTIC_LOOP_HEIGHT*0.8, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + IMcol + ";"} );
					drawSVGobj(topLayer, "text", {x: xCircle, y: y-loopHeight-helixHeight-CATALYTIC_LOOP_HEIGHT*0.8, style: "font-size:" + CATALYTIC_DOMAIN_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);
			

				}


			}


		
			else if (eleName == "L6" && thrIM) {
				
				let helixX = CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*(i+1) + startXEff;
				let loopHeight = eleHeight / 4;
				let strandHeight = eleHeight / 2;
				
				
				if (hisIM){
					loopHeight *= 4;
				}
				
				// Loop 1
				drawSVGobj(bottomLayer, "line", {x1: x, x2: x, y1: y+eleHeight+loopHeight, y2: y+eleHeight, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + "black" + "; fill:transparent; stroke-linecap:round"} );
			
				
				// Strand
				drawStrand(x, y+eleHeight+loopHeight, strandHeight, eleWidth, true, (features.highlight == "thrrs" ? highlightCol : strandCol), strandBgCol, motifCol, group, "HP1")
				
				// Helix
				drawHelix(helixX, y+eleHeight+loopHeight, strandHeight, eleWidth, (features.highlight == "thrrs" ? highlightCol : helixCol), helixBgCol, bottomLayer, "Gate2", includeText);
		
		
				// Loop 2
				drawSVGobj(bottomLayer, "line", {x1: helixX, x2: helixX, y1: y+eleHeight+loopHeight, y2: y+eleHeight, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + "black" + "; fill:transparent; stroke-linecap:round"} );
			
			
				// Curved loop
				yLoop = y+eleHeight+loopHeight+strandHeight;
				endPoint = [xMid + CATALYTIC_DOMAIN_XPAD+eleWidth, yLoop];
				control1 = [xMid-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+CATALYTIC_LOOP_HEIGHT];
				control2 = [endPoint[0]-CATALYTIC_DOMAIN_CUBIC_RIGHT_DX, yLoop+CATALYTIC_LOOP_HEIGHT];
				d = "M " + xMid + " " + yLoop  + " C " + control1[0] + " " + control1[1] + ", " + control2[0] + " " + control2[1] + ", " + endPoint[0] + " " + endPoint[1];
				drawSVGobj(group, "path", {d: d, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + "black" + "; fill:transparent; stroke-linecap:round"} );
		
				// HisRS insertion
				if (hisIM){
					let xCircle = helixX;
					drawSVGobj(topLayer, "circle", {cx: xCircle, cy: y+eleHeight+loopHeight/2, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + IMcol + ";"} );
					drawSVGobj(topLayer, "text", {x: xCircle, y: y+eleHeight+loopHeight/2, style: "font-size:" + CATALYTIC_DOMAIN_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);
			
				}
		
			
				
			}
			
			else{
				drawSVGobj(group, "path", {d: d, style: "stroke-width:" + CATALYTIC_DOMAIN_LOOP_WIDTH + "px; stroke:" + pathCol + "; fill:transparent; stroke-linecap:round"} );
			
			}

			if (includeText || eleName == "N" || eleName == "C") {
				drawSVGobj(group, "text", {x: xlab, y: ylab, style: "font-size:" + CATALYTIC_DOMAIN_FONT_SIZE + "px; text-anchor:middle; dominant-baseline:central; "}, eleName);
			}
			
	


			// Insertion module
			if ((eleName == "L6" && L6insert) || (eleName == "L8" && L8insert)){
				
				
				let icol = IMcol;
				if (eleName == "L8" && features.highlight == "sc2b"){
					icol = highlightCol;
				}

				let xCircle = CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*(i+0.5) + startXEff;
				drawSVGobj(group, "circle", {cx: xCircle, cy: yLoop+CATALYTIC_LOOP_HEIGHT*0.8, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + icol + ";"} );
				drawSVGobj(group, "text", {x: xCircle, y: yLoop+CATALYTIC_LOOP_HEIGHT*0.8, style: "font-size:" + CATALYTIC_DOMAIN_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, "B");
			

			}else if (eleName == "L4" && L4insert){
				
				let icol = IMcol;
				if (features.highlight == "glyrs"){
					icol = highlightCol;
				}
				
				let xCircle = CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*(6.5) + startXEff;
				drawSVGobj(group, "circle", {cx: xCircle, cy: yLoop+bigLoopHeightRel*CATALYTIC_LOOP_HEIGHT*0.75, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + icol + ";"} );
				drawSVGobj(group, "text", {x: xCircle, y: yLoop+bigLoopHeightRel*CATALYTIC_LOOP_HEIGHT*0.75, style: "font-size:" + CATALYTIC_DOMAIN_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);
			
			
			}else if (eleName == "L7" && L7insert) {
				let xCircle = CATALYTIC_DOMAIN_XPAD + (CATALYTIC_DOMAIN_XPAD+eleWidth)*(i+0.5) + startXEff;
				drawSVGobj(group, "circle", {cx: xCircle, cy: yLoop-CATALYTIC_LOOP_HEIGHT*0.8, r: INSERTION_MODULE_RADIUS, style: "stroke-width:1px; stroke:black; fill:" + IMcol + ";"} );
				drawSVGobj(group, "text", {x: xCircle, y: yLoop-CATALYTIC_LOOP_HEIGHT*0.8, style: "font-size:" + CATALYTIC_DOMAIN_FONT_SIZE + "px; fill:white; text-anchor:middle; dominant-baseline:central; "}, features.insertName);
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
				yStrand = CATALYTIC_DOMAIN_YPAD*2 + eleHeight + startYEff;
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


      let strandObj = drawStrand(x, yStrand, eleHeight, eleWidth, odd, thisCol, strandBgCol, motifCol, group, eleName, includeText)

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
   //drawSVGobj(bottomLayer, "rect", {x: xMin - CATALYTIC_DOMAIN_XPAD, y: startY-CATALYTIC_DOMAIN_YPAD, width: xMax - xMin + 2*CATALYTIC_DOMAIN_XPAD, height: CATALYTIC_DOMAIN_HEIGHT + 2*CATALYTIC_DOMAIN_YPAD, style: "fill:transparent; stroke:black; stroke-width: 1px"});
	

		// Title
		if (title != null && title != ""){
			let tx = startX + CATALYTIC_DOMAIN_FONT_SIZE/2;
			let ty = startY + CATALYTIC_DOMAIN_HEIGHT/2;


			// Box
			let titleFontSize = CATALYTIC_DOMAIN_FONT_SIZE*0.8;
			if (features.box != null && features.box == true){
				titleFontSize = CATALYTIC_DOMAIN_FONT_SIZE;
				drawSVGobj(bottomLayer, "rect", {rx: 5, x: tx - 3*CATALYTIC_DOMAIN_FONT_SIZE/4, width: 1.5*CATALYTIC_DOMAIN_FONT_SIZE, y: startY, height: CATALYTIC_DOMAIN_HEIGHT, style: "fill:white; stroke-width:0px"});
				drawSVGobj(bottomLayer, "rect", {rx: 5, x: tx - 3*CATALYTIC_DOMAIN_FONT_SIZE/4, width: 1.5*CATALYTIC_DOMAIN_FONT_SIZE, y: startY, height: CATALYTIC_DOMAIN_HEIGHT, style: "fill:" + highlightCol + "; stroke:black; stroke-width:" +  MAIN_ARROW_LWD + "px"});
				drawSVGobj(bottomLayer, "text", {transform:"translate(" + tx + ", " + ty + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; fill:#eee; text-anchor:middle; dominant-baseline:central;"}, title);
			}else{
				drawSVGobj(bottomLayer, "text", {transform:"translate(" + tx + ", " + (startY + 2*CATALYTIC_DOMAIN_YPAD) + ") rotate(-90)", style: "font-size:" + titleFontSize + "px; text-anchor:end; dominant-baseline:central;"}, title);
			}

		
		}


		
		let svgCoords = {x: xMin - CATALYTIC_DOMAIN_XPAD, y: startY-CATALYTIC_DOMAIN_YPAD, width: xMax - xMin + 2*CATALYTIC_DOMAIN_XPAD, height: CATALYTIC_DOMAIN_HEIGHT + 2*CATALYTIC_DOMAIN_YPAD};
    //$(groupFig).css("transform", "translate(" + (svgCoords.x - startX) + ", " + 0 + ")");
    return svgCoords;

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




		function drawStrand(x, yStrand, eleHeight, eleWidth, odd, thisCol, strandBgCol, motifCol, group, eleName, includeText = false){

				let y1, y2, y3, ybg1, ybg2, ybg3;
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


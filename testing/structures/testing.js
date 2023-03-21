PV_VIEWERS = {};
PV_PDBS = {};
PV_GEOMS = {};



function renderTertiary(pdb = null, id = "tertiary", acc = "", colours = null) {


	
	var options = {
	  width: 600,
	  height: 600,
	  antialias: true,
	  quality : 'high'
	};
	
	// Hide and show again to prevent the annoying scrolling activity, unless already in viewport
	let hideAndShow = false;

	if (hideAndShow){
		$("#" + id).parent().hide(0);
	}else{
		$("#" + id).parent().show(0);
	}
  

  // Reset canvas
  $("#" + id).html("");


  // Try to load it
  if (pdb == null){
    pdb = PV_PDBS[id];
  }


  PV_PDBS[id] = pdb;


  // Load/save viewer
  var viewer = null;
  if (PV_VIEWERS[id] == null){
    viewer = pv.Viewer(document.getElementById(id), options);
  }else{
    viewer = PV_VIEWERS[id];
    viewer.rm("");
    viewer = pv.Viewer(document.getElementById(id), options);
    
  }
  PV_VIEWERS[id] = viewer;

  //console.log(pdb);


  
  if (hideAndShow){
	  setTimeout(function(){
		$("#" + id).parent().show(0);
	  }, 1);
  }
	
	// https://pv.readthedocs.io/en/v1.8.1/intro.html
 // asynchronously load the PDB file for the dengue methyl transferase from the server and display it in the viewer.
  pv.io.fetchPdb(pdb, function(structure) {

   

	  
    // Display the protein as cartoon
	  var method = $("#tertiaryColouringAln").length == 0 ? "color.ssSuccession" : "color." + $("#tertiaryColouringAln").val();
	 PV_GEOMS[id] = viewer.cartoon('protein', structure, { color : colourSelected(id, eval(method), colours) });
	 
    viewer.centerOn(structure);
	  viewer.setZoom(150);
    //viewer.autoZoom();


	  $("#" + id).append("<div class='pdblabel large'>" + acc + "</div>");


    // Back to top
	  //$('html,body').scrollTop(0);


  });
  

	
}




// Colour pdb structure by highlighting selected residues
function colourSelected(id, defaultFn, colours) {

  // Default colouring
  if (colours == null) {
    return defaultFn();
  }


  // Colour function
  var colorFunc = function(atom, out, index) {


  	//console.log(index, atom.residue().index());
  	let pdbIndex = atom.residue().index(); //index/4;


    // Which colour group?
    let colour = colours.default;
    for (let i = 0; i < colours.indices.length; i++){


    	let settings = colours.indices[i];
    	let lower = settings.lower;
    	let upper = settings.upper;
    	if (pdbIndex >= lower && pdbIndex <= upper){
    		colour = settings.colour;
    		break;
    	}


    }

    
    // index + 0, index + 1 etc. are the positions in the output array
    // at which the red (+0), green (+1), blue (+2) and  alpha (+3)
    // components are to be written.
    out[index+0] = colour[0]/256;
    out[index+1] = colour[1]/256;
    out[index+2] = colour[2]/256;
    out[index+3] = colour[3]/256;

  }

  return new pv.color.ColorOp(colorFunc);


}


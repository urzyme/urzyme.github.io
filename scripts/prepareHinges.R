library(rjson)
library(seqinr)



# Truncate a pdb file according to start and stop positions
truncatePDBFile = function(pdbFile, startPos, stopPos){



	pdb = readLines(pdbFile)

	# Load a pdb file
	atomLines = grep("^ATOM", pdb)
	atoms = pdb[atomLines]


	pdb.df = data.frame(line = atomLines, chain = substr(atoms, 22, 22), residue = substr(atoms, 18, 20), pos.pdb = as.numeric(substr(atoms, 24, 26)), include = FALSE)
	firstChain = sort(unique(pdb.df$chain))[1]
	pdb.df = pdb.df[pdb.df$chain == firstChain,]

	#cat(paste(pdbFile, "using chain", unique(pdb.df$chain), "\n"))
	
	if (nrow(pdb.df) == 0){
		cat(paste("Skipping", pdbFile, "\n"))
		next
	}
	


	# Subset sites
	pdb.df$include = pdb.df$pos.pdb >= startPos &  pdb.df$pos.pdb <= stopPos
	atomLinesInclude = pdb.df[pdb.df$include,"line"]
	
	if (length(unique(pdb.df[pdb.df$include,"pos.pdb"])) < 12){
		return (NA)
	}





	# Return target structure to save as file
	pdb.lines = numeric(0)
	if (atomLines[1] > 1){
		pdb.lines = 1:(atomLines[1]-1)
	}
	pdb.lines = c(pdb.lines, atomLinesInclude)
	if (atomLines[length(atomLines)] < length(pdb)){
		pdb.lines = c(pdb.lines, (atomLines[length(atomLines)]+1):length(pdb))
	}
	pdb.truncated = pdb[pdb.lines]



	# Remove TER lines
	pdb[grep("^TER ", pdb)] = ""

	# Remove secondary structure
	sse = grep("^(HELIX|SHEET)", pdb.truncated)
	if (length(sse) > 0){
		pdb.truncated = pdb.truncated[-sse]
	}


	pdb.truncated


}



# Prepare one directory per hinge region 
args = commandArgs(trailingOnly=TRUE)

if (length(args) != 2){
	stop(paste("Use: Rscript pairwiseJSON.R <info.json> <pass.nr>"))
}


json = fromJSON(file = args[1])
pass.nr = args[2]

# Look for a hinge structure
if (is.null(json[["hinge_str"]]) | is.null(json[["hinges"]])){
	stop(paste("Cannot find hinge structure!"))
}


wd = strsplit(args[1], "/")[[1]]
if (length(wd) == 1){
	wd = "data/"
}else{
	wd = paste0(paste(wd[-length(wd)], collapse="/"), "/data/")
}



# Read in hinges and hinge structure
hinge_str = paste0(wd, json[["hinge_str"]])
hinges = json[["hinges"]]

if (!file.exists(hinge_str)){
	stop(paste("Cannot find", hinge_str))
}
if (length(hinges) == 0){
	stop(paste("There are no hinges!"))
}
hinges = sort(hinges)


if (pass.nr == 1) {

	# Make one directory per region
	for (i in 2:(length(hinges)+1)){

		newdir = paste0("region", i)
		dir.create(newdir, showWarnings = FALSE)
		
		# Truncate the pdb file and move it here
		startPos = hinges[i-1]+1
		stopPos = ifelse(i == length(hinges)+1, Inf, hinges[i])
		pdb = truncatePDBFile(hinge_str, startPos, stopPos)
		write(pdb, paste0(newdir, "/hinge_str.pdb"))
		
	}


}else if (pass.nr == 2){


	# List of structures
	structures = read.csv("region2/startPos.csv", header=T)
	structures = structures$structure
	
	
	# Make directory for region 1 now
	dir.create(paste0("region1"), showWarnings = FALSE)
	
	
	regions.df = data.frame(structure = structures, region1 = 1)
	for (i in 2:(length(hinges)+1)){
		regions.df[,paste0("region", i)] = -1
	}

	for (i in 2:(length(hinges)+1)){


		csv.this = read.csv(paste0("region", (i) ,"/startPos.csv"), header=T)
		

		
		slist = character(0)

		# Start and stop per structure
		for (s in structures){

			startPos = csv.this[csv.this$structure == s,"startPos"]
			prevStartPos = regions.df[regions.df$structure == s,paste0("region",i-1)]
			if (startPos < prevStartPos + 12){
				startPos = prevStartPos
			}
			regions.df[regions.df$structure == s,paste0("region",i)] = startPos

	
		}
		
		
	
	
	}
	
	# Truncate structures
	for (i in 1:(length(hinges)+1)){
	
		slist = character(0)
		
		# Start and stop per structure
		for (s in structures){
		
			
			s2 = strsplit(s, "/")[[1]]
			s2 = s2[length(s2)]
			s_dir = paste0(wd, "dssp/", s2)
		
			startPos = regions.df[regions.df$structure == s,paste0("region",i)]
			stopPos = ifelse(i == length(hinges)+1, Inf, regions.df[regions.df$structure == s,paste0("region",i+1)] - 1)
			
			if (stopPos < startPos){
				cat(paste("Warning: skipping", s2, "for region", i, "because it has negative length\n"))
				next
			}
			
			pdb = truncatePDBFile(s_dir, startPos, stopPos)
			if (is.na(pdb)){
				cat(paste("Warning: skipping", s2, "for region", i, "truncation is NA\n"))
				next
			}
			write(pdb, paste0("region", i, "/", s2))
			slist = c(slist, s2)
		}
		
		
		# For 3DCOMB
		write(paste(slist, collapse="\n"), paste0("region", i, "/structures.txt"))
	
	}
	
	
	
	

}else if (pass.nr == 3){


	# List of all structures
	structures = read.csv("region2/startPos.csv", header=T)
	structures = structures$structure
	structures.names = strsplit(structures, "/")
	structures.names = sapply(structures.names, function(ele) ele[length(ele)])
	
	full.aln = character(length(structures))
	names(full.aln) = paste0("structures/", structures.names)
	


	# Glue sequence alignments back together
	for (i in 1:(length(hinges)+1)){
		structures.region = readLines(paste0("region", i, "/structures.txt"))
		
		
		aln = read.fasta(file=paste0("region", i, "/align.ali"))
		nsites = length(aln[[1]])
		for (s in structures.names){
			
			

			if (any(s == structures.region)){
				seq = toupper(paste0(aln[[s]], collapse=""))
			
			}else{
				seq = paste0(rep("-", nsites), collapse="")
			
			}
			
			full.aln[paste0("structures/", s)] = paste0(full.aln[paste0("structures/", s)], seq)
		
		
		}
		
	
	}


	write(paste0(paste0(">", names(full.aln), "\n", as.character(full.aln)), collapse="\n"), paste0(wd, "align.hinge.ali"))


}















# Read dssp
args = commandArgs(trailingOnly=TRUE)

dssp = readLines(args[1])
start = grep("#  RESIDUE AA STRUCTURE", dssp) + 1


sse.df = data.frame(start = numeric(0), stop = numeric(0), sse = character(0))
prevSSE =  substr(dssp[start+1], 17, 17)
pos = 1
for (i in (start+2):length(dssp)){

	line = dssp[i]
	if (line == ""){
		continue
	}
	
	
	sse = substr(line, 17, 17)
	if (sse != prevSSE){
		
		sse.df2 = data.frame(start = numeric(0), stop = numeric(0), sse = character(0))
		
	}
	
	pos = pos + 1


}


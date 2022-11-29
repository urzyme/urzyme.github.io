library(seqinr)
library(rjson)
library(stringr)
library(Biostrings)


# Iteratively step left and right until the right element is found
searchForStart = function(targetPos, ssSEQ, eleType){


	# Step left and right iteratively until we have found the right element
	left = TRUE
	targetPos2 = targetPos
	dx = 1
	while (ssSEQ[targetPos2] != eleType){
	
		targetPos2 = targetPos + ifelse(left, -dx, dx)
		if (targetPos2 <= 0) targetPos2 = 1
		if (targetPos2 > length(ssSEQ)) targetPos2 = length(ssSEQ)
		
	
		if (!left){
			left = TRUE
			dx = dx + 1
		}else{
			left = FALSE
		}
		
		if (dx > 20 & (targetPos - dx <= 0 | targetPos + dx + length(ssSEQ))){
			return(-1)
		}
		
		
	}
	
	#cat(paste("Performed step search on", target, ele, "with step size", ifelse(!left, -dx, dx), "\n"))
	
	targetPos2


}



# Truncate a pdb file according to start and stop positions in an alignent
truncatePDBFile = function(pdbFile, seq, startPos, stopPos){



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
	



	# Find matching sequence
	#seq = fasta[[pdbFile]]
	nsites = length(seq)
	pdb.site.nums = unique(pdb.df$pos.pdb)

	s=1
	for (site in 1:nsites){

		
		targetChar = seq[site]
		if (targetChar == "-"){


		}else{

			pdbTargetSite = pdb.site.nums[s]

			#print(paste(s, site, pdbTargetSite, length(pdb.site.nums)))

			# Keep the site if in range
			if (site >= startPos & site <= stopPos){

				# Keep this residue
				pdb.df[pdb.df$pos.pdb == pdbTargetSite,"include"] = TRUE

			}else{

				# Discard this residue
				pdb.df[pdb.df$pos.pdb == pdbTargetSite,"include"] = FALSE

			}

			s = s + 1

		}




	}



	nres = unique(pdb.df[pdb.df$include,"pos.pdb"])
	if (length(nres) < 12){
		return(NA)
	}

	atomLinesInclude = pdb.df[pdb.df$include,"line"]





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

	#file.name = gsub(".+/", "", pdbFile)
	#write(paste(pdb.truncated, collapse="\n"), paste0(dirName2, "/", file.name))



}



# Read reference json
json = fromJSON(file = "reference.json")



# Prepare table
loops.df = data.frame(family = json$refDir, structure = json$ref, dir=paste0(json$classDir, "/", json$refDir, ""))
elements = names(json$elements)
for (ele in elements){
	r = as.character(json$elements[ele])
	loops.df[paste0(ele, ".start")] = as.numeric(strsplit(r, "-")[[1]][1]) - json$alnStartAt
	loops.df[paste0(ele, ".end")] = as.numeric(strsplit(r, "-")[[1]][2]) - json$alnStartAt
	loops.df[paste0(ele, ".seq")] = ""
	#loops.df[paste0(ele, ".startSeq")] = ""
	#loops.df[paste0(ele, ".endSeq")] = ""
}



# Iterate through alignments
dirs = list.dirs(json$wd, recursive=F)
pairwise = gsub(".*/", "", dirs)
pairwise1 = sapply(strsplit(pairwise, "_"), function(ele) ele[1])
pairwise2 = sapply(strsplit(pairwise, "_"), function(ele) ele[2])

dirs = dirs[pairwise1 == json$refDir | pairwise2 == json$refDir]
dirs = c(dirs, paste0(json$classDir, "/", json$refDir))


startSequences = character(0)
endSequences = character(0)
for (d in dirs){

	# The ref family (eg. glyT for class 2) does not have a self-pairwise alignment, so instead use the main alignment 
	isReferenceFamily = d == paste0(json$classDir, "/", json$refDir)
	if (isReferenceFamily){
		targetDir = json$refDir
	}else{
		bits = strsplit(gsub(".*/", "", d), "_")[[1]]
		targetDir = bits[bits != json$refDir]
	}
	


	# Open the alignments
	aln = read.fasta(paste0(d, "/data/align.ali"))
	aln2 = read.fasta(paste0(d, "/data/secondary.fasta"))
	names(aln) = gsub(".*/", "", names(aln))
	names(aln2) = names(aln)

	# Reference sequence
	refSeq = aln[json$ref]
	refSeqSS = toupper(as.character(aln2[json$ref][[1]]))
	refSeqSS[refSeqSS == "G" | refSeqSS == "I"] = "H" # Just one type of helix


	# Remove members outside of the target family
	if (isReferenceFamily){
		keep = as.logical(sapply(names(aln), function(ele) all(ele != json$ref)))
	}else{
		keep = as.logical(sapply(names(aln), function(ele) all(ele != json$ignore) && ele != json$ref))
	}
	
	aln = aln[keep]



	# Add to dataframe
	loops.df2 = loops.df[rep(1,length(aln)),]
	for (col in colnames(loops.df2)){
		loops.df2[,col] = NA
	}
	loops.df2$structure = names(aln)
	loops.df2$family = targetDir
	loops.df2$dir = d
	loops.df = rbind(loops.df, loops.df2)


	# For each mapped helix/strand in structure
	nsites = length(refSeq[[1]])
	for (ele in elements){


		eleType = substr(ele, 1, 1)
		if (eleType == "S") eleType = "E" # Strand
		if (substr(ele, 1, 2) == "SH") eleType = "SH" # Special case: strand followed by helix

		eleTypeLeft = eleType
		eleTypeRight = eleType
		if (substr(ele, 1, 2) == "SH") {
			eleTypeLeft = "E"
			eleTypeRight = "H"
		}

		# Come back to loops later
		if (eleType == "L"){
			next
		}


		startName = paste0(ele, ".start")
		endName = paste0(ele, ".end")
		seqColName = paste0(ele, ".seq")
		seqStartColName = paste0(ele, ".startSeq")
		seqEndColName = paste0(ele, ".endSeq")
		refStart = loops.df[loops.df$structure == json$ref,startName]
		refEnd = loops.df[loops.df$structure == json$ref,endName]


		# Where are these positions in the alignment?
		seqPos = 1
		refStartAln = NA
		refEndAln = NA
		for (site in 1:nsites){
			symbol = refSeq[[1]][site]
			if (symbol != "-"){

				if (seqPos == refStart){
					refStartAln = site
				}

				if (seqPos == refEnd){
					refEndAln = site
				}

				seqPos = seqPos + 1
			}
		}

		# Reference subsequence
		refSubseq = paste(toupper(gsub("-", "", refSeq[[1]][refStartAln:refEndAln])), collapse="")
		refSubseqSS = paste(gsub("-", "", refSeqSS[refStartAln:refEndAln]), collapse="")
		loops.df[loops.df$structure == json$ref,seqColName] = refSubseq
		refLen = refEnd - refStart + 1


		#loops.df[loops.df$structure == json$ref, seqColName] = refSeq[[1]][refStartAln:refEndAln]


		# Get length of each element for each sequence
		for (target in names(aln)){

			
			#print(paste(ele, target))
			
			targetSeq = aln[target]
			targetSeqSS = toupper(as.character(aln2[target][[1]]))
			targetSeqSS[targetSeqSS == "G" | targetSeqSS == "I"] = "H" # Just one type of helix


			# Get mid point
			#targetPos = ceiling((refStartAln+refEndAln)/2) # nchar(gsub("-", "", paste0(targetSeq[[1]][1:ceiling((refStartAln+refEndAln)/2)], collapse="")))



			# Find some initial seeds to start the search to the ends of the structure
			targetStart = searchForStart(refStartAln+1, targetSeqSS, eleTypeLeft)
			targetEnd = searchForStart(refEndAln-1, targetSeqSS, eleTypeRight)
			
			if (targetStart > 0 && targetEnd > 0){
			

				# Extend to the end of the helix/strand. Allow for gaps
				while (targetStart > 1 & (targetSeqSS[targetStart-1] == eleTypeLeft | targetSeqSS[targetStart-1] == "-")){
					targetStart = targetStart - 1
				}
				while (targetEnd < nsites & (targetSeqSS[targetEnd+1] == eleTypeRight | targetSeqSS[targetEnd+1] == "-")){
					targetEnd = targetEnd + 1
				}
				
			
			}
		
			
			
			# If the range is negative or 1, then the element does not exist. Just show where it would be, relative to refseq
			if (targetEnd < targetStart | targetStart == -1 | targetEnd == -1){
				targetStart = refStartAln
				targetEnd = refEndAln
				cat(paste("Warning:", ele, target, "does not seem to exist. Using ref seq positions instead\n"))
			}else{
			
			
					
				# Ensure that the SSE does not have any large inserts inside it. If so, then take either the start or the end, which ever is larger
				SS = gsub(eleTypeRight, eleTypeLeft, gsub("-", eleTypeLeft, toupper(targetSeqSS[targetStart:targetEnd])))
				insertSize = length(SS[SS != eleTypeLeft])
			
				 if (insertSize > 4) {
				
					
					targetStart.candiate.2 = targetEnd
					while (targetStart.candiate.2 > 1 & (targetSeqSS[targetStart.candiate.2-1] == eleTypeLeft | targetSeqSS[targetStart.candiate.2-1] == "-")){
						targetStart.candiate.2 = targetStart.candiate.2 - 1
					}
				
					
					targetEnd.candiate.2 = targetStart
					while (targetEnd.candiate.2 < nsites & (targetSeqSS[targetEnd.candiate.2+1] == eleTypeRight | targetSeqSS[targetEnd.candiate.2+1] == "-")){
						targetEnd.candiate.2 = targetEnd.candiate.2 + 1
					}
					
					
					len_candiate1 = (targetEnd.candiate.2 - targetStart) + 1
					len_candiate2 = (targetEnd - targetStart.candiate.2) + 1
					
					actualInsertSize = targetStart.candiate.2 - targetEnd.candiate.2 - 1
					if (len_candiate1 >= len_candiate2){
						cat(paste("Warning: taking the N-terminal of", ele, target, "because there is a", actualInsertSize, "aa insertion inside it\n"))
						targetStart = targetStart
						targetEnd = targetEnd.candiate.2
					}else{
						cat(paste("Warning: taking the C-terminal of", ele, target, "because there is a", actualInsertSize, "aa insertion inside it\n"))
						targetStart = targetStart.candiate.2
						targetEnd = targetEnd
					}
					
				}
					
			
			}




			# Subsequence of element
			targetSubseq = paste(toupper(targetSeq[[1]][targetStart:targetEnd]), collapse="")
			targetSubseqSS = paste(toupper(targetSeqSS[targetStart:targetEnd]), collapse="")




			# Add to df
			loops.df[loops.df$structure == target, startName] = targetStart
			loops.df[loops.df$structure == target, endName] = targetEnd
			loops.df[loops.df$structure == target, seqColName] = targetSubseq
			#loops.df[loops.df$structure == target, seqStartColName] = targetStartSubSeq
			#loops.df[loops.df$structure == target, seqEndColName] = targetEndSubSeq


			len = targetEnd - targetStart + 1
			if (FALSE && len - refLen >= 10){


				# Find the inserted part (by looking at alignment)
				refAlnseqObj = refSeq[[1]][refStartAln:refEndAln]
				refAlnseq = paste(toupper(refAlnseqObj), collapse="")


				# How many gap regions?
				gapRegions = strsplit(refAlnseq, "[A-Z]+")[[1]]
				gapRegions = gapRegions[gapRegions != ""]
				gapsizes = nchar(gapRegions)
				ngaps = length(gapRegions)


				if (ngaps > 1){
					#cat(paste0("warning: multiple ref gaps for ", target, ":", paste(gapsizes, collapse = ","), "\n"))
				}

				# Take largest gap
				if (ngaps == 0){
					cat(paste("unexpected result: ", target, "has a large insert with no gaps\n"))
				}else if (all(gapsizes < 5)){
					cat(paste0("unexpected result for ", target, ": gap is too small ", gapsizes, "\n"))
				}else{


					# Position of first gap
					gapStartPos = which(refAlnseqObj == "-")[1]
					gapEndPos = which(refAlnseqObj == "-")
					gapEndPos = gapEndPos[length(gapEndPos)]

					ss = targetSeq[[1]][refStartAln:nsites]
					targetInsert = ss[gapStartPos:gapEndPos]
					if (gapStartPos > 4 && gapEndPos+4 < length(ss)){



						# Find first target non-gap in the insert
						targetInsertStart = (gapStartPos:gapEndPos)[which(ss[gapStartPos:gapEndPos] != "-")[1]]
						targetInsertEnd = (gapStartPos:gapEndPos)[which(ss[gapStartPos:gapEndPos] != "-")]
						targetInsertEnd = targetInsertEnd[length(targetInsertEnd)]


						# The 3 bases before the insert
						insertPart1 = ss[1:(targetInsertStart-1)]
						insertPart1 = insertPart1[insertPart1 != "-"]
						insertPart1 = insertPart1[length(insertPart1) - c(3,2,1,0)]

						insertPart2 = ss[targetInsertStart]

						# The 3 bases after the start of the insert
						insertPart3 = ss[(targetInsertStart+1:length(ss))]
						insertPart3 = insertPart3[insertPart3 != "-"]
						insertPart3 = insertPart3[c(1,2,3,4)]


						# The 3 bases before the end of the insert
						insertPart4 = ss[1:(targetInsertEnd-1)]
						insertPart4 = insertPart4[insertPart4 != "-"]
						insertPart4 = insertPart4[length(insertPart4) - c(3,2,1,0)]

						insertPart5 = ss[targetInsertEnd]

						# The 3 bases after the end of the insert
						insertPart6 = ss[(targetInsertEnd+1:length(ss))]
						insertPart6 = insertPart6[insertPart6 != "-"]
						insertPart6 = insertPart6[c(1,2,3,4)]


						#print(targetInsert)
						#print(insertPart4)
						#print(insertPart5)
						#print(insertPart6)
						#print("---------")


						targetStartSubSeq = toupper(paste0(paste0(insertPart1, collapse=""), insertPart2, paste0(insertPart3, collapse="")))
						targetEndSubSeq = toupper(paste0(paste0(insertPart4, collapse=""), insertPart5, paste0(insertPart6, collapse="")))


						seqNoGap = toupper(targetSeq[[1]])
						seqNoGap = seqNoGap[seqNoGap != "-"]


						#if (nchar(targetEndSubSeq) > 9){
						if (FALSE){
							print(target)
							print(targetStartSubSeq)
							print(targetEndSubSeq)
							print(toupper(paste(targetInsert, collapse="")))
							print(ss)
							stop("")
						}


						startSequences[paste0(target, ".", ele)] = targetStartSubSeq
						endSequences[paste0(target, ".", ele)] = targetEndSubSeq

					}

				}


				
			}
			

		}


	}



	# Loops
	for (ele in elements){
	
	


		eleType = substr(ele, 1, 1)

		# Loops later
		if (eleType != "L"){
			next
		}


		# Define the loop as being everything between the helix/strand before and after
		eleBefore = elements[which(elements == ele)-1]
		eleAfter = elements[which(elements == ele)+1]


		startName = paste0(ele, ".start")
		endName = paste0(ele, ".end")
		seqColName = paste0(ele, ".seq")

		beforeEndName = paste0(eleBefore, ".end")
		afterStartName = paste0(eleAfter, ".start")


		refStartAln = loops.df[loops.df$structure == json$ref, beforeEndName] + 1
		refEndAln = loops.df[loops.df$structure == json$ref, afterStartName] - 1
		refSubseq = paste(toupper(gsub("-", "", refSeq[[1]][refStartAln:refEndAln])), collapse="")
		loops.df[loops.df$structure == json$ref, seqColName] = refSubseq



		# Get length of each element for each sequence
		for (target in names(aln)){
		
		
			#print(paste(ele, target))


			targetStart = loops.df[loops.df$structure == target, beforeEndName] + 1
			targetEnd = loops.df[loops.df$structure == target, afterStartName] - 1


			targetSeq = aln[target]
			targetSeqSS = toupper(as.character(aln2[target][[1]]))
			targetSeqSS[targetSeqSS == "G" | targetSeqSS == "I"] = "H" # Just one type of helix


			# Subsequence of element
			targetSubseq = paste(toupper(targetSeq[[1]][targetStart:targetEnd]), collapse="")
			targetSubseqSS = paste(toupper(targetSeqSS[targetStart:targetEnd]), collapse="")


			loops.df[loops.df$structure == target, startName] = targetStart
			loops.df[loops.df$structure == target, endName] = targetEnd
			loops.df[loops.df$structure == target, seqColName] = targetSubseq

		}


	}

}




# Summarise
summary.df = data.frame(family = unique(loops.df$family[loops.df$family != json$refDir]))
for (ele in elements){
	summary.df[,paste0(ele, ".dlength")] = NA
}

for (family in summary.df$family){


	for (ele in elements){

		lengthName = paste0(ele, ".dlength")
		startName = paste0(ele, ".start")
		endName = paste0(ele, ".end")
		seqName = paste0(ele, ".seq")


		# Ref seq length (without gaps)
		#refStart = loops.df[loops.df$family == json$refDir, startName]
		#refEnd = loops.df[loops.df$family == json$refDir, endName]
		#refLength = refEnd - refStart + 1
		refLength = nchar(gsub("-", "", loops.df[loops.df$structure == json$ref, seqName]))

		# Target family lengths
		#starts = loops.df[loops.df$family == family, startName]
		#ends = loops.df[loops.df$family == family, endName]
		#lengths = ends - starts + 1
		lengths = nchar(gsub("-", "", loops.df[loops.df$family == family, seqName]))
		dlength =  mean(lengths) - refLength

		summary.df[summary.df$family == family,lengthName] = round(dlength, 0)


	}


}



min.size = 7

pdf("inserts.pdf", width = 8, height = 12)

plot(0, 0, type="n", xlim=c(0, length(elements)+1), ylim=c(-20, 130), xlab = "SSE", ylab = "Average insert size", axes=F, xaxs="i", yaxs="i", main = "Size of insert relative to GlyT 5F5W")
grid(, nx=length(elements)+1, ny=0)

rect(0, -min.size, length(elements)+1, min.size, col="#69696966", border=NA)
abline(0, 0, lwd=2, col="#696969", lty="dashed")
abline(min.size, 0, lwd=2, col="#696969")
abline(-min.size, 0, lwd=2, col="#696969")
text(0.1, min.size+1, "Insertion", adj = c(0, 1), srt=90)
text(0.1, -min.size-1, "Deletion", adj = c(1, 1), srt=90)

for (i in 1:length(elements)){

	ele = elements[i]
	lengthName = paste0(ele, ".dlength")
	dlengths = summary.df[,lengthName]
	families = summary.df$family
	points(rep(i, length(dlengths)), dlengths, pch=16)


	families = families[order(dlengths)]
	dlengths = dlengths[order(dlengths)]

	odd = TRUE
	for (j in 1:length(dlengths)){

		if (dlengths[j] > min.size | dlengths[j] <= -min.size){

			if (odd){
				text(i+0.1, dlengths[j], families[j], adj=c(0, 0.5))
			}else{
				text(i-0.1, dlengths[j], families[j], adj=c(1, 0.5))
			}
			odd = !odd
			
		}

	}


}



axis(1, at = 0:(length(elements)+1), labels = c("", elements, ""))
axis(2, las=2)


dev.off()



# Get the aligned-position of a site in the full alignment, based on an aligment of a subsequence
getPosInOriginalAlignment = function(acc, alnFull, alnSub, posSubseqAln, eleName=""){


	nsitesDomain = length(alnSub[[acc]])
	if (posSubseqAln > nsitesDomain){
		cat(paste("Warning: position", posSubseqAln, "is longer than the alignment", length(alnSub), "for", acc, eleName, "\n"))
		return(-1)
	}

	# Position in domain sequence
	subSeq = alnSub[[acc]][posSubseqAln:nsitesDomain] 
	subSeq_nogap = paste(subSeq[subSeq != "-"], collapse = "")
	
	
	# Take just the first 20 non gap elements for alignment efficieny
	subSeq_nogap = substr(subSeq_nogap, 1, 20)

	# Position in full sequence
	fullSeq = alnFull[[acc]]
	fullSeq_nogap = paste(fullSeq[fullSeq != "-"], collapse = "")
	
	a = pairwiseAlignment(fullSeq_nogap, subSeq_nogap, type="local")
	posFullSeq = start(pattern(a))
	
	#posFullSeq = str_locate_all(fullSeq_nogap, subSeq_nogap)
	#if (is.na(posFullSeq[[1]][1])){
		#stop(paste("Warning: cannot find", toupper(subSeq_nogap), "in full alignment for", acc, eleName, "\n"))
		#return(-1)
	#}
	#if (length(posFullSeq) > 1){
		#cat(paste("Warning: found", length(posFullSeq), "matches in in full alignment of string", toupper(subSeq_nogap), "for", acc, eleName, "- using first match\n"))
	#}
	#posFullSeq = posFullSeq[[1]][1]
	#print(paste(acc, "found match for", toupper(subSeq_nogap), "at", posFullSeq))

	# Position in full alignment
	nsites = length(fullSeq)
	seqPosNum = 1
	for (siteNum in 1:nsites){
		char = fullSeq[siteNum]
		if (char == "-"){
		
		}else{
			if (seqPosNum == posFullSeq) {
				return(siteNum)
			}
			seqPosNum = seqPosNum + 1
		}
	}
	
	cat(paste("Warning: unexpected problem. Could not find pos", seqPosNum, "in", acc, eleName, "\n"))
	-1
	

}



# 1-2 reference structures per family, to keep the alignment tractable
referenceStructures = character(0)
for (family in unique(loops.df$family)){
	jsonFamily = fromJSON(file = paste0(json$classDir, "/", family, "/info.json"))
	referenceStructures = c(referenceStructures, paste0(json$classDir, "/", family, "/data/", jsonFamily$ref_str))
}
referenceStructureNames = gsub(".+/", "", referenceStructures)




# Make a directory for each see with an indel >5 and a sequence >= 12
MIN.LEN = 12
for (ele in elements){

	seqName = paste0(ele, ".seq")
	startName = paste0(ele, ".start")
	endName = paste0(ele, ".end")

	sub.df = loops.df[sapply(loops.df$structure, function(ele) any(ele == referenceStructureNames)),]

	ref.len = nchar(gsub("-", "", loops.df[loops.df$structure == json$ref,seqName]))
	ele.lens = nchar(gsub("-", "", sub.df[,seqName]))
	ele.insertion.size = ele.lens - ref.len
	keep = which(ele.lens >= MIN.LEN)# & (ele.insertion.size > 5 | ele.insertion.size < -5))


	if (length(keep) > 1){


		targets = sub.df[keep,"structure"]
		families = sub.df[keep,"family"]
		familiesUnq = sort(unique(families))
		cat(paste("Found", length(keep), "large indels for", ele, "across", length(familiesUnq), "families:", paste(familiesUnq, collapse=", "), "\n"))

		dir.create(ele, showWarnings = FALSE)



		# Truncate the pdb files
		structures = paste0(json$classDir, "/", families, "/data/structures/", targets)
		alignments = paste0(sub.df[keep,"dir"], "/data/align.ali")
		startPositions = sub.df[keep,startName]
		endPositions = sub.df[keep,endName] 
		
		
		


		dir.create(paste0(ele, "/data"), showWarnings = FALSE)
		dir.create(paste0(ele, "/data/structures"), showWarnings = FALSE)
		for (k in 1:length(keep)){
			pdbFile = structures[k]
			names(aln) = gsub(".+/", "", names(aln))
			
			family = families[k]
			target = gsub(".+/", "", pdbFile)
			
			
			# Original alignment
			alnFull = read.fasta(paste0(json$classDir, "/", family, "/data/align.ali"))
			names(alnFull) = gsub(".+/", "", names(alnFull))
			
			# Domain alignment
			d = loops.df[loops.df$family == family,"dir"][1]
			alnDomain = read.fasta(alignments[k])
			names(alnDomain) = gsub(".+/", "", names(alnDomain))
				
			# Position of start/end in domain alignment 
			aln.start.pos = startPositions[k]
			aln.end.pos = endPositions[k]

			# Find the position of the start/end in the full alignment 'alnFam' (not the domain alignment 'aln')
			aln.full.start.pos = getPosInOriginalAlignment(target, alnFull, alnDomain, aln.start.pos, ele)
			aln.full.end.pos = getPosInOriginalAlignment(target, alnFull, alnDomain, aln.end.pos, ele)


			pdbFileTruncated = truncatePDBFile(pdbFile, alnFull[[target]], aln.full.start.pos, aln.full.end.pos)

			if (length(pdbFileTruncated) == 1 && is.na(pdbFileTruncated)){

				# Too short to align

			}else{

				write(paste(pdbFileTruncated, collapse="\n"), paste0(ele, "/data/structures/", gsub(".+/", "", pdbFile)))


			}

		}



		# JSON file
		JSON = list()
		JSON$fullName = paste(json$class, "catalytic domain", ele)
		JSON$class = json$class
		JSON$icon = "/fig/icon_white.png"
		JSON$description = paste("Cataytic domain for class", json$class, ele)


		exportJSON <- toJSON(JSON, indent=4)
		write(exportJSON, paste0(ele, "/info.json"))




	}else{
		cat(paste("Found nothing for", ele, "\n"))
	}



}






# Write JSON files per family
for (family in unique(loops.df$family)){


	print(family)


	structures = c(json$ref, loops.df[loops.df$family == family,"structure"])
	structures = unique(structures)

	JSON = list()
	JSON[["elements"]] = elements
	JSON[["accessions"]] = structures
	JSON[["refSeq"]] = json$ref


	# Original alignment
	alnFull = read.fasta(paste0(json$classDir, "/", family, "/data/align.ali"))
	names(alnFull) = gsub(".+/", "", names(alnFull))
	
	# Domain alignment
	d = loops.df[loops.df$family == family,"dir"][1]
	alnDomain = read.fasta(paste0(d, "/data/align.ali"))
	names(alnDomain) = gsub(".+/", "", names(alnDomain))


	for (ele in elements){

		seqName = paste0(ele, ".seq")
		startName = paste0(ele, ".start")
		endName = paste0(ele, ".end")
		lenName = paste0(ele, ".length")
		dlenName = paste0(ele, ".dlength")


		# Position in alignment where the element begins and ends
		aln.start.pos.all = numeric(0)
		aln.end.pos.all = numeric(0)

		for (target in structures){


			if (target != json$ref) {
			
				# Position of start/end in domain alignment 
				aln.start.pos = loops.df[loops.df$structure == target, startName]
				aln.end.pos = loops.df[loops.df$structure == target, endName]

				# Find the position of the start/end in the full alignment 'alnFam' (not the domain alignment 'aln')
				aln.full.start.pos = getPosInOriginalAlignment(target, alnFull, alnDomain, aln.start.pos, ele)
				aln.full.end.pos = getPosInOriginalAlignment(target, alnFull, alnDomain, aln.end.pos, ele)
				
				aln.start.pos.all = c(aln.start.pos.all, aln.full.start.pos)
				aln.end.pos.all = c(aln.end.pos.all, aln.full.end.pos)
				
				JSON[[paste0(target, "_", startName)]] = aln.full.start.pos
				JSON[[paste0(target, "_", endName)]] = aln.full.end.pos
			
			}
			
			JSON[[paste0("median_", startName)]] = floor(median(aln.start.pos.all))
			JSON[[paste0("median_", endName)]] = ceiling(median(aln.end.pos.all))
			
			refLength = nchar(gsub("-", "", loops.df[loops.df$structure == json$ref, seqName]))
			target.len = nchar(gsub("-", "", loops.df[loops.df$structure == target, seqName]))
			dlength =  target.len - refLength

			JSON[[paste0(target, "_", dlenName)]] = dlength
			JSON[[paste0(target, "_", lenName)]] = target.len
		}

		JSON[[paste0(ele, ".aln.start")]] = aln.start.pos
		JSON[[paste0(ele, ".aln.end")]] = aln.end.pos

	}


	exportJSON <- toJSON(JSON, indent=4)
	write(exportJSON, paste0(json$classDir, "/", family, "/catalytic.json"))


}



write.table(loops.df, "loops.tsv", sep="\t", quote=F, row.names=F)
write.table(summary.df, "summary.tsv", sep="\t", quote=F, row.names=F)



#write(paste(paste0(">", names(startSequences), "\n", as.character(startSequences)), collapse="\n"), "start-loops.fasta")
#write(paste(paste0(">", names(endSequences), "\n", as.character(endSequences)), collapse="\n"), "end-loops.fasta")





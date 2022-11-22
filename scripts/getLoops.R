library(seqinr)
library(rjson)


# Read reference json
json = fromJSON(file = "reference.json")



# Prepare table
loops.df = data.frame( family = json$refDir, structure = json$ref)
elements = names(json$elements)
for (ele in elements){
	r = as.character(json$elements[ele])
	loops.df[paste0(ele, ".start")] = as.numeric(strsplit(r, "-")[[1]][1]) + 1 - json$alnStartAt
	loops.df[paste0(ele, ".end")] = as.numeric(strsplit(r, "-")[[1]][2]) + 1 - json$alnStartAt
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


startSequences = character(0)
endSequences = character(0)
for (d in dirs){

	bits = strsplit(gsub(".*/", "", d), "_")[[1]]
	targetDir = bits[bits != json$refDir]


	# Open the alignments
	aln = read.fasta(paste0(d, "/data/align.ali"))
	aln2 = read.fasta(paste0(d, "/data/secondary.fasta"))
	names(aln) = gsub(".*/", "", names(aln))
	names(aln2) = names(aln)

	# Reference sequence
	refSeq = aln[json$ref]

	# Remove members outside of the target family
	keep = as.logical(sapply(names(aln), function(ele) all(ele != json$ignore) && ele != json$ref))
	aln = aln[keep]



	# Add to dataframe
	loops.df2 = loops.df[rep(1,length(aln)),]
	for (col in colnames(loops.df2)){
		loops.df2[,col] = NA
	}
	loops.df2$structure = names(aln)
	loops.df2$family = targetDir
	loops.df = rbind(loops.df, loops.df2)


	# For each element in structure
	nsites = length(refSeq[[1]])
	for (ele in elements){


		eleType = substr(ele, 1, 1)
		if (eleType == "S") eleType = "E" # Strand

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
		loops.df[loops.df$structure == json$ref,seqColName] = refSubseq
		refLen = refEnd - refStart + 1


		# Get length of each element for each sequence
		for (target in names(aln)){


			targetSeq = aln[target]
			targetSeqSS = toupper(as.character(aln2[target][[1]]))
			targetSeqSS[targetSeqSS == "G" | targetSeqSS == "I"] = "H" # Just one type of helix


			# Get mid point
			targetPos = nchar(gsub("-", "", paste0(targetSeq[[1]][1:ceiling((refStartAln+refEndAln)/2)], collapse="")))

			# Ensure this is the right element
			if (targetSeqSS[targetPos] != eleType & targetSeqSS[targetPos] != "-"){
				stop(paste("Expected sse", eleType, "but found", targetSeqSS[targetPos], "for", ele, "in", target))
			}

			# Extend to the end of the helix/strand. Allow for gaps
			targetStart = targetPos-1
			targetEnd = targetPos+1
			while (targetStart > 1 & (targetSeqSS[targetStart-1] == eleType | targetSeqSS[targetStart-1] == "-")){
				targetStart = targetStart - 1
			}
			while (targetEnd < nsites & (targetSeqSS[targetEnd+1] == eleType | targetSeqSS[targetEnd+1] == "-")){
				targetEnd = targetEnd + 1
			}



			# Subsequence of element
			targetStart = nchar(gsub("-", "", paste0(targetSeq[[1]][1:refStartAln], collapse="")))
			targetEnd = nchar(gsub("-", "", paste0(targetSeq[[1]][1:refEndAln], collapse="")))
			targetSubseq = paste(toupper(targetSeq[[1]][refStartAln:refEndAln]), collapse="")






			# Add to df
			loops.df[loops.df$structure == target, startName] = targetStart
			loops.df[loops.df$structure == target, endName] = targetEnd
			loops.df[loops.df$structure == target, seqColName] = targetSubseq
			#loops.df[loops.df$structure == target, seqStartColName] = targetStartSubSeq
			#loops.df[loops.df$structure == target, seqEndColName] = targetEndSubSeq


			len = targetEnd - targetStart + 1
			if (len - refLen >= 10){


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


		# Ref seq length
		refStart = loops.df[loops.df$family == json$refDir, startName]
		refEnd = loops.df[loops.df$family == json$refDir, endName]
		refLength = refEnd - refStart + 1

		# Target family lengths
		starts = loops.df[loops.df$family == family, startName]
		ends = loops.df[loops.df$family == family, endName]
		lengths = ends - starts + 1
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




write.table(loops.df, "loops.tsv", sep="\t", quote=F, row.names=F)
write.table(summary.df, "summary.tsv", sep="\t", quote=F, row.names=F)



write(paste(paste0(">", names(startSequences), "\n", as.character(startSequences)), collapse="\n"), "start-loops.fasta")
write(paste(paste0(">", names(endSequences), "\n", as.character(endSequences)), collapse="\n"), "end-loops.fasta")




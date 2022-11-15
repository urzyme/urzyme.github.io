library(rjson)
library(seqinr)


# Prepare a json file summarising the pairwise alignment
args = commandArgs(trailingOnly=TRUE)

if (length(args) != 2){
	stop(paste("Use: Rscript pairwiseJSON.R <json1> <json2>"))
}



json1 = fromJSON(file = args[1])
json2 = fromJSON(file = args[2])



# Output json
JSON = list()
JSON$fullName = paste(json1$name, "vs", json2$name, "pairwise comparison")
JSON$class = json1$class
JSON$icon = "/fig/icon_white.png"
JSON$family1 = json1$name
JSON$family2 = json2$name
JSON$fullName1 = json1$fullName
JSON$fullName2 = json2$fullName


# Introduction
JSON$description = paste0("Pairwise comparison of the ", JSON$class, " catalytic domains from the ", json1$fullName, " (", json1$name, ") and ", json2$fullName, " (", json2$name, ") families. 
	Monomeric structures from the two families were aligned using 3DCOMB. The cross-family RMSD is the average RMSD between pairs of structures from different families, and is
	 larger than the total RMSD, which compares structures both within- and between-families. ")




# Total RMSD
rmsd = readLines("data/align.sco")
rmsd = as.numeric(strsplit(rmsd[2], " +")[[1]][3])
JSON$rmsd = rmsd


# Cross-family RMSD
pdb = readLines("data/align.pdb")
pdb = pdb[grep("^ATOM", pdb)] # Atoms only
fasta = read.fasta("data/align.ali")
chains_all = substr(pdb, 22, 22)
chains = unique(chains_all[chains_all != " "])
names(fasta) = chains

# Match chains to families
nstructures1 = length(readLines(gsub("info.json", "data/structures.txt", args[1])))
nstructures2 = length(readLines(gsub("info.json", "data/structures.txt", args[2])))
if (nstructures1 + nstructures2 != length(chains)){
	stop(paste("The number of structures in the families does not match the number of structures in the alignment.", nstructures1, "+", nstructures2, "!=", length(chains)))
}


# Pairwise rmsd within and between families
distance.mat = matrix(-1, nrow = length(chains), ncol = length(chains))
rownames(distance.mat) = chains
colnames(distance.mat) = chains 

for (s1 in rownames(distance.mat)){

	xyz_1 = pdb[chains_all == s1 & substr(pdb, 14, 15) == "CA"]
	x1 = as.numeric(substr(xyz_1, 32, 38))
	y1 = as.numeric(substr(xyz_1, 39, 46))
	z1 = as.numeric(substr(xyz_1, 47, 54))


	for (s2 in colnames(distance.mat)){


		if (s1 == s2){
			next
		}



		xyz_2 = pdb[chains_all == s2 & substr(pdb, 14, 15) == "CA"]
		x2 = as.numeric(substr(xyz_2, 32, 38))
		y2 = as.numeric(substr(xyz_2, 39, 46))
		z2 = as.numeric(substr(xyz_2, 47, 54))


		site_distance_sum = 0
		nsites = 0

		# Iterate through alignment positions
		seq1 = fasta[[s1]]
		seq2 = fasta[[s2]]
		pdb1_pos = 1
		pdb2_pos = 1
		for (aln_pos in 1:length(seq1)){


			site1 = seq1[aln_pos]
			site2 = seq2[aln_pos]
			if (site1 != "-" && site2 != "-"){


				x1_pos = x1[pdb1_pos]
				x2_pos = x2[pdb2_pos]
				y1_pos = y1[pdb1_pos]
				y2_pos = y2[pdb2_pos]
				z1_pos = z1[pdb1_pos]
				z2_pos = z2[pdb2_pos]


				site_distance = (x1_pos-x2_pos)^2 + (y1_pos-y2_pos)^2+  (z1_pos-z2_pos)^2
				site_distance_sum = site_distance_sum + site_distance
				nsites = nsites + 1

			}

			# Increment pdb positions if not gap
			if (site1 != "-"){
				pdb1_pos = pdb1_pos + 1
			}
			if (site2 != "-"){
				pdb2_pos = pdb2_pos + 1
			}


		}


		rmsd = sqrt(site_distance_sum / nsites)
		distance.mat[s1,s2] = rmsd


	}

}


# Pairwise rmsd within and between families
fam1 = chains[1:nstructures1]
fam2 = chains[(nstructures1+1):(nstructures1+nstructures2)]

# Within family 1
rmsd1 = unlist(distance.mat[fam1,fam1])
JSON$rmsd1 = signif(mean(rmsd1[rmsd1 >= 0]), 3)


# Within family 2
rmsd2 = unlist(distance.mat[fam2,fam2])
JSON$rmsd2 = signif(mean(rmsd2[rmsd2  >= 0]), 3)

# Cross families
rmsd12 = unlist(distance.mat[fam1,fam2])
JSON$crossFamilyRmsd = signif(mean(rmsd12), 3)


total  = unlist(distance.mat)
JSON$rmsdTotal = signif(mean(total[total >= 0]), 3)


exportJSON <- toJSON(JSON, indent=4)
write(exportJSON, "info.json")

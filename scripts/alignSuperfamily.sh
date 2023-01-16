#!/bin/sh


#domains=( "Protozyme" "Catalytic_domain" )
#domains=( "Crossover_1" "Catalytic_domain" )



# Prepare one superfamily per domain
cd superfamily
for c in class2;
do

	cd $c
	
	for d in AlaR*/
	do

		echo "$c $d"
		mkdir -p $d


		cd $d
		

		mkdir -p data
		cd data

		# Put all reference structures into structures.txt
		Rscript ../../../../scripts/copyRefstructures.R ../../../../$c/ $d structures.txt ../info.json $c 

		# Align the reference structures
		~/DeepAlign/3DCOMB -i structures.txt -o align



		# Make a secondary structure fasta file from dssp
		Rscript ../../../../scripts/dssp2pdbMulti.R
		Rscript ../../../../scripts/dssp2fasta.R


		# Refine the alignment
		Rscript ../../../../scripts/refineMSA.R align.ali secondary.fasta
		mv align.ali unrefined.fasta
		mv refined.fasta align.ali
		Rscript ../../../../scripts/dssp2fasta.R


		# Realign some regions?
		Rscript ../../../../scripts/realignRegions.R align.ali secondary.fasta ../info.json
		mv align.ali refined.fasta
		mv realigned.fasta align.ali
		Rscript ../../../../scripts/dssp2fasta.R




		# Add the remaining family members to the alignment by aligning them to their reference structure
		Rscript ../../../../scripts/addFamilyMembersToAlignment.R ../../../../$c/ $d structures.txt align.ali

		#~/DeepAlign/3DCOMB -i structures.txt -o align

		# Refine the alignment
		#Rscript ../../../../scripts/refineMSA.R align.ali secondary.fasta
		#mv align.ali unrefined.fasta
		#mv refined.fasta align.ali
		#Rscript ../../../../scripts/dssp2fasta.R



		

		cd ../


		cd ../


	done

	cd ../


done





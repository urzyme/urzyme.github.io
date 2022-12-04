#!/bin/sh


# Produce alignments for each sse region


# Prepare all alignments
cd elements
for c in class2;
do

	cd $c


	Rscript ../../scripts/getElements.R

	for d1 in */;
	do


		echo "Aligning $c $d1"
		cd $d1

		cp ../../template.html index.html
		cp ../../features.tsv .

		cd data

		rm -r -f dssp
		mkdir -p dssp

		rm -f structures.txt
		touch structures.txt

		cd structures/
		for f in *.pdb;
		do

			mkdssp -i $f -o $f.dssp
			mv $f.dssp ../dssp/.
			echo "structures/$f" >> ../structures.txt
			Rscript ../../../../../scripts/dssp2pdb.R ../dssp/$f.dssp $f

		done
		cd ../



		../../../../../DeepAlign/3DCOMB -i structures.txt -o align
		
		#Rscript ../../../../scripts/pdb2fasta.R structures.txt unaligned.fasta
		#mafft unaligned.fasta > align.ali
		#rm unaligned.fasta
		
		Rscript ../../../../scripts/dssp2pdbMulti.R

		# Make a secondary structure fasta file from dssp
		Rscript ../../../../scripts/dssp2fasta.R


		cd ../
		cd ../



	done

	cd ../

done



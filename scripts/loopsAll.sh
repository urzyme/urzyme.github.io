#!/bin/sh


# Produce alignments for each sse region


# Prepare all alignments
cd loops
for c in class*;
do

	cd $c


	#Rscript ../../scripts/getLoops.R

	for d1 in */;
	do


		echo "Aligning $d1"
		cd $d1

		cp ../../template.html index.html

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
		mkdssp -i align.pdb -o align.dssp
		Rscript ../../../../scripts/dssp2pdb.R align.dssp align.pdb

		# Make a secondary structure fasta file from dssp
		Rscript ../../../../scripts/dssp2fasta.R


		cd ../
		cd ../



	done

	cd ../

done



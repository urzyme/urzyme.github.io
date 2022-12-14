#!/bin/sh

# sudo apt-get install dssp

cd data

rm -f structures.txt
touch structures.txt


rm -r -f dssp
mkdir -p dssp
cd structures/
for f in *.pdb;
do

	echo $f
	echo "structures/$f" >> ../structures.txt
	mkdssp -i $f -o $f.dssp
	mv $f.dssp ../dssp/.
	Rscript ../../../../scripts/dssp2pdb.R ../dssp/$f.dssp $f

done
cd ../

# Structural alignment
~/DeepAlign/3DCOMB -i structures.txt -o align


# Hinge alignment
rm -rf hinges
mkdir hinges
cd hinges
Rscript ../../../../scripts/prepareHinges.R ../../info.json 1


# Pairwise alignment each structure with the ref hinge to get the hinge position in every sequence
for r in region*;
do
	echo $r
	cd $r
	echo "structure,startPos" > startPos.csv
	for f in ../../dssp/*.pdb;
	do
		#echo $f
		~/DeepAlign/DeepAlign hinge_str.pdb $f -o alignment &> out.err
		
		# Extract start position
		line=$(sed '5!d' alignment.local)
		startPos=${line:16:5}
		echo "$f,$startPos" >> startPos.csv
		
		rm alignment*
		rm out.err
		
	done
	cd ../

done




# Truncate all pdb files to fit in the hinges
Rscript ../../../../scripts/prepareHinges.R ../../info.json 2


# Multiple alignment
for r in region*;
do
	echo $r
	cd $r
	~/DeepAlign/3DCOMB -i structures.txt -r -o align
	
	cd ../
done


# Glue the alignments back together
Rscript ../../../../scripts/prepareHinges.R ../../info.json 3

cd ../
rm -rf hinges
mv align.hinge.ali align.ali


# DSSP
Rscript ../../../scripts/dssp2pdbMulti.R


# Make a secondary structure fasta file from dssp and alignment
Rscript ../../../scripts/dssp2fasta.R




# Refine the alignment
Rscript ../../../scripts/refineMSA.R align.ali secondary.fasta
mv align.ali unrefined.fasta
mv refined.fasta align.ali
Rscript ../../../scripts/dssp2fasta.R

exit




# Features
rm -r -f domains
mkdir domains
Rscript ../../../scripts/mkdomains.R
cd domains


for d in *;
do
	echo "aligning feature: $d"
	cd $d
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
		Rscript ../../../../../../scripts/dssp2pdb.R ../dssp/$f.dssp $f

	done
	cd ../


	

	~/DeepAlign/3DCOMB -i structures.txt -o align
	Rscript ../../../../../scripts/dssp2pdbMulti.R


	# Make a secondary structure fasta file from dssp
	Rscript ../../../../../scripts/dssp2fasta.R

	cd ../


done

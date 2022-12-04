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




../../../../DeepAlign/3DCOMB -i structures.txt -o align
Rscript ../../../scripts/dssp2pdbMulti.R


# Make a secondary structure fasta file from dssp and alignment
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


	

	../../../../../../DeepAlign/3DCOMB -i structures.txt -o align
	Rscript ../../../../../scripts/dssp2pdbMulti.R


	# Make a secondary structure fasta file from dssp
	Rscript ../../../../../scripts/dssp2fasta.R

	cd ../


done

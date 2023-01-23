# urzyme.github.io
Collection of of amino acyl tRNA synthetases (aaRS). This project is under active development and is a work in progress.

To view the website please visit http://urzyme.github.io





## Generating alignments

The code on this repository can readily be repurposed for visualising non-aaRS proteins. The only required input is 2 or more pdb files per protein family of interest.

### Dependencies

**DeepAlign.** This is used for generating protein structure alignments and can be downloaded here:
https://github.com/realbigws/DeepAlign


It is assumed that the DeepAlign directory is installed in the home directory ```~/DeepAlign```


**DSSP.** This is used for defining secondary structures from pdb files. It can be installed using 
```sudo apt-get install dssp```


### Use

Ensure that all of the pdb files are in the ```\*/\*/data/structures``` directories and then run: 
```bash scripts/alignAll.sh```

or to only align a single protein dataset (for example arg) use:
```
cd class1/arg/
bash ../../scripts/align.sh

```

To ensure that the accession names and metadata are up to date, edit the tsv file `data/accessions.tsv` accordingly. Then convert the file into json format using:

```
cd data
Rscript ../scripts/tsv2json.R accessions.tsv accession
``` 

Ensure that the 'accession' column is the same as the pdb file name (without .pdb on the end).


## Running the website locally
Navigate to the root of this repository and run

``
http-server
``

Then open the local host in the web-browser. For many machines this address is:

``
http://localhost:8080/
``



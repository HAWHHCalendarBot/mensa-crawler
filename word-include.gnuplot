#!/usr/bin/env gnuplot

set datafile separator ","
set xdata time
set timefmt "%s"

set term svg size 1000,700 dynamic
set output "word-include.svg"

set key left top autotitle columnhead
# set style data linespoints
set title "Meals found with keyword in a month"
set ylabel "Number of Meals in the given month"
set ytics format "%0.0f"
# set xlabel "Date"
set xtics format "%b %y"

set style line 100 lc rgb "black" lw 1 dashtype 3
set style line 101 lc rgb "dark-gray" lw 1 dashtype 3
set grid xtics mxtics ytics linestyle 100, linestyle 101
set xtics 60 * 60 * 24 * 30 * 3
set mxtics 3

set boxwidth 60 * 60 * 24 * 25 / (lines + 1)
set style fill solid


plot for [i=1:lines] "tmp/word-include-".i.".csv" using 1:2 with boxes

set term png size 1000,700
set output "word-include.png"
replot

set term svg size 1000,700 dynamic
set output "pommes-twister.svg"
replot

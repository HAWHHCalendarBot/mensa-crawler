#!/usr/bin/env gnuplot

set datafile separator ","
set xdata time
set timefmt "%s"

set term svg size 1000,700 dynamic
set output "price.svg"

set key left top autotitle columnhead
set style data linespoints
set title "Average meal price per week (excluding soup)"
# set ylabel "Price"
set ytics format "%0.2f €"
# set xlabel "Date"
set xtics format "%b %y"

set style line 100 lc rgb "black" lw 1 dashtype 3
set style line 101 lc rgb "dark-gray" lw 1 dashtype 3
set grid xtics mxtics ytics linestyle 100, linestyle 101
set xtics 60 * 60 * 24 * 30 * 3
set mxtics 3

plot for [i=1:lines] "tmp/price-".i.".csv" using 1:2

set term png size 1000,700
set output "price.png"
replot

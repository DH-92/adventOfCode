#!/bin/bash

INPUT_FILE_PATH=${INPUT_FILE_PATH:-depths.txt}
#requires a valid session to download the file
#curl -so "$INPUT_FILE_PATH" https://adventofcode.com/2021/day/1/input

x=0;
y=0;
while IFS= read -r direction_line; do 
    key="$(echo ${direction_line} | cut -d' ' -f1)"
    value="$(echo ${direction_line} | cut -d' ' -f2)"
    case $key in
        forward)    (( x+=value )) ;;
        up)         (( y-=value )) ;;
        down)       (( y+=value )) ;;
    esac
done < "$INPUT_FILE_PATH"
echo $(( x*y ))

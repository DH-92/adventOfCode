#!/bin/bash

INPUT_FILE_PATH=${INPUT_FILE_PATH:-directions.txt}
#requires a valid session to download the file
#curl -so "$INPUT_FILE_PATH" https://adventofcode.com/2021/day/2/input

x=0;
y=0;
aim=0;
while read -r key value trash; do 
    case $key in
        forward)
            (( x+=value ))
            (( y+= $(( aim*value )) ))
            ;;
        up)         (( aim-=value )) ;;
        down)       (( aim+=value )) ;;
        *) echo "bad direction key: ${key} - fix me"; exit ;;
    esac
done < "$INPUT_FILE_PATH"

echo $(( x*y ))

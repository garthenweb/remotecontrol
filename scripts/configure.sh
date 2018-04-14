#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
chmod u+x $DIR/../bin/elro_wiringpi.py
gpio export 17 out

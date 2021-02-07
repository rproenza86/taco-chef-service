#!/bin/bash

# npm install &&  npm run build

for i in src/*; do echo transpiling $i function; (cd $i; npm install; npm run build); done


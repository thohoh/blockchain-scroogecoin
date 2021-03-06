#!/bin/bash

docker container stop kozlovcoin_container > /dev/null 2>&1
docker container rm kozlovcoin_container > /dev/null 2>&1
docker image rm thohoh/kozlovcoin:1 > /dev/null 2>&1
docker image build --no-cache -t thohoh/kozlovcoin:1 . /dev/null 2>&1

docker container run -p 3008:3008 \
                     -p 6001:6001 \
                     -d=false \
                     -v /tmp:/storage \
                     --name kozlovcoin_container \
                     thohoh/kozlovcoin:1
#!/bin/sh

docker run --rm \
       -p 127.0.0.1:1338:1337/tcp \
       -v /Users/rowellpica/Workarea/jeong/tinyboom-local-app:/workarea/tinyboom-local-app \
       -v /Users/rowellpica/Workarea/jeong/tmbs:/workarea/tmbs -i \
      --name tinyboom-local \
      --entrypoint bash \
      -t tinyboom/localapp

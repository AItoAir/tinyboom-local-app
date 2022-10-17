#!/bin/sh

docker run --rm \
       -p 127.0.0.1:1338:1337/tcp \
       -v $(pwd)/..:/workarea/tinyboom-local-app \
       -v $(pwd)/../tmbs:/workarea/tmbs -i \
      --name tinyboom-local \
      --entrypoint bash \
      -t tinyboom/localapp

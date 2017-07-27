#!/bin/bash
set -e -x
docker run --workdir /app --rm -it -v /quackdrive/programming/treenotes:/app node /bin/bash

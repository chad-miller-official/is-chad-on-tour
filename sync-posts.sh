#!/usr/bin/bash

lftp \
  -u chad@ischadontour.com \
  ftp://ftp.ischadontour.com \
  -e 'mirror -R --only-newer posts testing/posts; bye'

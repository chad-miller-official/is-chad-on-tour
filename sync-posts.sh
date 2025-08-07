#!/usr/bin/bash

lftp \
  -u chad@ischadontour.com \
  ftp://ftp.ischadontour.com \
  -e 'mirror -R posts testing/posts; bye'

#!/bin/bash
if grep -r "Aurum" *.html; then
  echo "Incorrect branding found."
  exit 1
else
  echo "No incorrect branding found."
  exit 0
fi

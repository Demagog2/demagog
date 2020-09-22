#!/usr/bin/env bash

function usage {
	cat <<EOM
Usage: $(basename "$0") [OPTION]...

  -d          refresh only database dump, not active storage blobs dump
  -h          display help
EOM

	exit 2
}

DATABASE_ONLY=false

while getopts 'd?h' c
do
  case $c in
    d) DATABASE_ONLY=true ;;
    h|?) usage ;;
  esac
done

echo "[1/2] Refreshing production db dump..."
ssh rails@188.226.140.217 '~/scripts/dump_production_db.sh'
scp rails@188.226.140.217:/tmp/demagog_production_db.zip /tmp/

if $DATABASE_ONLY; then
  echo "[2/2] Skipping refreshing of production active storage blobs dump"
else
  echo "[2/2] Refreshing production active storage blobs dump... (should take about 15 minutes)"
  ssh rails@188.226.140.217 '~/scripts/dump_production_active_storage_blobs.sh'
  scp rails@188.226.140.217:/tmp/demagog_production_active_storage_blobs.zip /tmp/
fi

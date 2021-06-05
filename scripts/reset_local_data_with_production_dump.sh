#!/usr/bin/env bash

function usage {
	cat <<EOM
Usage: $(basename "$0") [OPTION]...

  -d          reset only database, not active storage blobs
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

cd /tmp
rm -f demagog_production_db.sql
unzip -q demagog_production_db.zip
cd -

psql -U postgres -c 'REVOKE CONNECT ON DATABASE demagog_development FROM public;'
psql -U postgres -c "SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'demagog_development';";
psql -U postgres -c 'DROP DATABASE demagog_development';
psql -U postgres -c 'CREATE DATABASE demagog_development';
psql -d demagog_development -U postgres -f /tmp/demagog_production_db.sql

if ! $DATABASE_ONLY; then
  cd /tmp
  rm -rf demagog_production_active_storage_blobs
  unzip -q demagog_production_active_storage_blobs.zip
  cd -

  ACTIVE_STORAGE_BLOBS_DUMP_DIR=/tmp/demagog_production_active_storage_blobs
  LOCAL_STORAGE_DIR="`dirname $0`/../storage"

  rm -rf $LOCAL_STORAGE_DIR/*

  for filename in `/bin/ls "$ACTIVE_STORAGE_BLOBS_DUMP_DIR" | xargs`
  do
    dir=`echo $filename | cut -c 1-2`/`echo $filename | cut -c 3-4`
    mkdir -p "$LOCAL_STORAGE_DIR/$dir"
    mv "$ACTIVE_STORAGE_BLOBS_DUMP_DIR/$filename" "$LOCAL_STORAGE_DIR/$dir"
  done

  # Needed to make Active Storage resolve urls from local and not from amazon
  psql -U postgres -d demagog_development -c "UPDATE active_storage_blobs SET service_name = 'local'";
fi

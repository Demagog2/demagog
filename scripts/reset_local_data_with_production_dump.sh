#!/usr/bin/env bash

cd /tmp
rm demagog_production_db.sql
unzip -q demagog_production_db.zip
rm -r demagog_production_active_storage_blobs
unzip -q demagog_production_active_storage_blobs.zip
cd -

psql -U postgres -c 'DROP DATABASE demagog_development';
psql -U postgres -c 'CREATE DATABASE demagog_development';
psql -d demagog_development -U postgres -f /tmp/demagog_production_db.sql

ACTIVE_STORAGE_BLOBS_DUMP_DIR=/tmp/demagog_production_active_storage_blobs
LOCAL_STORAGE_DIR="`dirname $0`/../storage"

rm -rf $LOCAL_STORAGE_DIR/*

for filename in `/bin/ls "$ACTIVE_STORAGE_BLOBS_DUMP_DIR" | xargs`
do
  dir=`echo $filename | cut -c 1-2`/`echo $filename | cut -c 3-4`
  mkdir -p "$LOCAL_STORAGE_DIR/$dir"
  mv "$ACTIVE_STORAGE_BLOBS_DUMP_DIR/$filename" "$LOCAL_STORAGE_DIR/$dir"
done

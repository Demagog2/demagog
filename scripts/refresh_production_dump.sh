#!/usr/bin/env bash

echo "[1/2] Refreshing production db dump..."
ssh rails@demagog.cz '~/scripts/dump_production_db.sh'
scp rails@demagog.cz:/tmp/demagog_production_db.zip /tmp/

echo "[2/2] Refreshing production active storage blobs dump... (should take about 15 minutes)"
ssh rails@demagog.cz '~/scripts/dump_production_active_storage_blobs.sh'
scp rails@demagog.cz:/tmp/demagog_production_active_storage_blobs.zip /tmp/

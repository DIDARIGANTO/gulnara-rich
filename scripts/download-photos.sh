#!/bin/bash
set -e
PK='https%3A%2F%2Fdisk.yandex.kz%2Fd%2FK-Ia08dks-2xvQ'
HREF=$(curl -s "https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=$PK" | python3 -c "import sys,json; print(json.load(sys.stdin)['href'])")
curl -sL -o /tmp/ga-photos.zip "$HREF"
unzip -o -q /tmp/ga-photos.zip -d /Users/didar/Desktop/GA/assets/photos/raw/

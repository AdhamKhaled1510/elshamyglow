#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22
export ANDROID_HOME="$HOME/Android/Sdk"

cd /media/Data1/opencode/cosmetics-store/mobile/android

echo "Building APK... (first time may take 10-15 minutes)"
./gradlew assembleRelease 2>&1

echo ""
echo "=== If build succeeded, APK is at: ==="
echo "$(pwd)/app/build/outputs/apk/release/app-release.apk"

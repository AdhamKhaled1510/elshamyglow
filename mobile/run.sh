#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22

cd /media/Data1/opencode/cosmetics-store/mobile

# Start Expo
npx expo start --clear

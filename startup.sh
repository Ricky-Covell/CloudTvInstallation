#!/bin/bash
#flask backend
srcpath=$(pwd)
#source ~/.bashrc
source ~/miniconda3/etc/profile.d/conda.sh
conda activate base
sleep 20
echo "Launching flask"
cd $srcpath/backend
flask run > $srcpath/flask.log 2>&1 &
echo $! > $srcpath/flask.pid
#node frontend
echo "Launching node"
cd ../frontend
npm run dev > $srcpath/npm.log 2>&1 &
echo $! > $srcpath/npm.pid
#audio server
echo "Launching audio driver"
qjackctl --start &
sleep 20
echo "Launching supercollider"
cd ~/supercolliderStandaloneRPI64
export QT_QPA_PLATFORM=offscreen
export PATH=.:$PATH
./sclang -a -l ~/supercolliderStandaloneRPI64/sclang.yaml $srcpath/audio-main.scd > $srcpath/sclang.log 2>&1 &
echo $! > $srcpath/sclang.pid
#web browser
sleep 20
echo "Launching browser"
chromium-browser --kiosk http://localhost:3000 > $srcpath/chromium.log 2>&1 &
echo $! > $srcpath/chromium.pid

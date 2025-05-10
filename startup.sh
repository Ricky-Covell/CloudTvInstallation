#!/bin/bash
#flask backend
conda activate
cd ~/cloudtv-installation/backend
flask run &> ~/cloudtv-installation/flask.log
echo $! > ~/cloudtv-installation/flask.pid
#node frontend
cd ../frontend
npm run dev &> ~/cloudtv-installation/npm.log
echo $! > ~/cloudtv-installation/npm.pid
#audio server
cd ~/supercolliderStandaloneRPI64
export QT_QPA_PLATFORM=offscreen
#./sclang -a -l ~/supercolliderStandaloneRPI64/sclang.yaml ~/cloudtv-installation/audio-main.scd &> ~/cloudtv-installation/sclang.log
echo $! > ~/cloudtv-installation/sclang.pid
#web browser
sleep 5
#DISPLAY=:0 chromium-browser --kiosk --app=https://localhost:3000 &> chromium.log
echo $! > ~/cloudtv-installation/chromium.pid

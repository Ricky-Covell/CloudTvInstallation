# CloudTvInstallation

## Pregame

* Download this library of GOES vids (or use your own!): https://drive.google.com/drive/folders/1-hjqI-VZdboaNUtN27bgXjwqL6Uc7GpL?usp=sharing

* Drag files into /backend/GOES-renders/
  
* download Postgresql (if you don't still have it from your artist website)

* download 'npm' if you don't have it
  

## From Home Directory

* 'createdb cloudtv'


## From /backend

* Make virtual env
  
* 'pip install -r requirements.txt'  or equivalent
  
* 'python3 CloudPrinter.py --seed SEED'    should print 'OK'


## from /frontend

* 'npm install'

* double check that the GOES movie files are in /frontend/public/cloud-set

## run

* from /backend 'flask run'
* from /frontend 'npm run dev'
* from browser 'http://localhost:3000/'
* :)

#!/bin/bash
#first-time-only setup steps 
echo "copying videos"
cp ../GOES-renders/* ./backend/GOES-renders/
cd backend
source ~/.bashrc
echo "seeding server"
python3 CloudPrinter.py --seed SEED
cd ../frontend
echo "installing node packages"
npm install

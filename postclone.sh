#!/bin/bash
#first-time-only setup steps 
cp ../GOES-renders/* ./backend/GOES-renders/
cd backend
conda activate
python3 CloudPrinter.py --seed SEED
cd ../frontend
npm install

# cloudtv-installation
Interactive audiovisual installation based on animations of geostationary satellite imagery. Premiered at Lafayette Electronic Arts Festival 2025. Leah Bertrand and Ricky Covell.

Instructions for setting up a fresh Raspberry Pi to run the installation (tested on RPi 5, 2 GB RAM). Steps should be generally applicable to similar Linux distros. Note that the installation uses midiCC messages for interactivity (controls 0-16), such as a MIDIFighterTwister.
## MacOS notes
The process is streamlined somewhat on macOS – swap `sudo apt install` for `brew install`. Use `postgres.app` to make the postgresql process simpler. Install [standard version](https://supercollider.github.io/downloads) of supercollider. Use macOS `conda` install script ([details](https://github.com/conda-forge/miniforge)). Ignore the `jack`, `watchdog`, audio optimization, and startup script steps.

However, `miUGens` pre-compiled binaries will need to be de-quarantined. Run `("xattr -d -r com.apple.quarantine"+Platform.userExtensionDir.quote++"/mi-UGens").runInTerminal` from the supercollider interpreter to do this.
## First-time configuration

## (Operating system and video)
### 1. Install operating system
Install "Raspberry Pi OS (64-bit)" for your device using [Raspberry Pi Imager](https://www.raspberrypi.com/documentation/computers/getting-started.html#raspberry-pi-imager) (complete instructions [here](https://www.raspberrypi.com/documentation/computers/getting-started.html#installing-the-operating-system)).
### 2.  Package manager installs
```bash
sudo apt update
sudo apt upgrade
sudo apt install postgresql
sudo apt install nodejs
sudo apt install npm
```
### 3. Clone repo
```bash
cd ~
git clone https://github.com/Ricky-Covell/cloudtv-installation
```
### 4. Install node requirements
```shell
cd cloudtv-installation/frontend
npm install
```
### 5. Postgresql setup
Using example username `username`.
#### 5.1 Allow sockets in /tmp
Instructions [here](https://askubuntu.com/questions/1497006/psql-error-connection-to-server-on-socket). Add /tmp to socket path list.
```bash
sudo -u postgres psql -c 'SHOW config_file'
sudo vi /etc/postgresql/15/main/postgresql.conf
```
#### 5.2 Create user and database
```bash
sudo -u postgres -i
createuser username
createdb cloudtv
service postgresql start
exit
```
#### 5.3 Grant access to user
Explanation [here](https://stackoverflow.com/questions/67276391/why-am-i-getting-a-permission-denied-error-for-schema-public-on-pgadmin-4).
```bash
sudo -u postgres -i
psql
```
```sql
CREATE DATABASE cloudtv;
CREATE USER username;
GRANT ALL PRIVILEGES ON DATABASE cloudtv TO username;
\c EXAMPLE_DB postgres
# You are now connected to database "cloudtv" as user "postgres".
GRANT ALL ON SCHEMA public TO leah;
```
#### 5.4 Automatically start postgresql
Discussions of this question are [here](https://askubuntu.com/questions/1206416/how-to-start-postgresql) and [here](https://askubuntu.com/questions/539187/how-to-make-postgres-start-automatically-on-boot). But just run:
```bash
sudo systemctl enable postgresql
```
### 6. Python environment setup
#### 6.1 Install conda
Adapted from [miniforge instructions](https://github.com/conda-forge/miniforge).
```shell
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-aarch64.sh
bash Miniconda3-latest-Linux-aarch64.sh
source ~/.bash_profile
```
#### 6.2 Install python requirements
```shell
cd cloudtv-installation/backend
conda install -c conda-forge --file requirements.txt
```
### 7.  Set up server
#### 7.1 Download videos to backend/GOES-renders
#### 7.2 seed database
Also create missing directory (should be fixed soon)
```shell
mkdir ../frontend/public/cloud-set
python3 CloudPrinter.py --seed SEED
```
## (Audio)
### 8. Set up jack
#### 8.1 Install
```bash
sudo apt-get install qjackctl jackd2
```
#### 8.2 Configure
```bash
echo /usr/bin/jackd -P75 -dalsa -dhw:v10 -r48000 -p512 -n3 > ~/.jackdrc
```
The `-dhw` flag will depend on the audio device. If what's given doesn't work, run `qjackctl` and pick your audio interface from the GUI. You can find an explanation of these flags [here](https://madskjeldgaard.dk/posts/raspi4-notes/).

This should be it, since supercollider should be able to start jack on its own. Otherwise you can (1) just run the contents of `~/.jackdrc` in terminal, (2) start `jack` with the GUI in `qjackctl`, or (3) run `jack_control start`.
### 8. Set up supercollider
#### 8.1 Install supercollider
Install a (pre-compiled) supercollider standalone following the instructions from [here](https://github.com/redFrik/supercolliderStandaloneRPI64/).
```bash
git clone https://github.com/redFrik/supercolliderStandaloneRPI64 --depth 1
mkdir -p ~/.config/SuperCollider
cp supercolliderStandaloneRPI64/sc_ide_conf_temp.yaml ~/.config/SuperCollider/sc_ide_conf.yaml
```
Don't forget to change your `sc_ide_conf.yaml` as described if your username is not `pi`!
#### 8.2 Install mi-UGens extensions
Unfortunately, the pre-compiled binaries for this extension don't work on Raspberry Pi OS. Follow build instructions [here](https://github.com/v7b1/mi-UGens) and move the resulting `mi-UGens` folder to `supercolliderStandaloneRPI64/share/user/Extensions`.

## (System configuration)
### 9. Tweak audio settings
https://codeberg.org/rtcqs/rtcqs
### 10. Automatically start on boot

### 11. Add watchdog
#### 11.1 hardware watchdog
Add the following two lines to the bottom of ```/etc/systemd/system.conf```:
```ini
RuntimeWatchdogSec=15
RebootWatchdogSec=5min
```

This will reboot the computer after 15 seconds if it stops responding. It will wait 5 minutes for a gentle reboot before forcefully resetting the system.
#### 11.2 software watchdog
Restart supercollider, flask, node, and chromium if they are closed or crash.

# Startup instructions
These steps must be run each time after boot.
## Script
```bash
sudo vi /etc/xdg/autostart/display.desktop
```
```bash
[Desktop Entry]
Name=CloudTV
Exec=/usr/bin/bash -c 'cd ~/cloudtv-installation;./startup.sh'
```
## Manual
### 1. Check postgresql is running
```shell
sudo systemctl status postgresql
```
If it's not running, then start it with
```shell
sudo -u postgres -i
sudo service postgresql start
exit
```
and enter your password if prompted.
### 2. start web backend
```shell
cd ~/cloudtv-installation/backend
flask run &
```
### 3. start web frontend
```shell
cd ../frontend
npm run dev &
```
### 4. start audio
```shell
cd ~/supercolliderStandaloneRPI64
export QT_QPA_PLATFORM=offscreen
./sclang -a -l sclang.yaml ~/cloudtv-installation/audio-main.scd
```

### 5. start browser
```shell
DISPLAY=:0 chromium-browser --kiosk
```
## As startup script
# Audio






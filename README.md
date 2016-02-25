# PiProjects
raspberry Pi projects based on Node.JS

To Setup your Pi:
	• Format SD card with SDFormatter and select Format Size Adjustment = on
	• Copy files form Noob at raspberrypi.org and boot up Pi.  Pick raspbian Jessie option and let it install
	• The variant of Node.js v0.10.29 that comes preinstalled with Raspbian Jessie 2015-11-21 is broken. It's not possible to install Node.js native add-ons with this variant of Node.js. You need to remove it to update it.  
		○ Remove nodeJS by connecting to pi and logging in over SSH and follow the steps below. 
			sudo apt-get remove nodered
			sudo apt-get remove nodejs nodejs-legacy
			sudo apt-get remove npm   # if you installed npm
			
		○ Get latest version of nodeJS:
			sudo wget http://node-arm.herokuapp.com/node_latest_armhf.deb
			sudo dpkg -i node_latest_armhf.deb
			Node -v to see version (v4.2.1)
		
		○ Install github.
			sudo apt-get install git
			Pull files down for first time
			git clone git://github.com/JohnRucker/raspberryPiProjects.git
			To update files on pi type git pull from the project directory.  In this case cd to raspberryPi-Projects and then type git pull.


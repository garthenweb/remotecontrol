sudo apt-get install libdbus-1-dev libdbus-glib-1-dev libglib2.0-dev libical-dev libreadline-dev libudev-dev libusb-dev make

mkdir -p /tmp/bluepy
cd /tmp/bluepy
wget https://www.kernel.org/pub/linux/bluetooth/bluez-5.9.tar.xz
tar xvf bluez-5.9.tar.xz

cd bluez-5.32
./configure --disable-systemd
make
sudo make install

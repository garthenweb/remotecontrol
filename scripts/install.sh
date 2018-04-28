sudo apt-get update
sudo apt-get -y upgrade

sudo apt-get -y install bluez git-core

pushd /tmp

git clone git://git.drogon.net/wiringPi
pushd wiringPi && ./build
popd

sudo apt-get -y install python-dev python-setuptools swig
git clone https://github.com/WiringPi/WiringPi-Python.git
pushd WiringPi-Python
git submodule update --init
sudo python setup.py install
popd

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
source ~/.bashrc
nvm install 10.0.0

popd

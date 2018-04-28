# Remotecontrol

I started this projects back in the year 2013 to build my own smart home without spending a lot of money for smart home devices. I use it since then to control the light in my flat.

Supported features are:

- turn on/ off devices when entering/ leaving (using bluetooth)
- turn on/ off devices by web app
- turn on/ off by sunrise/ after sunset

## Requirements

The application is developed to work on an Raspberry Pi connected to your local network. Here is what you need to get everything up and running.

- Raspberry Pi
  - I am using Raspberry Pi Model B Rev 2 but a newer model should work as well
  - I would not suggest an older model for performance reasons
- SD Card
- Power Cable

To control simple power points

- 434 MHz Emitter
  - There are some options on the market, I bought this [RF Link Transmitter](https://www.exp-tech.de/module/wireless/funk/4390/rf-link-transmitter-434mhz-wrl-10534)
- Power points
  - There are some different brands that should all work. I verified Elro and [Brennstuhl (The old model, the new one might work as well)](https://www.amazon.de/Brennenstuhl-Funkschalt-Set-Funksteckdosen-Innenbereich-Kindersicherung). [Mumbi](https://www.amazon.de/mumbi-4-Kanal-1100-Funksteckdosen-FS300/dp/B002UJKW7K) should work as well.
- 3 or 4 [Jumper Wires](https://www.exp-tech.de/zubehoer/kabel/jumper-wires/5124/m/f-200mm-jumper-wires-40-stueck)
  - 3 are required to connect the Emitter to the Raspberry Pi
  - The 4th can be used to connect to the antenna or as well used as a antenna
- Optional: [433Mhz Helix Antenna](https://www.amazon.com/DAOKI-antenna-Helical-Control-Raspberry/dp/B01CGMOYYM) (for better reach)

To control Xiaomi Yeelight

- [Yeelight](https://www.lightinthebox.com/de/p/smart-led-gluehlampen-19-smd-600-lm-warmes-weiss-kuehles-weiss-rgb-v-1-stueck_p5944003.html)
  - I only tested the old version, the new one might work as well

## Install

Flash the [Raspbian strech lite rom](https://www.raspberrypi.org/downloads/raspbian/) onto your SD Card and stick it into the Raspberry PI.

* For 434 MHz power supply only

  * Connect the 434 MHz emitter to the Raspberry PI
    * You should follow the instructions of the Emitter you bought. For the Emitter recommended above you can find a [manuel in the docs folder](docs/TWS-BS-3_433.92MHz_ASK_RF_Transmitter_Module_Data_Sheet.pdf)
    * It is important to use the *GPIO port 17* of your Raspberry PI to connect the Emitter
  * Optional: Connect the Helix Antenna using a Jumper Wire with the antenna output of your Emitter
  * Note the unit and system code of at least one power supply

* Connect your Raspberry Pi to the local network and a power source.
* Connect via SSH into the Raspberry Pi
* Recommended: Use the [raspberry config](https://www.raspberrypi.org/documentation/configuration/raspi-config.md) to "Expand Filesystem", "Change Password" and "Change Timezone".
* Install git `sudo apt-get -y install git-core`
* Create folder for the application in `/var/www/remotecontrol`
* Clone the project `git clone https://github.com/garthenweb/remotecontrol.git /var/www/remotecontrol`
* Execute the install script `/var/www/remotecontrol/install.sh`
* Copy the service script `mv /var/www/remotecontrol/remotecontrol.service /etc/systemd/system/remotecontrol.service`
* Install node dependencies `pushd /var/www/remotecontrol && npm install && popd`
* Create a configuration file. See section [Configuration](#Configuration)
* Reboot `sudo reboot`

## Configuration

Create a JSON file within the root of the project called `locals.json` with the following properties.

- `tickInterval`: recommended value `1000`
- `bdaddrs`: array of bluetooth devices (use multiple devices with caution, this was never tested)
- `lat`: Latitude of your location (for weather details)
- `lng`: Longitude of your location (for weather details)
- `devices`: List of devices to control

Please see the [example](docs/example-locals.json) for more information.


### Devices (TBD)

- yeelight
  - discover devices
  - activate lan mode
- elro_power

## Groups (TBD)

- away (should be renamed to `activate_in_the_morning`)
- light (should be renamed to `coming_home_at_night`)

## Technical details (TBD)

- server side architecture based on redux
- uses a python script to communicate with sender
- communication via socket.io to the mobile app
- mobile app based on react
- mobile app and server share some reducers and domain models
- server imports sunrise and sunset from [sunrise-sunset.org](https://sunrise-sunset.org/)

## Contribution

This project fits more or less only my personal needs and can be improved in terms of configuration and ease to use in a lot of ways. Your help is highly valued!

In case you want to help, please create an issue and lets discuss about further development in case you have some ideas. If you don't know where to start here is a list of my own ideas:

- Alexa/ Google Home support
- Add color and saturation for yeelights
- Make configurable via app
- Docker container for easier deployment
- make GIOP port configurable
- Unit tests
- Pipeline
- Contribution guidelines
- Documentation of the technical architecture

Please let me also know in case you have troubles setting every thing up of if the documentation was not working for you!

## Guarantees

Please note that you use this project and all thats written within the documentation without any guarantee. Please think about what you are doing and read the source code before install and use this project.

I provide this project for free with my best conscience but you are using it on your own risk. I am not responsible for any damages this project is causing in any way to you or someone else, including physical and psychologically damages. I am also not responsible for any costs that result of using this project.

Please not that this project will make calls to the internet and your private network, scanning for bluetooth devices around you and can also cause costs by controlling electronic devices.

By using this project or single files of it you resign any claims resulting of its usage.

## License

Please not that some files within this project do not have a license:

* `bin/elro_wiringpi.py`
* `docs/TWS-BS-3_433.92MHz_ASK_RF_Transmitter_Module_Data_Sheet.pdf`
* `react/public/android-chrome-192x192.png`
* `react/public/android-chrome-256x256.png`
* `react/public/apple-touch-icon.png`
* `react/public/favicon-16x16.png`
* `react/public/favicon-32x32.png`
* `react/public/favicon.ico`
* `react/public/mstile-150x150.png`
* `react/public/safari-pinned-tab.svg`

All files not mentioned above are provided under the [MIT License](https://opensource.org/licenses/mit-license.php).

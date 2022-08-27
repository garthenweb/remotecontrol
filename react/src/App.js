import React from 'react';
import { connect } from 'react-redux';
import Button from './components/Button';
import deviceActions from './actions/device';
import './App.css';

const buttonClickFeedback = () => {
  if (typeof window.navigator.vibrate === 'function') {
    window.navigator.vibrate(25);
  }
};

function App({ devices, powerOn, powerOff, powerToggle }) {
  const deviceIds = Object.keys(devices);

  const onButtonOnClick = () => {
    buttonClickFeedback();
    powerOn(deviceIds);
  };
  const onButtonOffClick = () => {
    buttonClickFeedback();
    powerOff(deviceIds);
  };
  const onDeviceClick = (id) => () => {
    buttonClickFeedback();
    powerToggle(id);
  };

  return [
    <div key="group1" className="btn-group">
      <Button theme="on" primary onClick={onButtonOnClick} content="🔌" />
      <Button theme="off" primary onClick={onButtonOffClick} content="❌" />
    </div>,
    ...Object.values(devices).map(device => (
      <Button
        key={device.id}
        onClick={onDeviceClick(device.id)}
        content={device.name}
        meta={device.room}
        isActive={device.getSerializedStateOf('power', Boolean)}
      />
    )),
  ];
}

export default connect(state => state, deviceActions)(App);

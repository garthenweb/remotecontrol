import React from 'react';
import { connect } from 'react-redux';
import Button from './components/Button';
import deviceActions from './actions/device';
import './App.css';

function App({ devices, powerOn, powerOff, powerToggle }) {
  const deviceIds = devices.map(({ id }) => id);
  return [
    <div key="group1" className="btn-group">
      <Button onClick={() => powerOn(deviceIds)} content="Turn on" />
      <Button onClick={() => powerOff(deviceIds)} content="Shut off" />
    </div>,
    ...devices.map(device => (
      <Button
        key={device.id}
        onClick={() => powerToggle(device.id)}
        content={device.name}
        isActive={!!device.powerState}
      />
    )),
  ];
}

export default connect(state => state, deviceActions)(App);

export default function createDevice(...args) {
  // eslint-disable-next-line no-use-before-define
  return new Proxy(new Device(...args), {
    get(target, prop) {
      return target[prop] || target.state[prop];
    },
  });
}

export const POWER_ON = Object.create({
  valueOf() {
    return 1;
  },
});

export const POWER_OFF = Object.create({
  valueOf() {
    return 0;
  },
});

const initialProps = {
  power: false,
};

const initialState = {
  power: POWER_OFF,
};

class Device {
  constructor({ id, name, props = { ...initialProps }, state = initialState }) {
    Object.defineProperties(this, {
      id: {
        value: id,
        enumerable: true,
      },
      name: {
        value: name,
        enumerable: true,
      },
      props: {
        value: Object.freeze(props),
        enumerable: true,
      },
      state: {
        value: Object.freeze(state),
        enumerable: true,
      },
    });
  }

  copy(state) {
    const nextState = typeof state === 'function' ? state(this.state) : state;
    return createDevice({
      id: this.id,
      name: this.name,
      props: this.props,
      state: Object.freeze({
        ...this.state,
        ...nextState,
      }),
    });
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      props: { ...this.props },
      state: Object.keys(this.state).reduce((state, prop) => ({
        ...state,
        [prop]: this.getSerializedStateOf(prop),
      }), {}),
    };
  }

  getSerializedStateOf(state, transform) {
    const value = this.state[state].valueOf();
    if (transform) {
      return transform(value);
    }
    return value;
  }
}

export const togglePower = ({ power }) => ({
  power: power === POWER_OFF ? POWER_ON : POWER_OFF,
});

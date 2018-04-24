export default function createDevice(...args) {
  // eslint-disable-next-line no-use-before-define
  return new Proxy(new Device(...args), {
    get(target, prop) {
      return target[prop] || target.state[prop];
    },
  });
}

const POWER_ON_VALUE = 1;
export const POWER_ON = Object.create({
  valueOf() {
    return POWER_ON_VALUE;
  },
});

const POWER_OFF_VALUE = 0;
export const POWER_OFF = Object.create({
  valueOf() {
    return POWER_OFF_VALUE;
  },
});

const initialProps = {
  power: false,
};

const initialState = {
  power: POWER_OFF,
};

const deserializeState = (state) => ({
  power: (state.power !== POWER_OFF && Boolean(state.power)) ? POWER_ON : POWER_OFF,
});

class Device {
  constructor({
    id,
    name,
    props = { ...initialProps },
    state = initialState,
    settings,
    groups,
  }) {
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
        value: Object.freeze(deserializeState(state)),
        enumerable: true,
      },
      settings: {
        value: Object.freeze(settings),
        enumerable: true,
        configurable: true,
      },
      groups: {
        value: Object.freeze(groups),
        enumerable: true,
        configurable: true,
      },
    });
  }

  copy(state, settings = {}, groups) {
    const nextState = typeof state === 'function' ? state(this.state) : state;
    const nextSettings = typeof settings === 'function' ? state(this.settings) : settings;
    const nextGroups = typeof groups === 'function' ? state(this.groups) : groups;
    return createDevice({
      id: this.id,
      name: this.name,
      props: this.props,
      state: {
        ...this.state,
        ...nextState,
      },
      settings: {
        ...this.settings,
        ...nextSettings,
      },
      groups: {
        ...(nextGroups || this.groups),
      },
    });
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      props: { ...this.props },
      state: Object.keys(this.state).reduce(
        (state, prop) => ({
          ...state,
          [prop]: this.getSerializedStateOf(prop),
        }),
        {},
      ),
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

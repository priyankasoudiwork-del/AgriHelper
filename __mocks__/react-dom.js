// Manual mock for react-dom to work with mobx-react-lite in tests
// This provides just enough to make MobX happy without loading the actual react-dom

const mockReactDOM = {
  // MobX needs these internals
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    ReactCurrentDispatcher: {
      current: null,
    },
    ReactCurrentOwner: {
      current: null,
    },
  },
  // MobX needs this for batching
  unstable_batchedUpdates: (fn) => fn(),
  // Add other commonly used react-dom exports as needed
  render: jest.fn(),
  unmountComponentAtNode: jest.fn(),
  findDOMNode: jest.fn(),
  createPortal: jest.fn(),
};

module.exports = mockReactDOM;

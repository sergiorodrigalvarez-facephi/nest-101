export const SIMPLE_HAPPY_PATH = {
  customId: '1000-ABC',
  time: '2022-09-26T12:45:00Z',
  events: [
    {
      time: '2022-09-26T12:45:05Z',
      type: 'com.facephi.nest101.transaction.step_changed',
      data: {
        step: 'first step',
      },
    },
    {
      time: '2022-09-26T12:45:10Z',
      type: 'com.facephi.nest101.transaction.status_changed',
      data: {
        status: 'SUCCEEDED',
      },
    },
    {
      time: '2022-09-26T12:45:15Z',
      type: 'com.facephi.nest101.transaction.step_changed',
      data: {
        step: 'second step',
      },
    },
    {
      time: '2022-09-26T12:45:20Z',
      type: 'com.facephi.nest101.transaction.step_changed',
      data: {
        step: 'third step',
      },
    },
    {
      time: '2022-09-26T12:45:25Z',
      type: 'com.facephi.nest101.transaction.status_changed',
      data: {
        status: 'COMPLETED',
      },
    },
  ],
};

export const CONCURRENT_HAPPY_PATH = [
  {
    customId: '1001-ABC',
    time: '2022-09-26T12:45:00Z',
    events: [
      {
        time: '2022-09-26T12:45:05Z',
        type: 'com.facephi.nest101.transaction.step_changed',
        data: {
          step: 'first step',
        },
      },
      {
        time: '2022-09-26T12:45:10Z',
        type: 'com.facephi.nest101.transaction.status_changed',
        data: {
          status: 'SUCCEEDED',
        },
      },
      {
        time: '2022-09-26T12:45:15Z',
        type: 'com.facephi.nest101.transaction.step_changed',
        data: {
          step: 'second step',
        },
      },
      {
        time: '2022-09-26T12:45:20Z',
        type: 'com.facephi.nest101.transaction.step_changed',
        data: {
          step: 'third step',
        },
      },
      {
        time: '2022-09-26T12:45:25Z',
        type: 'com.facephi.nest101.transaction.status_changed',
        data: {
          status: 'COMPLETED',
        },
      },
    ],
  },
  {
    customId: '1002-ABC',
    time: '2022-09-26T12:45:00Z',
    events: [
      {
        time: '2022-09-26T12:45:05Z',
        type: 'com.facephi.nest101.transaction.step_changed',
        data: {
          step: 'first step',
        },
      },
      {
        time: '2022-09-26T12:45:10Z',
        type: 'com.facephi.nest101.transaction.status_changed',
        data: {
          status: ' ',
        },
      },
      {
        time: '2022-09-26T12:45:15Z',
        type: 'com.facephi.nest101.transaction.step_changed',
        data: {
          step: 'second step',
        },
      },
      {
        time: '2022-09-26T12:45:20Z',
        type: 'com.facephi.nest101.transaction.step_changed',
        data: {
          step: 'third step',
        },
      },
      {
        time: '2022-09-26T12:45:25Z',
        type: 'com.facephi.nest101.transaction.status_changed',
        data: {
          status: 'COMPLETED',
        },
      },
    ],
  },
  {
    customId: '1003-ABC',
    time: '2022-09-26T12:45:00Z',
    events: [
      {
        time: '2022-09-26T12:45:05Z',
        type: 'com.facephi.nest101.transaction.step_changed',
        data: {
          step: 'first step',
        },
      },
      {
        time: '2022-09-26T12:45:10Z',
        type: 'com.facephi.nest101.transaction.status_changed',
        data: {
          status: 'SUCCEEDED',
        },
      },
      {
        time: '2022-09-26T12:45:15Z',
        type: 'com.facephi.nest101.transaction.step_changed',
        data: {
          step: 'second step',
        },
      },
      {
        time: '2022-09-26T12:45:20Z',
        type: 'com.facephi.nest101.transaction.step_changed',
        data: {
          step: 'third step',
        },
      },
      {
        time: '2022-09-26T12:45:25Z',
        type: 'com.facephi.nest101.transaction.status_changed',
        data: {
          status: 'COMPLETED',
        },
      },
    ],
  },
  {
    customId: '1004-ABC',
    time: '2022-09-26T12:45:00Z',
    events: [
      {
        time: '2022-09-26T12:45:05Z',
        type: 'com.facephi.nest101.transaction.step_changed',
        data: {
          step: 'first step',
        },
      },
      {
        time: '2022-09-26T12:45:10Z',
        type: 'com.facephi.nest101.transaction.status_changed',
        data: {
          status: 'SUCCEEDED',
        },
      },
      {
        time: '2022-09-26T12:45:15Z',
        type: 'com.facephi.nest101.transaction.step_changed',
        data: {
          step: 'second step',
        },
      },
      {
        time: '2022-09-26T12:45:20Z',
        type: 'com.facephi.nest101.transaction.step_changed',
        data: {
          step: 'third step',
        },
      },
      {
        time: '2022-09-26T12:45:25Z',
        type: 'com.facephi.nest101.transaction.status_changed',
        data: {
          status: 'COMPLETED',
        },
      },
    ],
  },
];

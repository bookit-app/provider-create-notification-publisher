'use strict';

process.env['pubsub-topic'] = 'TESTTOPIC';

const { stub } = require('sinon');
const chai = require('chai');
const { expect } = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const processor = require('../src/processor');

const data = {
  value: {
    createTime: '2019-10-25T14:48:48.021215Z',
    fields: {
      ownerUid: { stringValue: '101' }
    },
    updateMask: {},
    value: {},
    name:
      'projects/sweng-581-capstone/databases/(default)/documents/ServiceProvider/10001',
    updateTime: '2019-10-25T14:48:48.021215Z'
  }
};

const context = {
  eventId: '5b83b6c4-0910-4a5e-9d73-1921123ac6ca-0',
  eventType: 'providers/cloud.firestore/eventTypes/document.create',
  notSupported: {},
  params: { providerId: '10001' },
  resource:
    'projects/sweng-581-capstone/databases/(default)/documents/ServiceProvider/10001',
  timestamp: '2019-10-25T14:48:48.021215Z'
};

describe('provider-create-notification-publisher: unit tests', () => {
  let topic;

  before(() => {
    topic = {
      publish: stub().resolves()
    };
  });

  afterEach(() => {
    topic.publish.resetHistory();
  });

  it('should publish a message to pubsub', () => {
    const notification = {
      providerId: '10001',
      ownerUid: '101'
    };

    expect(processor(data, context, topic)).to.be.fulfilled.then(() => {
      expect(topic.publish.called).to.be.true;
      expect(
        topic.publish.calledWith(Buffer.from(JSON.stringify(notification)))
      ).to.be.true;
    });
  });

  it('should publish a message with an empty ownerUid', () => {
    const notification = {
      providerId: '10001',
      ownerUid: ''
    };

    const data = {
      value: {
        createTime: '2019-10-25T14:48:48.021215Z',
        fields: {},
        updateMask: {},
        value: {},
        name:
          'projects/sweng-581-capstone/databases/(default)/documents/ServiceProvider/10001',
        updateTime: '2019-10-25T14:48:48.021215Z'
      }
    };

    expect(processor(data, context, topic)).to.be.fulfilled.then(() => {
      expect(topic.publish.called).to.be.false;
    });
  });
});

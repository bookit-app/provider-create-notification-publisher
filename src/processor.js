'use strict';

const logger = require('./logger');
const { isEmpty } = require('lodash');

/**
 * Generates a PubSub notification with details
 * of the service provider which was impacted. The following
 * information is placed into the notification
 *
 * {
 *  providerId: string,
 *  ownerUid: string
 * }
 *
 * @param {*} data
 * @param {*} context
 * @returns {Promise<void>}
 */
module.exports = async (data, context, topic) => {
  const { params } = context;
  let ownerUid = '';

  if (
    isEmpty(data.value) ||
    isEmpty(data.value.fields) ||
    isEmpty(data.value.fields.ownerUid)
  ) {
    logger.error(
      `Provider: ${params.providerId} No data attributes provided and ownerUid is missing for generated notification`
    );
    return;
  } else {
    ownerUid = data.value.fields.ownerUid.stringValue;
  }

  const notification = {
    providerId: params.providerId,
    ownerUid: ownerUid
  };

  logger.info(
    `Generating service provider notification create event for ${JSON.stringify(
      notification
    )}`
  );

  // Generate pubsub notification
  return topic.publish(Buffer.from(JSON.stringify(notification)));
};

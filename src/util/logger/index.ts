/**
 * Log a blank line
 */
const blank = () => {
  log('');
};

/**
 * Log an error object, or a default string
 * @param error
 */
const error = (error: Error) => {
  log(` \u2718 ${(error && error.message) || 'An error has occurred'}`);
};

/**
 * Log a message with a checkmark
 * @param message
 */
const info = (message: string) => {
  if (message === null || message === undefined) {
    return;
  }
  log(` \u2713 ${message}`);
};

/**
 * Log a message to the console
 * @param message
 */
const log = (message: string) => {
  console.log(message);
};

export default {
  blank,
  info,
  error,
  log,
};

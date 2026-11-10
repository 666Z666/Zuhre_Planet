type LogMethod = (...args: unknown[]) => void;

const noop: LogMethod = () => {};

const bindConsole = (method: keyof Console): LogMethod => {
  // eslint-disable-next-line no-console -- This function is the approved console adapter.
  if (typeof console === 'undefined' || typeof console[method] !== 'function') {
    return noop;
  }

  // eslint-disable-next-line no-console -- Bind the selected method at the logger boundary.
  return (console[method] as (...args: unknown[]) => void).bind(console);
};

const browserLogger = {
  error: bindConsole('error'),
  warn: bindConsole('warn'),
  info: bindConsole('info'),
  http: bindConsole('log'),
  debug: bindConsole('debug'),
};

export default browserLogger;

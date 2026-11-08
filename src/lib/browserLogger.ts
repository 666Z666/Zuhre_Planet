type LogMethod = (...args: unknown[]) => void;

const noop: LogMethod = () => {};

const bindConsole = (method: keyof Console): LogMethod => {
  if (typeof console === 'undefined' || typeof console[method] !== 'function') {
    return noop;
  }

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

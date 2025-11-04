import { logActivity } from './activityLogger.js';

const asyncHandler = (fn, moduleName) => (req, res, next) => {
  if (false && moduleName) {
    const userId = req.user?.id || null;
    const actionMap = { POST: 'CREATE', PATCH: 'UPDATE', DELETE: 'DELETE', GET: 'VIEW' };
    const action = actionMap[req.method] || 'UNKNOWN';

    logActivity({
      userId,
      module: moduleName,
      action,
      endpoint: req.originalUrl,
      method: req.method,
      body: req.body && Object.keys(req.body).length ? req.body : null,
      ip: req.ip,
      userAgent: req.headers['user-agent'] || null,
    });
  }

  return Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;

const childProcess = require("node:child_process");

const originalKill = childProcess.ChildProcess.prototype.kill;

childProcess.ChildProcess.prototype.kill = function patchedKill(signal) {
  try {
    return originalKill.call(this, signal);
  } catch (error) {
    if (error && error.code === "EPERM") {
      return false;
    }
    throw error;
  }
};

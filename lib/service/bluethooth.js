import childProcess from 'child_process';

export const lookup = bdaddr => new Promise((resolve, reject) => {
  childProcess.exec(
    `hcitool name ${bdaddr}`,
    (err, stdout, stderr) => {
      if (err || stderr) {
        reject(err || stderr);
        return;
      }
      resolve(stdout);
    });
});

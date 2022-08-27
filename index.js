import fs from 'fs';
import path from "path";

try {
  fs.accessSync(path.join(__dirname, "./locals.json"), fs.constants.F_OK);
} catch (exc) {
  console.error(
    "`locals.json` is not accessible. The file needs to be created by hand and contains configuration about the devices you want to control. In case it exists in the root folder of this project, please check whether the access rights are granted for the same user you are executing the script with. Please see the documentation for more information."
  );
  process.exit(1);
}

require("./lib/main");

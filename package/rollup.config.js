import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import fs from "node:fs";

const executable = () => {
  return {
    name: 'executable',
    writeBundle: (options) => {
        fs.chmodSync(options.file, '755');
    },
  };
};

export default {
  output: {
    banner: '#!/usr/bin/env node',
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    executable()
  ],
  onwarn(message, warn) {
    if (message.code === "EVAL" || message.code == "THIS_IS_UNDEFINED") {
      return;
    }
    warn(message);
  }
}
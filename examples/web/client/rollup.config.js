import nodeResolve from '@rollup/plugin-node-resolve';

import commonjs from '@rollup/plugin-commonjs';

module.exports = {
  plugins: [
    nodeResolve(),
    commonjs()
  ],
};
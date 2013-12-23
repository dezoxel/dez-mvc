require.config({
  paths: {
    // bower components
    'jquery': 'bower_components/jquery/jquery',
    'can': 'bower_components/canjs/amd/can',
    'microevent': 'bower_components/microevent/microevent',
    'router': 'bower_components/dez-router/lib/can-dez-router',
    'normalize': 'bower_components/require-css/normalize',
    'text': 'bower_components/requirejs-text/text',
    'css': 'bower_components/require-css/css',
    'dez-router': 'bower_components/dez-router/lib/router',
    'socket': 'bower_components/socket.io-client/dist/socket.io.min',

    // dez framework
    'dez': 'lib/',
  },
  shim: {
    socket: {exports: 'io'}
  }
});

require.config({
  baseUrl: 'lib/',
  paths: {
    'dez-mvc': '../lib',
    'dez-router': '../bower_components/dez-router/lib/router',
    'microevent': '../bower_components/microevent/microevent',
  },
  shim: {
    underscore: {
      exports: '_'
    }
  }
});

define(['socket'], function(io) {
  'use strict';
  var logPrefix = '[DEZ-MVC][SOCKET-MANAGER]';

  function SocketManager(defaultUrl) {
    this.defaultUrl = defaultUrl;
    this.connections = {};
  }

  SocketManager.prototype.connect = function(name, url) {
    if (this.connections[name]) {
      console.log(logPrefix + '[CONNECT] Already connected! Get existing connection with name: "' + name + '", url: "' + url + '"');
      return this.connections[name];
    }

    console.log(logPrefix + '[CONNECT] Create new with name: "' + name + '", url: "' + url + '"');
    this.connections[name] = io.connect(url);

    return this.connections[name];
  };

  SocketManager.prototype.disonnect = function(name) {
    this.connections[name].disonnect();
    delete this.connections[name];
  };

  SocketManager.prototype.getConnection = function(name) {
    name = name || 'default';

    if (this.connections[name]) {
      return this.connections[name];
    }

    if (name === 'default') {
      return this.connect('default', this.defaultUrl);
    } else {
      throw '[SOCKET-MANAGER][GET CONNECTION] There are no "'+name+'" connection.';
    }
  };

  return SocketManager;
});
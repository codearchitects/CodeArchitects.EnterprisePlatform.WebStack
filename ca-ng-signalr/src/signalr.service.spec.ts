import { TestBed, inject } from '@angular/core/testing';
import { SignalRService } from './signalr.service';
import { HOST_URL } from './host-url.token';
import { HUB_NAMES } from './hub-names.token';

describe('SignalR Service Tests', () => {
  it('should work', () => {});
});

xdescribe('SignalR Service', () => {

  const hostUrl = 'http://fake-host:5000';
  const hubName = 'fake-hub';
  const eventName = 'fake-event';
  const methodName = 'fake-method';

  let sut: SignalRService;
  let connection: SignalR.Hub.Connection;
  let proxy: SignalR.Hub.Proxy;
  let startDefer: JQueryDeferred<any>;
  let connectionSpy: jasmine.Spy;

  beforeEach(() => {
    proxy = <any>{
      on: jasmine.createSpy('on'),
      off: jasmine.createSpy('off'),
      invoke: jasmine.createSpy('invoke')
    };

    startDefer = $.Deferred<any>();

    connection = <any>{
      start: jasmine.createSpy('start').and.returnValue(startDefer.promise()),
      createHubProxy: jasmine.createSpy('createHubProxy').and.returnValue(proxy),
      stateChanged: jasmine.createSpy('stateChanged'),
      disconnected: jasmine.createSpy('disconnected')
    };

    connectionSpy = spyOn($, 'hubConnection').and.returnValue(connection);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HOST_URL, useValue: hostUrl },
        { provide: HUB_NAMES, useValue: [hubName] },
        SignalRService
      ]
    });
  });

  beforeEach(inject([SignalRService], (signalr: SignalRService) => {
    sut = signalr;
  }));

  describe('Service initialization', () => {

    it('should create an hub connection to host URL', () => {
      // Assert
      expect(connectionSpy).toHaveBeenCalledWith(hostUrl);
    });

    it('should create an hub proxy for each hub name', () => {
      // Assert
      expect(connection.createHubProxy).toHaveBeenCalledWith(hubName);
    });

    it('should subscribe to a noOp hub event for fixing this: https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/hubs-api-guide-javascript-client#establishconnection', () => {
      // Assert
      expect(proxy.on).toHaveBeenCalledWith('noOp', jasmine.any(Function));
    });

    it('should subscribe to connection state changed event', () => {
      // Assert
      expect(connection.stateChanged).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it('should start a new connection', () => {
      // Assert
      expect(connection.start).toHaveBeenCalled();
    });

    it('should reconnect if disconnection occurred: https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/handling-connection-lifetime-events#continuousreconnect', () => {
      // Arrange
      jasmine.clock().uninstall();
      jasmine.clock().install();
      const callback = (<jasmine.Spy>connection.disconnected).calls.mostRecent().args[0];

      // Act
      callback();
      jasmine.clock().tick(2000);

      // Assert
      expect(connection.start).toHaveBeenCalledTimes(2);
    });

  });

  describe('Event subscription', () => {

    it('should subscribe to hub event on new subscription', () => {
      // Act
      sut.on(hubName, eventName).subscribe();

      // Assert
      expect(proxy.on).toHaveBeenCalledWith(eventName, jasmine.any(Function));
    });

    it('should emit event when new event arrived from server after subscription', () => {
      // Arrange
      const obs = sut.on(hubName, eventName);
      const callbackArgs = 'fake-args';

      obs.subscribe((args1) => {
        // Assert
        expect(args1).toEqual(callbackArgs);
      });

      // Arrange
      const callback = (<jasmine.Spy>proxy.on).calls.mostRecent().args[1];

      // Act
      callback(callbackArgs);
    });

    it('should unsubscribe from hub event after subscription closing', () => {
      // Arrange
      const obs = sut.on<string>(hubName, eventName).subscribe();
      const callback = (<jasmine.Spy>proxy.on).calls.mostRecent().args[1];

      // Act
      obs.unsubscribe();

      // Assert
      expect(proxy.off).toHaveBeenCalledWith(eventName, callback);
    });

    it('should throw exception on subscription to unexisting hub', () => {
      // Assert
      expect(() => sut.on('unexisting-hub', eventName)).toThrowError('Unable to find Hub: unexisting-hub. Please, consider to register it on CA SignaR Module initialization.');
    });

  });

  describe('Method invocation', () => {
    let callback: (arg: SignalR.StateChanged) => void;

    beforeEach(() => {
      // Arrange
      callback = (<jasmine.Spy>connection.stateChanged).calls.mostRecent().args[0];
    });

    it('should wait start for server method invocation', () => {
      // Act
      sut.invoke(hubName, methodName);
      startDefer.resolve();

      // Assert
      expect(proxy.invoke).toHaveBeenCalledWith(methodName);
    });

    it('should invoke server method on method invocation after start', () => {
      // Act
      callback({ newState: $.signalR.connectionState.connected, oldState: $.signalR.connectionState.disconnected });
      sut.invoke(hubName, methodName);

      // Assert
      expect(proxy.invoke).toHaveBeenCalledWith(methodName);
    });

    it('should pass arguments to server method on method invocation after start', () => {
      // Arrange
      const args1 = 'fake-args-1', args2 = 'fake-args-2';

      // Act
      callback({ newState: $.signalR.connectionState.connected, oldState: $.signalR.connectionState.disconnected });
      sut.invoke(hubName, methodName, args1, args2);

      // Assert
      expect(proxy.invoke).toHaveBeenCalledWith(methodName, args1, args2);
    });

    it('should throw exception on subscription to unexisting hub', () => {
      // Assert
      expect(() => sut.invoke('unexisting-hub', methodName)).toThrowError('Unable to find Hub: unexisting-hub. Please, consider to register it on CA SignaR Module initialization.');
    });

  });

});

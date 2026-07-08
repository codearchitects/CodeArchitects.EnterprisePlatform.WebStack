import { SignalRManager } from './signalr.manager';
import { HubMessage, ILogger, LogLevel, MessageType, NullLogger } from '@microsoft/signalr';
import { TextMessageFormat } from '@microsoft/signalr/dist/esm/TextMessageFormat';

/**
 * Creates an array of {@link @microsoft/signalr.HubMessage} objects from the specified serialized representation.
 * CA-Platform override of {@link https://github.com/dotnet/aspnetcore/blob/main/src/SignalR/clients/ts/signalr/src/JsonHubProtocol.ts}
 * @param {string} input A string containing the serialized representation.
 * @param {ILogger} logger A logger that will be used to log messages that occur during parsing.
*/
export function parseMessages(input: string, logger: ILogger): HubMessage[] {
  // The interface does allow "ArrayBuffer" to be passed in, but this implementation does not. So let's throw a useful error.
  if (typeof input !== 'string') {
    throw new Error('Invalid input for JSON hub protocol. Expected a string.');
  }

  if (!input) {
    return [];
  }

  if (logger === null) {
    logger = NullLogger.instance;
  }

  // Parse the messages
  const messages = TextMessageFormat.parse(input);

  const hubMessages = [];
  for (const message of messages) {
    let parsedMessage: HubMessage;
    try {
      parsedMessage = SignalRManager.serializer.deserialize(message) as HubMessage;
      if (SignalRManager.dataContext) {
        SignalRManager.dataContext.attach(parsedMessage);
      };
    } catch (ex) {
      console.error(`SIGNALR Error parsing message: ${ex}. Trying with default message parsing.`);
      parsedMessage = JSON.parse(message) as HubMessage;
    }
    if (typeof parsedMessage.type !== 'number') {
      throw new Error('Invalid payload.');
    }
    switch (parsedMessage.type) {
      case MessageType.Invocation:
        this._isInvocationMessage(parsedMessage);
        break;
      case MessageType.StreamItem:
        this._isStreamItemMessage(parsedMessage);
        break;
      case MessageType.Completion:
        this._isCompletionMessage(parsedMessage);
        break;
      case MessageType.Ping:
        // Single value, no need to validate
        break;
      case MessageType.Close:
        // All optional values, no need to validate
        break;
      default:
        // Future protocol changes can add message types, old clients can ignore them
        logger.log(LogLevel.Information, 'Unknown message type \'' + parsedMessage.type + '\' ignored.');
        continue;
    }
    hubMessages.push(parsedMessage);
  }

  return hubMessages;
}

import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  users = {};

  handleConnection(client: Socket) {
    // Можно добавить логику авторизации
    const username = client.handshake.query.username as string;
    if (username) {
      this.users[username] = client.id;
    }
  }

  handleDisconnect(client: Socket) {
    // Удалить пользователя при отключении
    const username = Object.keys(this.users).find(
      (id) => this.users[id] === client.id,
    );
    if (username) {
      delete this.users[username];
    }
  }

  sendNotification(username: string, message: string) {
    const clientId = this.users[username];
    if (clientId) {
      this.server.to(clientId).emit('notification', message);
    }
  }
}

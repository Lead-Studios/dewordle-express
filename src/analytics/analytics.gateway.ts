import {
  WebSocketGateway,
  WebSocketServer,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  SubscribeMessage,
} from "@nestjs/websockets"
import type { Server, Socket } from "socket.io"
import type { RedisService } from "../redis/redis.service"

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class AnalyticsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private eventSubscriptions: Map<string, Set<string>> = new Map()

  constructor(private redisService: RedisService) {
    this.setupRedisSubscription()
  }

  private async setupRedisSubscription() {
    const redisClient = this.redisService.getClient().duplicate()

    await redisClient.connect()

    // Subscribe to all event update channels
    await redisClient.pSubscribe("event:*:sales:update", (message, channel) => {
      const eventId = channel.split(":")[1]
      this.broadcastToEventRoom(eventId, "salesUpdate", JSON.parse(message))
    })
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`)

    // Remove client from all event rooms
    this.eventSubscriptions.forEach((clients, eventId) => {
      if (clients.has(client.id)) {
        clients.delete(client.id)
        client.leave(`event:${eventId}`)
      }
    })
  }

  @SubscribeMessage("subscribeToEvent")
  handleSubscribeToEvent(client: Socket, eventId: string) {
    client.join(`event:${eventId}`)

    if (!this.eventSubscriptions.has(eventId)) {
      this.eventSubscriptions.set(eventId, new Set())
    }

    this.eventSubscriptions.get(eventId).add(client.id)

    return { success: true, message: `Subscribed to event ${eventId}` }
  }

  @SubscribeMessage("unsubscribeFromEvent")
  handleUnsubscribeFromEvent(client: Socket, eventId: string) {
    client.leave(`event:${eventId}`)

    if (this.eventSubscriptions.has(eventId)) {
      this.eventSubscriptions.get(eventId).delete(client.id)
    }

    return { success: true, message: `Unsubscribed from event ${eventId}` }
  }

  private broadcastToEventRoom(eventId: string, event: string, data: any) {
    this.server.to(`event:${eventId}`).emit(event, data)
  }
}


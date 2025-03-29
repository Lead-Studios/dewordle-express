import { Injectable, type OnModuleDestroy, type OnModuleInit } from "@nestjs/common"
import { createClient } from "redis"

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: ReturnType<typeof createClient>

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    })
  }

  async onModuleInit() {
    await this.client.connect()
  }

  async onModuleDestroy() {
    await this.client.disconnect()
  }

  getClient() {
    return this.client
  }

  async set(key: string, value: any, ttl?: number) {
    if (ttl) {
      await this.client.set(key, JSON.stringify(value), { EX: ttl })
    } else {
      await this.client.set(key, JSON.stringify(value))
    }
  }

  async get(key: string) {
    const value = await this.client.get(key)
    if (value) {
      return JSON.parse(value)
    }
    return null
  }

  async publish(channel: string, message: any) {
    await this.client.publish(channel, JSON.stringify(message))
  }
}


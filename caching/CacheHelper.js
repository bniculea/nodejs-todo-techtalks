const Redis = require("ioredis")

class CacheHelper {
    redis;

    constructor(){
        // do nothing
    }

    static getInstance(){
        if (!this.instance){
            this.instance = new CacheHelper()
        }

        if (!this.instance?.redis){
            this.instance.redis = new Redis(
                    process.env.REDIS_HOST,
                {
                    maxRetriesPerSecond: 3,
                }
            )
        }

        return this.instance
    }

    async get(key) {
        const cachedValue = await this.redis?.get(key) ?? null

        return JSON.parse(cachedValue)
    }

    set(key, value, ttl) {
        const TTL_UNIT_SECONDS = 'EX'
        const stringifiedValue = JSON.stringify(value)
        this.redis?.set(key, stringifiedValue, TTL_UNIT_SECONDS, ttl)
    }
}

module.exports = CacheHelper

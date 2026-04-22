
const CACHE_KEYS = {
  CHAT: (hash) => `chat:${hash}`,
  USER: (userId) => `user:${userId}`,
  SEMANTIC: (hash) => `semantic:${hash}`
};

module.exports = CACHE_KEYS;
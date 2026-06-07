const { Pinecone } = require("@pinecone-database/pinecone");

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.index("jarvisync");

console.log("Pinecone connected ✅");

async function createVector({ userId, chatId, messageId, vectors, metadata }) {
  const record = {
    id: messageId.toString(),
    values: Array.from(vectors),
    metadata: {
      userId: userId.toString(),
      chatId: chatId.toString(),
      messageId: messageId.toString(),
      text: metadata.text,
      role: metadata.role,
    },
  };

  await index.upsert({ records: [record] });
}

async function queryVectors({ queryVector, limit = 5, metadata }) {
  const filter = {};
  if (metadata?.user) filter.userId = { $eq: metadata.user.toString() };
  if (metadata?.chat) filter.chatId = { $eq: metadata.chat.toString() };

  const results = await index.query({
    vector: queryVector,
    topK: limit,
    includeMetadata: true,
    filter: Object.keys(filter).length ? filter : undefined,
  });

  return (results.matches || []).map((match) => ({
    messageId: match.metadata?.messageId,
    metadata: {
      text: match.metadata?.text,
      role: match.metadata?.role,
    },
    score: match.score,
  }));
}

async function deleteVectorsByChatId(chatId) {
  await index.delete({
    filter: {
      chatId: { $eq: chatId.toString() },
    },
  });
}

module.exports = {
  createVector,
  queryVectors,
  deleteVectorsByChatId,
};

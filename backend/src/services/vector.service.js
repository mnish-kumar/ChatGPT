const { createClient } = require("@supabase/supabase-js");

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPABASE_API_SECRET,
);

async function createVector({ vectors, metadata, messageId }) {
  const { data, error } = await supabase.from("vectors").insert([
    {
        message_id: messageId,
      embedding: vectors,
      metadata: metadata,
    },
  ]);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function queryVectors({ queryVector, limit = 5, metadata }) {
  const { data, error } = await supabase.rpc("match_vectors", {
    query_embedding: queryVector,
    match_count: limit,
    filter_chat: metadata?.chat || null,
    filter_user: metadata?.user || null,
  });

  if (error) throw new Error(error.message);

  return data;
}

module.exports = {
  createVector,
    queryVectors,
};

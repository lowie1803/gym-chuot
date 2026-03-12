/**
 * Deterministic conversation ID from two user UIDs.
 * Sorted so both parties get the same ID.
 */
export function getConversationId(uid1, uid2) {
  return [uid1, uid2].sort().join("_");
}

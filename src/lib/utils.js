/**
 * Deterministic conversation ID from two user UIDs.
 * Sorted so both parties get the same ID.
 */
export function getConversationId(uid1, uid2) {
  return [uid1, uid2].sort().join("_");
}

/**
 * Vietnamese relative time string.
 */
export function formatRelativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "vừa xong";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

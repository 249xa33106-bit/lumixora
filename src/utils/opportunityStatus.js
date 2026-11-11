/**
 * Calculates live real-time status of hackathons and internships based on their deadline.
 *
 * Rules:
 * - If deadline has passed (< 0 hours remaining): status = 'Closed'
 * - If deadline is imminent (within 5 days / 120 hours): status = 'Closing Soon'
 * - If fallbackStatus is 'Upcoming' and deadline is > 5 days out: status = 'Upcoming'
 * - Otherwise: status = 'Open' (or 'Actively Hiring' for internships)
 */
export function getLiveStatus(deadline, fallbackStatus, defaultOpenLabel = 'Open') {
  if (!deadline) return fallbackStatus || defaultOpenLabel;

  try {
    const targetDate = new Date(`${deadline}T23:59:59`);
    const now = new Date();
    const diffHours = (targetDate - now) / (1000 * 60 * 60);

    if (diffHours < 0) {
      return 'Closed';
    }

    if (diffHours <= 120) {
      return 'Closing Soon';
    }

    if (fallbackStatus === 'Upcoming' && diffHours > 120) {
      return 'Upcoming';
    }

    return defaultOpenLabel;
  } catch {
    return fallbackStatus || defaultOpenLabel;
  }
}

/**
 * Returns human-readable countdown / deadline label
 */
export function getRemainingDays(deadline) {
  if (!deadline) return null;
  try {
    const targetDate = new Date(`${deadline}T23:59:59`);
    const now = new Date();
    const diffMs = targetDate - now;
    if (diffMs < 0) return 'Closed';
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Closing Today';
    if (diffDays === 1) return '1 Day Left';
    return `${diffDays} Days Left`;
  } catch {
    return null;
  }
}

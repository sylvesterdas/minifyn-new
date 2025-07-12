'use server';

import { db } from './firebase-admin';
import { format, subDays } from 'date-fns';

/**
 * Deletes rate-limiting data from the Firebase Realtime Database that is older than a specified number of days.
 * This is intended to be run periodically by a scheduled task (e.g., a Cloud Function).
 * 
 * @param {number} daysToKeep - The number of days of rate-limiting data to retain. Defaults to 30.
 */
export async function deleteOldRateLimits(daysToKeep: number = 30): Promise<{deletedKeys: string[], error?: string}> {
  console.log(`Starting cleanup job. Retaining data from the last ${daysToKeep} days.`);

  const cutoffDate = subDays(new Date(), daysToKeep);
  const limitsRef = db.ref('limits');
  const deletedKeys: string[] = [];

  try {
    const snapshot = await limitsRef.once('value');
    if (!snapshot.exists()) {
      console.log('No "limits" data found to clean up.');
      return { deletedKeys };
    }

    const allDates = snapshot.val();
    const promises: Promise<void>[] = [];

    for (const dateKey in allDates) {
      // The keys are in 'YYYY-MM-DD' format.
      // We can compare them lexicographically, but converting to Date objects is safer.
      const keyDate = new Date(dateKey);
      
      if (keyDate < cutoffDate) {
        console.log(`Scheduling deletion for old data at: ${dateKey}`);
        deletedKeys.push(dateKey);
        promises.push(limitsRef.child(dateKey).remove());
      }
    }

    if (promises.length > 0) {
      await Promise.all(promises);
      console.log(`Successfully deleted ${promises.length} old rate limit entries.`);
    } else {
      console.log('No old data found to delete.');
    }

    return { deletedKeys };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Failed to clean up old rate limits:', errorMessage);
    return { deletedKeys: [], error: errorMessage };
  }
}

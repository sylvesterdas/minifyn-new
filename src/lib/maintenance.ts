
'use server';

import { db } from './firebase-admin';
import { subDays, subMonths } from 'date-fns';

const MAINTENANCE_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Triggers maintenance tasks if the required interval has passed.
 * This function is designed to be called in a "fire-and-forget" manner.
 */
export async function triggerMaintenance(): Promise<void> {
  const lastRunRef = db.ref('maintenance/lastRun');
  try {
    const snapshot = await lastRunRef.once('value');
    const lastRun = snapshot.val() || 0;

    if (Date.now() - lastRun > MAINTENANCE_INTERVAL) {
      // Update the timestamp first to prevent race conditions
      await lastRunRef.set(Date.now());
      console.log('Maintenance interval passed. Running cleanup tasks.');
      
      // Run maintenance tasks asynchronously
      await Promise.all([
        deleteOldDailyRateLimits(),
        deleteOldMonthlyRateLimits()
      ]);

      console.log('Maintenance tasks completed.');
    }
  } catch (error) {
    console.error('Error during maintenance trigger:', error);
  }
}

/**
 * Deletes daily rate-limiting data older than a specified number of days.
 */
export async function deleteOldDailyRateLimits(daysToKeep: number = 2): Promise<{deletedKeys: string[], error?: string}> {
  console.log(`Starting daily limits cleanup. Retaining data from the last ${daysToKeep} days.`);

  const cutoffDate = subDays(new Date(), daysToKeep);
  const limitsRef = db.ref('daily_limits');
  const deletedKeys: string[] = [];

  try {
    const snapshot = await limitsRef.once('value');
    if (!snapshot.exists()) {
      console.log('No "daily_limits" data found to clean up.');
      return { deletedKeys };
    }

    const allDates = snapshot.val();
    const promises: Promise<void>[] = [];

    for (const dateKey in allDates) {
      const keyDate = new Date(dateKey);
      if (keyDate < cutoffDate) {
        console.log(`Scheduling deletion for old daily data at: ${dateKey}`);
        deletedKeys.push(dateKey);
        promises.push(limitsRef.child(dateKey).remove());
      }
    }

    if (promises.length > 0) {
      await Promise.all(promises);
      console.log(`Successfully deleted ${promises.length} old daily rate limit entries.`);
    }

    return { deletedKeys };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Failed to clean up old daily rate limits:', errorMessage);
    return { deletedKeys: [], error: errorMessage };
  }
}

/**
 * Deletes monthly rate-limiting data older than a specified number of months.
 */
export async function deleteOldMonthlyRateLimits(monthsToKeep: number = 2): Promise<{deletedKeys: string[], error?: string}> {
  console.log(`Starting monthly limits cleanup. Retaining data from the last ${monthsToKeep} months.`);

  const cutoffDate = subMonths(new Date(), monthsToKeep);
  const limitsRef = db.ref('monthly_limits');
  const deletedKeys: string[] = [];

  try {
    const snapshot = await limitsRef.once('value');
    if (!snapshot.exists()) {
      console.log('No "monthly_limits" data found to clean up.');
      return { deletedKeys };
    }

    const allMonths = snapshot.val();
    const promises: Promise<void>[] = [];

    for (const monthKey in allMonths) { // monthKey is 'YYYY-MM'
      const keyDate = new Date(`${monthKey}-01`); // Treat it as the first of the month
      if (keyDate < cutoffDate) {
        console.log(`Scheduling deletion for old monthly data at: ${monthKey}`);
        deletedKeys.push(monthKey);
        promises.push(limitsRef.child(monthKey).remove());
      }
    }

    if (promises.length > 0) {
      await Promise.all(promises);
      console.log(`Successfully deleted ${promises.length} old monthly rate limit entries.`);
    }

    return { deletedKeys };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Failed to clean up old monthly rate limits:', errorMessage);
    return { deletedKeys: [], error: errorMessage };
  }
}

    
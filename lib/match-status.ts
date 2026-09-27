/**
 * Interprets the status/phase of a fixture returned by our API.
 *
 * The API sends a short status code (NS, 1H, HT, 2H, ET, P, FT, AET, PEN...)
 * and a phase (NOT_STARTED, FIRST_HALF, HALF_TIME, ...). A match is live
 * during either half, half-time, extra time and a penalty shootout.
 */
const LIVE_PHASES = new Set(['FIRST_HALF', 'HALF_TIME', 'SECOND_HALF', 'EXTRA_TIME', 'PENALTY_SHOOTOUT']);
const FINISHED_PHASES = new Set(['FULL_TIME', 'AFTER_EXTRA_TIME', 'AFTER_PENALTIES']);
const FINISHED_CODES = new Set(['FT', 'AET', 'PEN']);

interface FixtureStatus {
  status?: string;
  phase?: string;
  minute?: number | null;
  startTime?: string;
}

export function isLiveFixture(fixture: FixtureStatus): boolean {
  return fixture.status === 'LIVE' || LIVE_PHASES.has(fixture.phase ?? '');
}

export function isFinishedFixture(fixture: FixtureStatus): boolean {
  return FINISHED_CODES.has(fixture.status ?? '') || FINISHED_PHASES.has(fixture.phase ?? '');
}

/** Status bucket and the label shown next to the score */
export function describeFixtureStatus(fixture: FixtureStatus): {
  status: 'live' | 'upcoming' | 'finished';
  time: string;
} {
  if (isLiveFixture(fixture)) {
    if (fixture.phase === 'HALF_TIME') return { status: 'live', time: 'HT' };
    if (fixture.phase === 'PENALTY_SHOOTOUT') return { status: 'live', time: 'PEN' };
    return { status: 'live', time: fixture.minute ? `${fixture.minute}'` : 'LIVE' };
  }

  if (isFinishedFixture(fixture)) {
    // FT, or AET / PEN for matches decided after extra time or on penalties
    return { status: 'finished', time: FINISHED_CODES.has(fixture.status ?? '') ? fixture.status! : 'FT' };
  }

  let time = 'TBD';
  if ((fixture.status === 'NS' || fixture.phase === 'NOT_STARTED') && fixture.startTime) {
    time = new Date(fixture.startTime).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return { status: 'upcoming', time };
}

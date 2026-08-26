import { Button } from '../button';
import { EmptyState } from '../empty-state';

/**
 * What a table shows in place of rows: loading, the API error (with a retry),
 * or the page's own empty state once a load has genuinely returned nothing.
 */
export function TableState({ loading, error, onRetry, children }) {
  if (loading) {
    return <EmptyState title="Loading from Stripe…" body="Fetching your sandbox data." />;
  }

  if (error) {
    return (
      <EmptyState
        icon="!"
        title="Couldn't reach Stripe"
        body={error}
        actions={<Button onClick={onRetry}>Try again</Button>}
      />
    );
  }

  return children;
}

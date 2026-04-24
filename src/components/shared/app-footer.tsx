declare const APP_VERSION: string;
declare const APP_LAST_MODIFIED: string;

export function AppFooter() {
  return (
    <footer className="w-full pt-2">
      <p className="text-center text-sm text-muted-foreground">
        v{APP_VERSION} | Last modified: {APP_LAST_MODIFIED}
      </p>
    </footer>
  );
}

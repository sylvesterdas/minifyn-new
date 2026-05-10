# ScamGuard App Announcements

Use this endpoint to send one-time, privacy-preserving announcements to users who enabled app notifications and stayed subscribed to app announcements.

```bash
curl -sS -X POST 'https://www.minifyn.com/api/linkguard/announcements/send' \
  -H "Authorization: Bearer ${LINKGUARD_BEARER_TOKEN}" \
  -H 'content-type: application/json' \
  --data '{"title":"ScamGuard update","body":"LinkGuard is now ScamGuard: Link Checker.","dryRun":true}'
```

Set `dryRun` to `false` or omit it to send through FCM topic `announcements`.

The route intentionally remains under `/api/linkguard/*` for Android app compatibility.

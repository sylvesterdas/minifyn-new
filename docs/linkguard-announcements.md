# ScamGuard App Announcements

Use this endpoint to send one-time, privacy-preserving announcements to users who enabled app notifications and stayed subscribed to app announcements.

```bash
curl -sS -X POST 'https://www.minifyn.com/api/scamguard/v1/announcements/send' \
  -H "Authorization: Bearer ${LINKGUARD_BEARER_TOKEN}" \
  -H 'content-type: application/json' \
  --data '{"title":"ScamGuard update","body":"LinkGuard is now ScamGuard: Link Checker.","dryRun":true}'
```

Set `dryRun` to `false` or omit it to send through FCM topic `announcements`.

The canonical route is `/api/scamguard/v1/announcements/send`. The legacy
`/api/linkguard/announcements/send` route remains available for compatibility.

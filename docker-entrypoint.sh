#!/bin/sh
set -e

# ECS ephemeral volumes (mounted at /tmp and /app/.next/cache) are owned by
# root regardless of the image's USER directive. Fix ownership for the paths
# the app needs to write to, then drop privileges to the unprivileged user.
chown -R nextjs:nodejs /app/.next/cache /tmp 2>/dev/null || true

# Drop to the non-root user and exec the application (PID 1).
exec su-exec nextjs:nodejs "$@"

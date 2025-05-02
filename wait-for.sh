#!/usr/bin/env sh
host="$1"; shift
port="$1"; shift

until nc -z "$host" "$port"; do
  echo "Waiting for $host:$port…" >&2
  sleep 2
done

exec "$@"

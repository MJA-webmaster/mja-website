Failed to compile.
./lib/supabase/server.ts:15:16
Type error: Parameter 'cookiesToSet' implicitly has an 'any' type.
  13 |           return cookieStore.getAll()
  14 |         },
> 15 |         setAll(cookiesToSet) {
     |                ^
  16 |           try {
  17 |             cookiesToSet.forEach(({ name, value, options }) =>
  18 |               cookieStore.set(name, value, options)
Error: Command "npm run build" exited with 1

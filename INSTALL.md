# ThePoloClub.BLR - Event Registration + Code of Conduct

Three files. Upload them keeping the exact folder structure.

## Files in this zip

    components/events/RegisterDialog.tsx          <- the T&C modal (self-contained)
    components/events/EventRegisterButton.tsx     <- drop-in button
    app/api/events/[slug]/register/route.ts       <- validates + builds WhatsApp link

No imports from `lib/` anywhere, so nothing here can break on your
`Event` type from `lib/types.ts`.

## How to upload to GitHub

1. Delete the old `components/events/RegisterDialog.tsx` and
   `app/api/events/[slug]/register/route.ts` if they still exist.
2. Repo home -> **Add file** -> **Upload files**
3. Drag the `components` and `app` folders straight in. GitHub keeps the
   folder structure when you drag folders, so the paths land correctly.
4. Commit.

Uploading avoids the copy-paste corruption that kept dropping the `<a` tag.

## Last step - wire the button into your event card

Open `components/sections/UpcomingEvents.tsx` and add the import at the top:

    import EventRegisterButton from "@/components/events/EventRegisterButton";

Then inside each card, below the description, add:

    <EventRegisterButton title={event.title} />

Pass whatever extra fields you have - all optional:

    <EventRegisterButton
      title={event.title}
      date={event.event_date}
      location={event.location}
    />

`UpcomingEvents.tsx` does NOT need `"use client"` - the button carries its
own. Leave the rest of that file alone.

## Flow

Card button -> full Code of Conduct, scroll-gated -> checkbox unlocks ->
name / WhatsApp number / car -> POST to the API -> green button opens
WhatsApp with a pre-filled message to 7795980263.

## Two things to do next

**Nothing is saved yet.** The route returns a WhatsApp link and stores no
record. If someone registers and never sends the message, you have no
trace of them. Create a `registrations` table in Supabase and uncomment
the insert block in `route.ts`.

Suggested columns:

    id                     uuid, default gen_random_uuid()
    event_title            text
    name                   text
    phone                  text
    car                    text, nullable
    accepted_coc_version   text
    accepted_at            timestamptz

Use the **service role key** for that insert (server-side only, never
`NEXT_PUBLIC_`), or add an RLS insert policy.

**`COC_VERSION` appears in two files** - `RegisterDialog.tsx` and
`route.ts`. They must match or every registration fails with a 409. When
you edit the Code of Conduct text, change both. Once you have a stored
record, this is what proves which version a member accepted and when.

## Note on the WhatsApp link

`wa.me/917795980263` opens a direct chat with that number - it is not a
group invite. Someone has to add each person manually. To automate it,
create the group, get its `chat.whatsapp.com/...` invite link, and swap
`CLUB_WHATSAPP` usage in `route.ts` for that URL. Reset the group link
after each drive so old ones go dead.

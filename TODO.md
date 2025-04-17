# To-Do List

## To be implemented

Note that the tasks described here may not exactly be the same once implemented on the bot (for example command names or behavior can change).

### Features

- [ ] Make `/info` and `/remove` autocomplete with items from the queue

### Bug Fixes

- [ ] Enormous delay between each song

### Performance Optimizations

- *nothing*

### New Commands

- [ ] `/config`: change various settings on the bot
- [ ] `/rmdupes`: removes duplicate songs from the queue
- [ ] `/lock`: locks the bot to only the user who executed this command and administrators
- [ ] `/save`: save the current queue to a playlist
  - [ ] `/load`: loads a saved playlist
  - [ ] `/list`: lists all saved playlists
  - [ ] `/delete`: deletes a saved playlist

----

## Completed

The completed tasks are ordered by completion date (most recent is at the bottom).

### Features

- [x] <s>A feature to restart the bot (so the CI server can restart it after deploying)</s>
- [x] <s>Add buttons to command outputs</s>
    * <s>Create a `CommandAction` class that allows to emulate slash commands</s>
- [x] <s>Support for Argon</s>
- [x] <s>Support for Bandcamp</s>
- [x] <s>Support for SoundCloud</s>
- [x] <s>Disconnect the bot after 30 minutes of inactivity (`VoiceBase.playing` is `false`; do NOT check
  for `VoiceBase.paused`)</s>
- [x] <s>Support for HTTP files</s>
- [x] <s>If the URL given to `/add` is a playlist, add all the videos in that playlist to the queue</s>
- [x] <s>Save history of played songs so it is easier to find songs that have already been played</s>
    * <s>The `/search` command can use autocompletion and complete with history results</s>
- [x] <s>Pass titles through [YouToo](https://gitlab.minteck.org/minteck/youtoo)'s "magic" title parser</s>
- [x] <s>`/queue` gives the duration (in minutes) of the entire queue</s>
- [x] <s>Block playing songs that are longer than 10 minutes</s>
- [x] <s>Volume normalization</s>
- [x] <s>Make `/queue` more consistent</s>
  - <s>`01.` (`00:00`) Song name</s>
- [x] <s>On `/queue`, show time when the playlist will be done</s>
- [x] <s>Make `/lyrics` fetch lyrics from Bandcamp</s>
- [x] <s>Prevent `RESTART` when the bot is playing</s>
- [x] <s>Properly handle connection issues</s>
- [x] <s>More logging</s>
- [x] <s>History matches from SoundCloud result in corrupt entries</s>
- [x] <s>Better loading items with cool messages (like what Discord did)</s>

### Bug Fixes

- [x] <s>Connection reset for random reasons</s>
- [x] <s>Webhook errors for random reasons</s>
- [x] <s>Handle being disconnected by a server moderator (right click > Disconnect)</s>
  * <s>This will be harder than expected: class `VoiceConnectionEvents` in `@discordjs/voice` is totally undocumented.</s>
- [x] <s>`/tmp/stream.ogg` is not deleted automatically</s>
- [x] <s>Playing songs from Argon 2 times without wiping /tmp results in an error (BugCheck 0xD460A59A)</s>
- [x] <s>Detect and prevent restart loops (more than 1 restart within 1 minute)</s>

### Performance Optimizations

- [x] <s>On `QueueManager.add`, don't use both `ytdl-core` and the `yt-dlp` command to get metadata</s>

### New Commands

- [x] <s>`/search`: search on YouTube instead of using the full video URL</s>
- [x] <s>`/logs`: displays the bots logs</s>
- [x] <s>`/lyrics`: get lyrics for the currently playing song (probably
  use [`genius-api-client`](https://npmjs.com/package/genius-api-client))</s>
- [x] <s>`/shuffle`: randomly changes the queue's order</s>
- [x] <s>`/restart`: restart the bot</s>
- [x] <s>`/random`: picks a random item from history and adds it to the queue</s>
- [x] <s>`/about`: more user-friendly debugging information</s>
- [x] <s>`/skipto`: skip to a certain item in the queue</s>
- [x] <s>`/loopone`: repeat the current playing song instead of the whole queue (`/loop`)</s>
- [x] <s>`/nowplaying`: shows info about the currently playing song</s>
- [x] <s>`/info`: gets info about a song in the queue (who added, when, ...)</s>
- [x] <s>`/clear`: clears all songs in the queue</s>
- [x] <s>`/autodj`: Auto-DJ</s>

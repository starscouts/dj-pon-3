# DJ Pon-3

A music bot for Discord.

## Platform Status

| Platform                             | Playback            | Search              | Batch enqueueing |
|--------------------------------------|---------------------|---------------------|------------------|
| [YouTube](https://youtube.com)       | ✅ Supported         | ✅ Supported         | ✅ Supported      |
| [Bandcamp](https://bandcamp.com)     | ✅ Supported         | *Not applicable*    | ✅ Supported      |
| [SoundCloud](https://soundcloud.com) | ✅ Supported         | ✅ Supported         | ✅ Supported      |
| [Argon](https://argon.minteck.org)   | ✅ Supported         | *Not applicable*    | ✅ Supported      |
| HTTP files                           | ✅ Supported         | *Not applicable*    | *Not applicable* |
| Local files                          | **⛔ Not supported** | **⛔ Not supported** | *Not applicable* |

### Why are some features 'Not applicable'?
* **Bandcamp, Search**: `yt-dlp` does not support searching Bandcamp
* **Argon, Search**: Argon does not have a search engine
* **HTTP files, Search**: It is not possible to search for HTTP files
* **HTTP files, Batch enqueuing**: There is no way to group multiple HTTP files together
* **Local files, Batch enqueuing**: Local files are supposed to be unsorted, so queuing multiple files would be complicated
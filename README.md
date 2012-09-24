vlc_party_vis
=============

snippets of code for ballroom dance party software

Context: I am a ballroom dancer, and I am sometimes called upon to run
social dances. I have been looking for ways to provide the music in a
way that appeals to ballroom dancers, while freeing me up to dance
instead of having to play DJ. This git provides the code and
modifications I use to make this happen. 

The main features I look for out of the software I am using are
* Automatically create a dance playlist with a variety of selection
  criteria for songs
* When playing the music, display the current song along with what
  dance goes with the song, as well as the dances for the next few
  songs.
  <img src="screen_shot.png"/>

## Prerequisites
* A digital library of music tagged such that ID3v2 tag TCON contains
  the dance style for the music, e.g., Waltz or Salsa.
* VLC
* Apache
* Phusion Passenger
* Ruby
** Sinatra

## Hacks
### VLC
VLC very nicely provides a web interface. A little bit of hacking of
that web interface provides much of what I need in terms of playing
and visualizing a playlist.

All the files I created, and changes to existing files, may be found
under the vlc directory. 

The VLC http interface makes heavy use of jquery. 

#### Modified Files
##### js/controlers.js
added
<code>$('#mediaGenre').append($('[name="genre"]',data).text());</code>
right after <code>
$('#mediaTitle').append($('[name="filename"]', data).text()); </code> 

##### js/common.js
modified the function <code>format_time</code> so that it doesn't
return hours if the hours are zero.

#### New Files
##### party.html
html for the new visualization

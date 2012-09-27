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
  <img src="https://github.com/lorenzofarris/vlc_party_vis/blob/master/screen_shot.png?raw=true"/>

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

##### js/upcoming.js
javascript code to grab the playlist from vlc, find out the current
song playing from the playlist, and get the genres of the next few
songs from the mp3 files. This code is the point of all these vlc
specific files, otherwise you could just use their mobile
interface. It requires the ruby code under <code> genre </code> in
this git.

##### css/party.css

Some simple styling to make the visualization clear.

### Apache

I'm using apache on my mac. The principles for making this work on 
other platforms, with other web servers, should be about the same,
although the details will vary. The mac comes with apache. If you want 
be more minimal about the configuration, or Passenger doesn't work for
you, you can just run <code>genre</code> as a rack application, and
use Apache's proxying ability. In the proxy configuration below, by
default VLC's http interface listens on port 8080.

#### Phusion Passenger aka mod_rails

I used this to make my life a little easier. You can get it, 
and installation directions, from
https://www.phusionpassenger.com/download

That being said, you could also make this work launching 

#### Apache configs
##### in httpd.conf
<pre>
LoadModule passenger_module /Library/Ruby/Gems/1.8/gems/passenger-3.0.17/ext/apache2/mod_passenger.so
PassengerRoot /Library/Ruby/Gems/1.8/gems/passenger-3.0.17
PassengerRuby /System/Library/Frameworks/Ruby.framework/Versions/1.8/usr/bin/ruby
ProxyPass /vlc/ http://localhost:8080/
ProxyPassReverse /vlc/ http://localhost:8080/
</pre>
##### in /etc/apache2/extra/httpd-vhosts.conf
<pre>
<VirtualHost *:80>
    ServerAdmin farrisl@amazon.com
    DocumentRoot <apps directory>
    ServerName this
    ServerAlias this
    ErrorLog "/private/var/log/apache2/this-error_log"
    CustomLog "/private/var/log/apache2/this-access_log" common
    <Directory <apps directory> >
        Allow from all
    </Directory>
    RackBaseURI /genre
    <Directory <apps directory>/genre >
        Options -MultiViews
    </Directory>
</VirtualHost>
</pre>

## New App
### Genre
This web app just grabs the ID3v2 genre from the mp3 file. It is a web
app because it is used by jquery. 